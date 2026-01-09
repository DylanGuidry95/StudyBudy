import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useGuidesDb(subjectId) {
  const { user } = useAuthContext();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- LOAD ----------
  useEffect(() => {
    if (!user || !subjectId) {
      setGuides([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("guides")
        .select("*")
        .eq("subject_id", subjectId)
        .order("created_at", { ascending: false });

      if (!error) setGuides(data);
      else console.error("Failed to load guides:", error);

      setLoading(false);
    };

    load();
  }, [user, subjectId]);

  // ---------- ADD ----------
  const addGuide = async (title) => {
    if (!user || !subjectId || !title.trim()) return;

    const { data, error } = await supabase
      .from("guides")
      .insert({
        user_id: user.id,
        subject_id: subjectId,
        title,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add guide:", error);
      return;
    }

    // optimistic update
    setGuides((prev) => [data, ...prev]);
  };

  // ---------- DELETE ----------
  const deleteGuide = async (id) => {
    const { error } = await supabase.from("guides").delete().eq("id", id);

    if (error) {
      console.error("Failed to delete guide:", error);
      return;
    }

    setGuides((prev) => prev.filter((g) => g.id !== id));
  };

  const updateGuideTitle = async (id, title) => {
    if (!title.trim()) return;

    const { error } = await supabase
      .from("guides")
      .update({
        title,
        last_edited: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Failed to update guide title:", error);
      return;
    }

    setGuides((prev) =>
      prev.map((g) =>
        g.id === id ? { ...g, title, last_edited: new Date().toISOString() } : g
      )
    );
  };

  return {
    guides: guides ?? [],
    loading,
    addGuide,
    deleteGuide,
    updateGuideTitle,
  };
}
