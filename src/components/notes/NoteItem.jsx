import { useEffect, useRef, useState } from "react";

function NoteItem({ note, ui }) {
  const isCollapsed = ui.collapsed[note.id] !== false;

  const [localContent, setLocalContent] = useState(note.content);
  const debounceRef = useRef(null);

  // Keep local state in sync if note changes externally
  useEffect(() => {
    setLocalContent(note.content);
  }, [note.content]);

  const handleChange = (value) => {
    setLocalContent(value);

    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      ui.updateContent(note.id, value);
    }, 5000); // ⏱ 1 second (adjust as needed)
  };

  return (
   <div style={{ border: "1px solid #ccc", padding: "6px", marginBottom: "8px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button onClick={() => ui.toggleCollapse(note.id)}>
          {isCollapsed ? "▶" : "▼"}
        </button>

        {ui.renamingId === note.id ? (
          <>
            <input
              value={ui.renameValue}
              onChange={(e) => ui.setRenameValue(e.target.value)}
            />
            <button onClick={() => ui.saveRename(note.id)}>Save</button>
          </>
        ) : (
          <>
            <strong>{note.title || "Untitled Note"}</strong>
            <button onClick={() => ui.startRename(note)}>✏️</button>
          </>
        )}

        <button onClick={() => ui.remove(note.id)} style={{ marginLeft: "auto" }}>
          🗑️
        </button>
      </div>

      {/* Content */}
      {!isCollapsed && (
        <textarea
          value={note.content}
          onChange={(e) => ui.updateContent(note.id, e.target.value)}
          style={{ width: "100%", marginTop: "6px" }}
        />
      )}
    </div>
  );
}

export default NoteItem;
