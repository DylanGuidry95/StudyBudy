import NoteItem from "./NoteItem";
import { useNotesUi } from "../../hooks/useNotesUi";

function NotesPanel({ notesDb }) {
  // ✅ HOOK CALLED AT TOP LEVEL
  const ui = useNotesUi(notesDb);

  if (notesDb.loading) {
    return <p>Loading notes…</p>;
  }

  return (
    <div>
      <h3>Notes</h3>

      {/* Add button must always render */}
      <button onClick={notesDb.addNote}>➕ Add Note</button>

      {notesDb.notes.length === 0 && (
        <p style={{ color: "#888" }}>No notes yet</p>
      )}

      {notesDb.notes.map((note) => (
        <NoteItem
          key={note.id}
          note={note}
          ui={ui} 
        />
      ))}
    </div>
  );
}

export default NotesPanel;
