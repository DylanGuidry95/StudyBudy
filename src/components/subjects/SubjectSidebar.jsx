import { useState } from "react";
import { formatDateTime } from "../form/helpers";

function SubjectSidebar({ subject, guidesDb, activeGuideId, setActiveGuideId, onBack }) {
  const [newTitle, setNewTitle] = useState("");  

  if (!subject) {
    return <div className="sidebar">No subject selected</div>;
  }  

  const add = () => {
    if (!newTitle.trim()) return;
    guidesDb.addGuide(newTitle);
    setNewTitle("");
  };

  if (guidesDb.loading) {
    return <div className="sidebar">Loading guides…</div>;
  }

  return (
    <div className="sidebar">
      <button onClick={onBack}>← Back</button>
      <h2>{subject.name}</h2>
      
      <input
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        placeholder="New guide title"
      />
      <button onClick={add}>Add Guide</button>  

      <ul>
        {guidesDb.guides.length === 0 && (
          <p style={{ color: "#888" }}>No guides yet</p>
        )}

        {(guidesDb.guides ?? []).map((guide) => (
          <li key={guide.id}>
            <button
              onClick={() => setActiveGuideId(guide.id)}
              style={{
                fontWeight:
                  guide.id === activeGuideId ? "bold" : "normal",
              }}
            >
              {guide.title}
            </button>

            <button
              onClick={() => guidesDb.deleteGuide(guide.id)}
              style={{ color: "red", marginLeft: "6px" }}
            >
              ✕
            </button>

            <p style={{ color: "gray", marginLeft: "6px" }}>
              {formatDateTime(guide.last_edited)}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectSidebar;
