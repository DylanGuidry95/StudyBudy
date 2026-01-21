import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useAccounts() {
  const { user } = useAuthContext();

  const [profile, setProfile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------------------
  // LOAD PROFILE
  // ----------------------------------------
  const loadProfile = useCallback(async () => {
    if (!user) {
      setProfile(null);
      setAvatarUrl(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("profiles")
      .select("first_name, last_name, avatar_url")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error(error);
      setError("Failed to load profile");
      setLoading(false);
      return;
    }

    setProfile(data);

    // Generate signed avatar URL if exists
    if (data?.avatar_url) {
      const { data: signed } = await supabase.storage
        .from("Avatars")
        .createSignedUrl(data.avatar_url, 60 * 60);

    console.log(data.signedUrl);

      setAvatarUrl(signed?.signedUrl ?? null);
    } else {
      setAvatarUrl(null);
    }

    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // ----------------------------------------
  // UPDATE FIRST & LAST NAME
  // ----------------------------------------
  const updateName = async (firstName, lastName) => {
    if (!user) return;

    setError(null);

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
      })
      .eq("id", user.id);

    if (error) {
      console.error(error);
      setError("Failed to update name");
      throw error;
    }

    setProfile((prev) => ({
      ...prev,
      first_name: firstName,
      last_name: lastName,
    }));
  };

  // ----------------------------------------
  // UPDATE PASSWORD
  // ----------------------------------------
  const updatePassword = async (newPassword) => {
    setError(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      console.error(error);
      setError("Failed to update password");
      throw error;
    }
  };

  // ----------------------------------------
  // UPDATE PROFILE PICTURE
  // ----------------------------------------
  const updateAvatar = async (file) => {
    if (!user || !file) return;

    setError(null);

    // Validate file
    if (!file.type.startsWith("image/")) {
      throw new Error("Only image files are allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Avatar must be under 5MB");
    }

    const filePath = `${user.id}/profile.jpg`;

    // Upload avatar
    const { error: uploadError } = await supabase.storage
      .from("Avatars")
      .upload(filePath, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      setError(uploadError);
      throw uploadError;
    }

    // Save path to DB
    const { error: dbError } = await supabase
      .from("profiles")
      .update({
        avatar_url: filePath,
      })
      .eq("id", user.id);

    if (dbError) {
      console.error(dbError);
      setError(dbError);
    }

    // Refresh signed URL
    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(filePath, 60 * 60);

    setAvatarUrl(signed?.signedUrl ?? null);

    setProfile((prev) => ({
      ...prev,
      avatar_url: filePath,
    }));
  };

  return {
    profile,
    avatarUrl,
    loading,
    error,

    reloadProfile: loadProfile,
    updateName,
    updatePassword,
    updateAvatar,
  };
}
