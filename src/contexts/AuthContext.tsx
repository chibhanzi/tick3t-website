import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import type { Session, User as SbUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

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
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isOrganizer: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (input: SignUpInput) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signInWithOAuth: (provider: "google" | "apple") => Promise<{ error: string | null }>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  // Legacy aliases (kept so existing components don't break)
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = (): AuthContextProps => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

const buildProfile = (
  sbUser: SbUser,
  role: AppRole,
  displayName: string | null,
  avatarUrl: string | null,
  isVerified: boolean,
): ProfileShape => ({
  id: sbUser.id,
  name: displayName || sbUser.user_metadata?.display_name || sbUser.user_metadata?.full_name || sbUser.email?.split("@")[0] || "User",
  email: sbUser.email || "",
  profilePicture: avatarUrl || sbUser.user_metadata?.avatar_url || "",
  isOrganizer: role === "organizer" || role === "admin",
  isAdmin: role === "admin",
  role,
  isVerified,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ProfileShape | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const hydrateUser = useCallback(async (sbUser: SbUser) => {
    // Fetch in parallel; defer with setTimeout(0) is unnecessary here since we're outside the listener callback
    const [rolesRes, profileRes, orgRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", sbUser.id),
      supabase.from("profiles").select("display_name, avatar_url").eq("id", sbUser.id).maybeSingle(),
      supabase.from("organizer_profiles").select("verification_status").eq("id", sbUser.id).maybeSingle(),
    ]);
    const roles = (rolesRes.data || []).map((r) => r.role as AppRole);
    const role: AppRole = roles.includes("admin") ? "admin" : roles.includes("organizer") ? "organizer" : "user";
    const isVerified = orgRes.data?.verification_status === "verified";
    setUser(buildProfile(sbUser, role, profileRes.data?.display_name ?? null, profileRes.data?.avatar_url ?? null, isVerified));
  }, []);

  useEffect(() => {
    // 1. Subscribe FIRST (per Supabase guidance)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.user) {
        // Defer DB work so we don't deadlock the auth callback
        setTimeout(() => { hydrateUser(newSession.user); }, 0);
      } else {
        setUser(null);
      }
    });

    // 2. Then check existing session
    supabase.auth.getSession().then(({ data: { session: existing } }) => {
      setSession(existing);
      if (existing?.user) {
        hydrateUser(existing.user).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [hydrateUser]);

  const signIn: AuthContextProps["signIn"] = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signUp: AuthContextProps["signUp"] = async ({ email, password, displayName, role, businessName }) => {
    const redirectUrl = `${window.location.origin}/`;
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: displayName,
          role,
          business_name: businessName,
        },
      },
    });
    if (error) return { error: error.message, needsConfirmation: false };
    const needsConfirmation = !data.session;
    return { error: null, needsConfirmation };
  };

  const signInWithOAuth: AuthContextProps["signInWithOAuth"] = async (provider) => {
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) return { error: result.error.message || "OAuth sign-in failed" };
    return { error: null };
  };

  const requestPasswordReset: AuthContextProps["requestPasswordReset"] = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    navigate("/auth");
  };

  // Legacy aliases
  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    return !error;
  };
  const register = async (email: string, password: string, name: string) => {
    const { error } = await signUp({ email, password, displayName: name, role: "user" });
    return !error;
  };

  const value = useMemo<AuthContextProps>(() => ({
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
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
  }), [user, session, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
