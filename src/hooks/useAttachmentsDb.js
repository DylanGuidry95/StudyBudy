import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

const BUCKET = "Attachments"; // ✅ CASE-SENSITIVE

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

      if (error) {
        console.error("Load attachments failed:", error);
      } else {
        setAttachments(data ?? []);
      }

      setLoading(false);
    };

    load();
  }, [user, guideId]);

  // ---------- UPLOAD ----------
  const upload = async (file) => {
    if (!file || !user || !guideId) return;

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

    const path = `${user.id}/${guideId}/${crypto.randomUUID()}-${file.name}`;

    // ✅ UPLOAD TO STORAGE
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file);

    if (uploadError) {
      console.error("Storage upload failed:", uploadError);
      return;
    }

    // ✅ GET PUBLIC URL
    const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

    const publicUrl = urlData?.publicUrl;

    if (!publicUrl) {
      console.error("Failed to get public URL");
      return;
    }

    // ✅ INSERT DB ROW
    const { data, error } = await supabase
      .from("attachments")
      .insert({
        user_id: user.id,
        guide_id: guideId,
        name: file.name,
        type,
        storage_path: path,
        url: publicUrl,
      })
      .select()
      .single();

    if (error) {
      console.error("DB insert failed:", error);
      return;
    }

    setAttachments((prev) => [...prev, data]);
  };

  // ---------- DELETE ----------
  const remove = async (id) => {
    const attachment = attachments.find((a) => a.id === id);
    if (!attachment) return;

    // delete from storage
    await supabase.storage.from(BUCKET).remove([attachment.storage_path]);

    // delete from DB
    const { error } = await supabase.from("attachments").delete().eq("id", id);

    if (error) {
      console.error("Delete failed:", error);
      return;
    }

    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const getUrl = async (path) => {
    const { data, error } = await supabase.storage
      .from("Attachments")
      .createSignedUrl(path, 3600);

    if (error) {
      console.error("Signed URL error:", error);
      return null;
    }

    return data.signedUrl;
  };

  return {
    attachments,
    loading,
    upload,
    remove,
    getUrl,
  };
}
