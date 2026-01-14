import { useState } from "react";

export function useNotes(notes, updateGuide) {
  const [collapsed, setCollapsed] = useState({});
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const add = () => {
    updateGuide({
      notes: [
        ...notes,
        { id: Date.now(), 
          title: "New Note", 
          content: "" },
      ],
    });
  };

  const updateContent = (id, content) => {
    updateGuide({
      notes: notes.map((n) =>
        n.id === id ? { ...n, content } : n
      ),
    });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this note?")) return;

    updateGuide({
      notes: notes.filter((n) => n.id !== id),
    });
  };

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const startRename = (note) => {
    setRenamingId(note.id);
    setRenameValue(note.title);
  };

  const saveRename = () => {
    updateGuide({
      notes: notes.map((n) =>
        n.id === renamingId ? { ...n, title: renameValue } : n
      ),
    });

    setRenamingId(null);
  };

  return {
    collapsed,
    renamingId,
    renameValue,
    setRenameValue,
    add,
    updateContent,
    remove,
    toggleCollapse,
    startRename,
    saveRename,
  };
}
