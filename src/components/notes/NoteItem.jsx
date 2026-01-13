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
    <div>
      <button onClick={() => ui.toggleCollapse(note.id)}>
        {isCollapsed ? "▶" : "▼"}
      </button>

      {!isCollapsed && (
        <textarea
          value={localContent}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
    </div>
  );
}

export default NoteItem;
