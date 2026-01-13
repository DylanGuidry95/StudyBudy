import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuthContext } from "../components/auth/AuthProvider";

export function useCalendarDb() {
  const { user } = useAuthContext();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      setEvents([]);
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("calendar_events")
        .select("*")
        .order("start_date");

      if (error) {
        console.error(error);
        setError("Failed to load calendar");
      } else {
        setEvents(data);
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const addEvent = async (event) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("calendar_events")
      .insert({
        user_id: user.id,
        ...event,
      })
      .select()
      .single();

    if (error) {
      setError("Failed to add event");
      return;
    }

    setEvents((prev) => [...prev, data]);
  };

  const deleteEvent = async (id) => {
    await supabase.from("calendar_events").delete().eq("id", id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const updateEvent = async (id, updates) => {
    const { data, error } = await supabase
      .from("calendar_events")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      setError("Failed to update event");
      return;
    }

    setEvents((prev) => prev.map((e) => (e.id === id ? data : e)));
  };

  return {
    events,
    loading,
    error,
    addEvent,    
    deleteEvent,
    updateEvent,
  };
}
