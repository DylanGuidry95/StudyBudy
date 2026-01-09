import { useState } from "react";
import { useSubjects } from "../../hooks/useSubjects";

function SubjectViewer({ subjectsUi, onSelectSubject }) {
  const {
    groupedSubjects,
    sortedGroups,
    openGroups,
    toggleGroup,
    deleteSubject,
  } = subjectsUi;

  const confirmDelete = (subject) => {
    if (!window.confirm(`Delete "${subject.name}"?`)) return;
    deleteSubject(subject.id);
  };

  return (
    <>
      {sortedGroups.map((group) => (
        <div key={group}>
          <button onClick={() => toggleGroup(group)}>
            {openGroups[group] ? "▼" : "▶"} {group}
          </button>

          {openGroups[group] &&
            groupedSubjects[group].map((subject) => (
              <div key={subject.id} style={{ display: "flex", gap: "8px" }}>
                <strong>{subject.name}</strong>

                <button onClick={() => onSelectSubject(subject)}>
                  Open
                </button>

                <button
                  onClick={() => confirmDelete(subject)}
                  style={{ color: "red" }}
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      ))}
    </>
  );
}

export default SubjectViewer;