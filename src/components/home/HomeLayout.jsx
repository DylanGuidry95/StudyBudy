import { useSubjectsDb } from "../../hooks/useSubjectsDb";
import { useSubjects } from "../../hooks/useSubjects";
import { useAuthContext } from "../auth/AuthProvider";

import SubjectCreator from "../form/SubjectCreator";
import SubjectViewer from "../form/SubjectViewer";
import { useEffect } from "react";

export function HomeLayout() {  

  const subjectsDb = useSubjectsDb();
  const subjectsUi = useSubjects(subjectsDb);
  const { user } = useAuthContext();
  
  useEffect(() => {console.log("HomeLoyout");}, []);

  if (!user) {
    return (
      <div>        
        <p>Please log in to view your subjects.</p>
      </div>
    );
  }

  if (subjectsUi.loading) {
    return <p>Loading subjects…</p>;
  }

  return (
    <div className="home-layout">
      <div className="sidebar">
        <SubjectCreator addSubject={subjectsUi.addSubject} />
        <br />
        <SubjectViewer subjectsUi={subjectsUi} />
      </div>
    </div>
  );
}

export default HomeLayout;
