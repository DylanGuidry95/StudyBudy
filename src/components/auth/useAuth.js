import { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [avatarSignedUrl, setAvatarSignedUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------------
  // LOAD PROFILE + AVATAR
  // --------------------------------------
  const loadProfile = useCallback(async (authUser) => {
    if (!authUser) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", authUser.id)
      .maybeSingle(); // 🔴 IMPORTANT

    if (error) {
      console.error("Profile load failed:", error);
      return;
    }

    if (!data) {
      // profile row doesn't exist yet
      setProfile(null);
      setAvatarSignedUrl(null);
      return;
    }

    setProfile(data);

    if (data.avatar_url) {
      const { data: signed } = await supabase.storage
        .from("avatars")
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
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          console.error("getSession error:", error);
        }

        const authUser = session?.user ?? null;
        setUser(authUser);

        // Only try to load profile if logged in
        if (authUser) {
          await loadProfile(authUser);
        } else {
          setProfile(null);
          setAvatarSignedUrl(null);
        }
      } catch (err) {
        console.error("initAuth crashed:", err);
        setUser(null);
        setProfile(null);
        setAvatarSignedUrl(null);
      } finally {
        // 🔴 THIS IS THE KEY LINE
        setLoading(false);        
      }
    };

    initAuth();
  }, [loadProfile]);

  // --------------------------------------
  // AUTH STATE LISTENER
  // --------------------------------------
  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const authUser = session?.user ?? null;
        setUser(authUser);
        await loadProfile(authUser);
        setLoading(false);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [loadProfile]);

  // --------------------------------------
  // CONTEXT API
  // --------------------------------------
  return {
    user,
    profile,
    avatarSignedUrl,
    loading,

    refreshProfile: () => loadProfile(user),
    setProfile,
    setAvatarSignedUrl,
  };
}
