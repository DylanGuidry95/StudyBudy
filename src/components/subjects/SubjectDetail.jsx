import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SubjectSidebar from "./SubjectSidebar";
import GuideEditor from "../guides/GuideEditor";
import CalendarPanel from "../calendar/CalendarPanel";
import AttachmentPreviewPanel from "../attachments/AttachmentPreviewPanel";

import { useSubjectsDb } from "../../hooks/useSubjectsDb";
import { useGuidesDb } from "../../hooks/useGuidesDb";
import { useNotesDb } from "../../hooks/useNoteDb";
import { useAttachmentsDb } from "../../hooks/useAttachmentsDb";

function SubjectDetail() {  
  const { id } = useParams();  
  const subjectsDb = useSubjectsDb();
  const [activeGuideId, setActiveGuideId] = useState(null);

  const attachmentsDb = useAttachmentsDb(activeGuideId);
  const notesDb = useNotesDb(activeGuideId);
  const guidesDb = useGuidesDb(id);      

  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("loading subject:", id)
  }, [id]);

  if (subjectsDb.loading) {
    return <p>Loading subject…</p>;
  }

  const subject = subjectsDb.subjects.find(
    (s) => String(s.id) === String(id)
  );

  if (!subject) {
    return <p>{id} not found</p>    
  }

  const activeGuide = guidesDb.guides.find(
    (g) => String(g.id) === String(activeGuideId)
  );

  const updateGuideTitle = async (newTitle) => {
    await guidesDb.updateGuideTitle(activeGuideId, newTitle);
  };

  return (    
    <>    
      <button onClick={() => navigate("/")}>← Back</button>      
      <div className="subject-layout">
        <SubjectSidebar
          subject={subject}
          guidesDb={guidesDb}
          activeGuideId={activeGuideId}
          setActiveGuideId={setActiveGuideId}
        />

        <div className="editor">
          {guidesDb.loading ? (
            <p>Loading guides…</p>
          ) : activeGuide ? (
            <>
              <button onClick={() => setActiveGuideId(null)}>
                Close Guide
              </button>

              <GuideEditor
                guide={activeGuide}
                notesDb={notesDb}
                onUpdateTitle={updateGuideTitle}
                attachmentsDb={attachmentsDb}
              />

              <AttachmentPreviewPanel attachmentsDb={attachmentsDb} />
            </>
          ) : (
            <>
              <CalendarPanel subjectId={id} />
              <p>Select or create a study guide</p>
            </>
          )}
        </div>
      </div>    
      </>
  );
    
}

export default SubjectDetail;
