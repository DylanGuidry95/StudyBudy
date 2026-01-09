import './App.css';
import { useEffect, useState } from "react";
import SubjectDetail from "./components/subjects/SubjectDetail";
import HomeLayout from './components/home/HomeLayout';


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
      <HomeLayout/>          
    </div>
  );
}

export default App;

