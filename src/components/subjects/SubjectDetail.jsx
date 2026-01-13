import { useState } from "react";
import SubjectSidebar from "./SubjectSidebar";
import GuideEditor from "../guides/GuideEditor";
import { useGuidesDb } from "../../hooks/useGuidesDb";
import { useNotesDb } from "../../hooks/useNoteDb";
import { useAttachmentsDb } from "../../hooks/useAttachmentsDb";
import CalendarPanel from "../calendar/CalendarPanel";

function SubjectDetail({ subject, onBack }) {
  const [activeGuideId, setActiveGuideId] = useState(null);
  const guidesDb = useGuidesDb(subject.id);
  const notesDb = useNotesDb(activeGuideId);
  const attachmentsDb = useAttachmentsDb(activeGuideId);

  const activeGuide = guidesDb.guides.find(
    (g) => g.id === activeGuideId
  );

  const updateGuideTitle = async (newTitle) => {
    await guidesDb.updateGuideTitle(activeGuideId, newTitle);
  };

  return (
    <div className="subject-layout">
      <SubjectSidebar
        subject={subject}
        guidesDb={guidesDb}
        activeGuideId={activeGuideId}
        setActiveGuideId={setActiveGuideId}
        onBack={onBack}
      />      
      <div className="editor">
        <CalendarPanel subjectId={subject.id}> </CalendarPanel>
        {guidesDb.loading ? (
          <p>Loading guides…</p>
        ) : activeGuide ? (
          <GuideEditor 
          guide={activeGuide}
          notesDb={notesDb}
          onUpdateTitle={updateGuideTitle}
          attachmentsDb= {attachmentsDb} />
        ) : (
          <p>Select or create a study guide</p>
        )}
      </div>
    </div>
  );
}

export default SubjectDetail;
