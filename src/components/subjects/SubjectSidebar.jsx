import { useState } from "react";
import { formatDateTime } from "../form/helpers";

function SubjectSidebar({ subject, onBack, guideApi }) {
  const [newTitle, setNewTitle] = useState("");

  const add = () => {
    guideApi.addGuide(newTitle);
    setNewTitle("");
  };

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
        {subject.guides.map((guide) => (
          <li key={guide.id}>
            <button
              onClick={() => guideApi.setActiveGuideId(guide.id)}
              style={{
                fontWeight:
                  guide.id === guideApi.activeGuideId ? "bold" : "normal",
              }}
            >
              {guide.title}
            </button>
            <button
              onClick={() => guideApi.deleteGuide(guide.id)}
              style={{ color: "red", marginLeft: "6px" }}
            >
              ✕
            </button>
            <p style={{ color: "gray", marginLeft: "6px" }}>
              {formatDateTime(guide.lastEdited)}
            </p>            
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectSidebar;
