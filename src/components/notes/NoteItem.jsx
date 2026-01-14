import { useEffect, useRef, useState } from "react";
import { getCaretCoordinates } from "../../utils/getCaretCoordinates";

function NoteItem({ note, ui, attachments }) {
  const isCollapsed = ui.collapsed[note.id] !== false;

  const [draft, setDraft] = useState(note.content);
  const isDirtyRef = useRef(false);
  const timeoutRef = useRef(null);

  const [isSaving, setIsSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const [pickerPos, setPickerPos] = useState(null);
  const [trigger, setTrigger] = useState(null);
  const textareaRef = useRef(null);

  // Sync ONLY when switching notes
  useEffect(() => {
    isDirtyRef.current = false;
    setDraft(note.content);
  }, [note.id]);

  // Cleanup
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleChange = (e) => {
    const textarea = e.target;
    const value = textarea.value;
    const cursor = textarea.selectionStart;

    setDraft(value);
    isDirtyRef.current = true;

    // If trigger exists, update or cancel it
    if (trigger) {
      const typed = value.slice(trigger.start, cursor);

      if (!typed.startsWith("[[") || typed.length > 30) {
        setTrigger(null);
        setPickerPos(null);
      } else {
        const coords = getCaretCoordinates(textarea, cursor);

        setTrigger({
          ...trigger,
          query: typed.slice(2),
        });

        setPickerPos({
          top: coords.top + 20,
          left: coords.left,
        });
      }
    } else {
      // Detect new trigger
      const coords = getCaretCoordinates(textarea, cursor);

      setTrigger({
        start: cursor - 2,
        query: "",
      });

      setPickerPos({
        top: coords.top + 20,
        left: coords.left,
      });
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      ui.updateContent(note.id, value);
    }, 700);
  };

  const filteredAttachments = trigger?.query
    ? attachments.filter((a) =>
        a.name.toLowerCase().includes(trigger.query.toLowerCase())
      )
    : attachments;

  const clearPicker = () => {
    setTrigger(null);
    setPickerPos(null);
  };

  const insertAttachment = (name) => {
    const textarea = textareaRef.current;
    if (!textarea || !trigger) return;

    const before = draft.slice(0, trigger.start);
    const after = draft.slice(textarea.selectionStart);

    const next = before + `[[${name}]]` + after;

    setDraft(next);
    setTrigger(null);
    clearPicker();
    requestAnimationFrame(() => {
      textarea.focus();
      const pos = before.length + name.length + 4;
      textarea.setSelectionRange(pos, pos);
    });
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "6px", marginBottom: "8px" }}
    >
      <div style={{ display: "flex", gap: "6px" }}>
        <button onClick={() => ui.toggleCollapse(note.id)}>
          {isCollapsed ? "▶" : "▼"}
        </button>

        <strong>{note.title || "Untitled Note"}</strong>

        <button
          onClick={() => ui.remove(note.id)}
          style={{ marginLeft: "auto" }}
        >
          🗑️
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div
            style={{ fontSize: "0.8em", marginTop: "4px", color: "#6b7280" }}
          >
            {isSaving && "Saving…"}
            {!isSaving && justSaved && "Saved"}
          </div>
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleChange}
            style={{ width: "100%", marginTop: "6px" }}
          />
          {trigger && pickerPos && filteredAttachments.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: pickerPos.top,
                left: pickerPos.left,
                background: "#fff",
                border: "1px solid #ccc",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                zIndex: 1000,
                maxHeight: "180px",
                overflowY: "auto",
                borderRadius: "6px",
                minWidth: "220px",
              }}
            >
              {filteredAttachments.map((att) => (
                <div
                  key={att.id}
                  style={{
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                  onMouseDown={(e) => {
                    // prevent textarea blur
                    e.preventDefault();
                    insertAttachment(att.name);
                  }}
                >
                  {att.name}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NoteItem;
