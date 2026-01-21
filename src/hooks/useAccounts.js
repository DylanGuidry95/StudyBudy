import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useAccounts() {
  const {
    user,
    profile,
    avatarSignedUrl,
    refreshProfile,
    setProfile,
    setAvatarSignedUrl,
  } = useAuthContext();

  const updateName = async (first, last) => {
    await supabase
      .from("profiles")
      .update({ first_name: first, last_name: last })
      .eq("id", user.id);

    // instant UI update
    setProfile((prev) => ({ ...prev, first_name: first, last_name: last }));
  };

  const updateAvatar = async (file) => {
    const path = `${user.id}/profile.jpg`;

    await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", user.id);

    const { data: signed } = await supabase.storage
      .from("avatars")
      .createSignedUrl(path, 60 * 60);

    // instant everywhere
    setAvatarSignedUrl(signed.signedUrl);

    // keep DB in sync
    await refreshProfile();
  };

  return {
    profile,
    avatarSignedUrl,
    updateName,
    updateAvatar,
  };
}
