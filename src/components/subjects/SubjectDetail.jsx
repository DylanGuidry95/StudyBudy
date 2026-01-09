import { useState } from "react";
import SubjectSidebar from "./SubjectSidebar";
import GuideEditor from "../guides/GuideEditor";
import { useGuidesDb } from "../../hooks/useGuidesDb";

function SubjectDetail({ subject, onBack }) {
  const [activeGuideId, setActiveGuideId] = useState(null);
  const guidesDb = useGuidesDb(subject.id);

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
        {guidesDb.loading ? (
          <p>Loading guides…</p>
        ) : activeGuide ? (
          <GuideEditor 
          guide={activeGuide}
          onUpdateTitle={updateGuideTitle} />
        ) : (
          <p>Select or create a study guide</p>
        )}
      </div>
    </div>
  );
}

export default SubjectDetail;
