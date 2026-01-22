import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const authResolvedRef = useRef(false);

  // --------------------------------------
  // LOAD PROFILE + AVATAR
  // --------------------------------------
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return;

    // 🔴 HARD GUARD: ensure client session is ready
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData?.session) {
      console.warn("Session not ready, skipping profile load");
      return;
    }

    console.log("Loading Profile");

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", authUser.id)
      .maybeSingle();

    console.log("Fetched data");

    if (error) {
      console.error("Profile load failed:", error);
      return;
    }

    if (!data) {
      setProfile(null);
      setAvatarSignedUrl(null);
      return;
    }

    setProfile(data);

    if (data.avatar_url) {
      const { data: signed } = await supabase.storage
        .from("Avatars")
        .createSignedUrl(data.avatar_url, 60 * 60);

      setAvatarSignedUrl(signed?.signedUrl ?? null);
    } else {
      setAvatarSignedUrl(null);
    }
  }, []);

  // --------------------------------------
  // INITIAL SESSION LOAD (🔴 REQUIRED)
  // --------------------------------------
  useEffect(() => {
    const initAuth = async () => {
      // 🔴 Prevent double-run in StrictMode
      if (authResolvedRef.current) return;

      try {
        const { data } = await supabase.auth.getSession();
        const authUser = data?.session?.user ?? null;

        setUser(authUser);

        if (authUser) {
          loadProfile(authUser); // fire-and-forget
        }
      } catch (err) {
        console.error("initAuth crashed:", err);
        setUser(null);
      } finally {
        // 🔑 AUTH IS RESOLVED EXACTLY ONCE
        authResolvedRef.current = true;
        setAuthLoading(false);
      }
    };

    initAuth();
  }, [loadProfile]);

  // --------------------------------------
  // AUTH STATE LISTENER
  // --------------------------------------
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);

        if (authUser) {
          loadProfile(authUser);
        } else {
          setProfile(null);
          setAvatarSignedUrl(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  // -------------------------
  // SIGN IN
  // -------------------------
  const signIn = async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  // -------------------------
  // SIGN UP
  // -------------------------
  const signUp = async ({ email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  // -------------------------
  // SIGN OUT
  // -------------------------
  const signOut = async () => {
    await supabase.auth.signOut();

    // Clear cached state immediately
    setUser(null);
    setProfile(null);
    setAvatarSignedUrl(null);
  };

  // -------------------------
  // RESET PASSWORD
  // -------------------------
  const resetPassword = async (email) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      throw error;
    }
  };
  // --------------------------------------
  // CONTEXT API
  // --------------------------------------
  return {
    // state
    user,
    profile,
    avatarSignedUrl,
    authLoading,

    // auth actions
    signIn,
    signUp,
    signOut,
    resetPassword,

    // profile helpers
    refreshProfile: () => loadProfile(user),
    setProfile,
    setAvatarSignedUrl,
  };
}
