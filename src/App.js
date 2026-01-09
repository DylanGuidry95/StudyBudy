import './App.css';
import { useEffect, useState } from "react";
import SubjectList from "./components/subjects/SubjectList";
import SubjectDetail from "./components/subjects/SubjectDetail";


function App() {
  const [subjects, setSubjects] = useState(() => {
    const saved = localStorage.getItem("subjects");
    return saved ? JSON.parse(saved) : [];
  });  
  useEffect(() => {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);
  const [selectedSubject, setSelectedSubject] = useState(null);

  return (
    <div className="container">
      <h1>Study Companion</h1>
      {!selectedSubject ? (        
        <SubjectList
          subjects={subjects}
          setSubjects={setSubjects}
          onSelect={setSelectedSubject}
        />
      ) : (
        <SubjectDetail
          subject={selectedSubject}
          onBack={() => setSelectedSubject(null)}
          updateSubject={(updated) => {
            setSubjects(
              subjects.map((s) =>
                s.id === updated.id ? updated : s
              )
            );
            setSelectedSubject(updated);
          }}
        />
      )}
    </div>
  );
}

export default App;

