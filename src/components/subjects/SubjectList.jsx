import { useSubjects } from "../../hooks/useSubjects";
import HomeLayout from "../home/HomeSidebar";
import CalendarPanel from "../home/CalendarPanel";
import AuthControls from "../auth/authControls";
import { useAuthContext } from "../../components/auth/AuthProvider";

function SubjectList({ subjects, setSubjects, onSelect }) {
  const {} = useSubjects(subjects, setSubjects);
  const { user, loading } = useAuthContext();
  return (
    <div>
      {loading && <p style={{ padding: "16px" }}>Checking Session...</p>}
      <AuthControls />
      {!loading && user && (                
        <div className="home-layout">                                         
          <HomeLayout
            subjects={subjects}
            setSubjects={setSubjects}
            onSelect={onSelect}
          />
          <CalendarPanel />
        </div>
      )}
    </div>
  );
}

export default SubjectList;