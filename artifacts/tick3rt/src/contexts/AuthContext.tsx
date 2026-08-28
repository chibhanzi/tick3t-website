import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
  createAccount,
  createSession,
  deleteSession,
  type AuthUser,
} from "@workspace/api-client-react";

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

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong";

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
    try {
      const profile = await createSession({ email, password });
      persist(profile);
      return { error: null };
    } catch (error) {
      return { error: errorMessage(error) };
    }
  };

  const signUp: AuthContextProps["signUp"] = async ({ email, password, displayName, role }) => {
    if (!email || !password) return { error: "Email and password are required", needsConfirmation: false };
    if (role === "admin") {
      return { error: "Admin accounts cannot be created here", needsConfirmation: false };
    }
    try {
      const profile = await createAccount({ email, password, displayName, role });
      persist(profile);
      return { error: null, needsConfirmation: false };
    } catch (error) {
      return { error: errorMessage(error), needsConfirmation: false };
    }
  };

  const signInWithOAuth: AuthContextProps["signInWithOAuth"] = async (provider) => {
    return { error: `${provider} sign-in is not available yet` };
  };

  const requestPasswordReset = async () => ({ error: null });

  const signOut = async () => {
    try {
      await deleteSession();
    } finally {
      persist(null);
    }
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
