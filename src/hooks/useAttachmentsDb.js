import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useAttachmentsDb(guideId) {
  const [attachments, setAttachments] = useState([]);
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);

  // ---------- LOAD ----------
  useEffect(() => {
    if (!user || !guideId) {
      setAttachments([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("attachments")
        .select("*")
        .eq("guide_id", guideId)
        .order("created_at");

      if (!error) setAttachments(data);
      else console.error(error);

      setLoading(false);
    };

    load();
  }, [user, guideId]);

  // ---------- UPLOAD ----------
const upload = async (file) => {
  if (!file || !user || !guideId) return;

  // detect type
  const type = file.type.includes("pdf")
    ? "pdf"
    : file.type.includes("image")
    ? "image"
    : file.type.includes("text")
    ? "text"
    : null;

  if (!type) {
    alert("Unsupported file type");
    return;
  }

  const path = `${user.id}/${guideId}/${Date.now()}-${file.name}`;

  await supabase.storage
    .from("attachments")
    .upload(path, file);

  const { data, error } = await supabase
    .from("attachments")
    .insert({
      user_id: user.id,
      guide_id: guideId,
      name: file.name,
      type,
      storage_path: path,
    })
    .select()
    .single();

    if(!error && data)
        setAttachments((prev) => [...prev, data]);
};

  // ---------- DELETE ----------
  const remove = async (attachment) => {
    await supabase.storage
      .from("attachments")
      .remove([attachment.storage_path]);

    await supabase.from("attachments").delete().eq("id", attachment.id);

    setAttachments((prev) => prev.filter((a) => a.id !== attachment.id));
  };

  // ---------- PREVIEW URL ----------
  const getUrl = async (path) => {
    const { data } = await supabase.storage
      .from("attachments")
      .createSignedUrl(path, 3600);

    return data?.signedUrl;
  };

  return {
    attachments: attachments ?? [],
    loading,
    upload,
    remove,
    getUrl,
  };
}
