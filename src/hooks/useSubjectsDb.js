import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useSubjectsDb() {
  const { user } = useAuthContext();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- LOAD ----------
  useEffect(() => {
    if (!user) {
      setSubjects([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("subjects")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load subjects:", error);
      } else {
        setSubjects(data);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  // ---------- ADD ----------
  const addSubject = async ({ name, instructor, semester, year }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("subjects")
      .insert({
        user_id: user.id,
        name,
        instructor,
        semester,
        year,
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to add subject:", error);
      return;
    }

    // 🔥 optimistic update
    setSubjects((prev) => [data, ...prev]);
  };

  // ---------- DELETE ----------
  const deleteSubject = async (id) => {
    const { error } = await supabase
      .from("subjects")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete subject:", error);
      return;
    }

    setSubjects((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    subjects,
    loading,
    addSubject,
    deleteSubject,
  };
}
