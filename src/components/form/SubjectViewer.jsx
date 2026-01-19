
import { useNavigate } from "react-router-dom";


function SubjectViewer({ subjectsUi }) {
  const {
    groupedSubjects,
    sortedGroups,
    openGroups,
    toggleGroup,
    deleteSubject,
  } = subjectsUi;


  const navigate = useNavigate();

  const confirmDelete = (subject) => {
    if (!window.confirm(`Delete "${subject.name}"?`)) return;
    deleteSubject(subject.id);
  };

  return (
    <>
      {sortedGroups.map((group) => (
        <div key={group}>
          <button onClick={() => toggleGroup(group)}>
            {openGroups[group] !== false? "▼" : "▶"} {group}
          </button>

          {openGroups[group] !== false &&
            groupedSubjects[group].map((subject) => (
              <div key={subject.id} style={{ display: "flex", gap: "8px" }}>
                <strong>{subject.name}</strong>

                <button 
                type="button"
                onClick={() => { navigate(`subjects/${subject.id}`);
              console.log(subject.id)}}>
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