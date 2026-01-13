import { useState } from "react";

export function useNotesUi(notesDb) {
  const [collapsed, setCollapsed] = useState({});
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: prev[id] === false,
    }));
  };

  const startRename = (note) => {
    setRenamingId(note.id);
    setRenameValue(note.title);
  };

  const saveRename = () => {
    if (!renameValue.trim()) return;

    notesDb.updateNote(renamingId, {
      title: renameValue.trim(),
    });

    setRenamingId(null);
  };

  const updateContent = (id, content) => {
    notesDb.updateNote(id, { content });
  };

  const remove = (id) => {
    if (!window.confirm("Delete this note?")) return;
    notesDb.deleteNote(id);
  };

  return {
    collapsed,
    toggleCollapse,
    renamingId,
    renameValue,
    setRenameValue,
    startRename,
    saveRename,
    updateContent,
    remove,
  };
}
