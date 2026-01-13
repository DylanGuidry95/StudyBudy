import { useState } from "react";
import { useSubjectsDb } from "../../hooks/useSubjectsDb";
import { useSubjects } from "../../hooks/useSubjects";
import { useAuthContext } from "../auth/AuthProvider";

import AuthControls from "../auth/authControls";
import SubjectCreator from "../form/SubjectCreator";
import SubjectViewer from "../form/SubjectViewer";
import SubjectDetail from "../subjects/SubjectDetail";
import CalendarPanel from "../calendar/CalendarPanel";
import SubjectSidebar from "../subjects/SubjectSidebar";

export function HomeLayout() {
  const subjectsDb = useSubjectsDb();
  const subjectsUi = useSubjects(subjectsDb);
  const { user } = useAuthContext();

  const [activeSubject, setActiveSubject] = useState(null);

  if (subjectsUi.loading) {
    return <p>Loading subjects…</p>;
  }

  return (
    <div>
      <AuthControls />

      {!user && <p>Please log in to view your subjects.</p>}

      {user && (
        <>
          {!activeSubject && (
            <div className="home-layout">
              <div className="sidebar">
                <SubjectCreator addSubject={subjectsUi.addSubject} />
                <br />

                <SubjectViewer
                  subjectsUi={subjectsUi}
                  onSelectSubject={(subject) => setActiveSubject(subject)}
                />                
              </div>
              <div className="main">
                <CalendarPanel></CalendarPanel>
              </div>
            </div>
          )}

          {activeSubject && (
            <SubjectDetail
              subject={activeSubject}
              onBack={() => setActiveSubject(null)}
            />
          )}
        </>
      )}
    </div>
  );
}

export default HomeLayout;
