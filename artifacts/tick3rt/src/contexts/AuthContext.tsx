import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export type AppRole = "user" | "organizer" | "admin";

interface ProfileShape {
  id: string;
  name: string;
  email: string;
  profilePicture: string;
  isOrganizer: boolean;
  isAdmin: boolean;
  role: AppRole;
  isVerified: boolean;
}

interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  role: AppRole;
  businessName?: string;
}

interface AuthContextProps {
  user: ProfileShape | null;
  session: { user: ProfileShape } | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string, role?: AppRole) => Promise<{ error: string | null }>;
  signUp: (input: SignUpInput) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithOAuth: (provider: "google" | "apple") => Promise<{ error: string | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  upgradeToOrganizer: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);
const STORAGE_KEY = "tick3t.mock-auth.user";

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

const roleFromEmail = (email: string, explicit?: AppRole): AppRole => {
  if (explicit) return explicit;
  const e = email.toLowerCase();
  if (e.startsWith("admin+") || e.startsWith("admin@")) return "admin";
  if (e.startsWith("organizer+") || e.startsWith("organiser+")) return "organizer";
  return "user";
};

const buildMockProfile = (email: string, displayName?: string, role?: AppRole): ProfileShape => {
  const resolvedRole = roleFromEmail(email, role);
  const name = displayName?.trim() || email.split("@")[0] || "Demo User";
  return {
    id: `mock-${btoa(email).replace(/=/g, "").slice(0, 16)}`,
    name,
    email,
    profilePicture: "",
    isOrganizer: resolvedRole === "organizer" || resolvedRole === "admin",
    isAdmin: resolvedRole === "admin",
    role: resolvedRole,
    isVerified: true,
  };
};

const loadStored = (): ProfileShape | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ProfileShape) : null;
  } catch {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ProfileShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(loadStored());
    setIsLoading(false);
  }, []);

  const persist = (p: ProfileShape | null) => {
    if (p) localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
    else localStorage.removeItem(STORAGE_KEY);
    setUser(p);
  };

  const signIn: AuthContextProps["signIn"] = async (email, password, role) => {
    if (!email || !password) return { error: "Email and password are required" };
    persist(buildMockProfile(email, undefined, role));
    return { error: null };
  };

  const signUp: AuthContextProps["signUp"] = async ({ email, password, displayName, role }) => {
    if (!email || !password) return { error: "Email and password are required", needsConfirmation: false };
    persist(buildMockProfile(email, displayName, role));
    return { error: null, needsConfirmation: false };
  };

  const signInWithOAuth: AuthContextProps["signInWithOAuth"] = async (provider) => {
    persist(buildMockProfile(`demo@${provider}.com`, `${provider} Demo`));
    return { error: null };
  };

  const requestPasswordReset = async () => ({ error: null });

  const signOut = async () => {
    persist(null);
    navigate("/auth");
  };

  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    return !error;
  };
  const register = async (email: string, password: string, name: string) => {
    const { error } = await signUp({ email, password, displayName: name, role: "user" });
    return !error;
  };

  const upgradeToOrganizer = () => {
    if (!user) return;
    const upgraded: ProfileShape = { ...user, isOrganizer: true, role: "organizer" };
    persist(upgraded);
  };

  const value = useMemo<AuthContextProps>(() => ({
    user,
    session: user ? { user } : null,
    isLoading,
    isAuthenticated: !!user,
    isOrganizer: !!user?.isOrganizer,
    isAdmin: !!user?.isAdmin,
    signIn,
    signUp,
    signInWithOAuth,
    requestPasswordReset,
    signOut,
    login,
    register,
    logout: signOut,
    upgradeToOrganizer,
  }), [user, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
