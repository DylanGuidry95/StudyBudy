import GuideTitle from "./GuideTitle";
import CalendarPanel from "../home/CalendarPanel";
import NotesPanel from "../notes/NotesPanel";
import AttachmentPanel from "../attachments/AttachmentPanel";

function GuideEditor({ guide, onUpdateTitle, notesDb, attachmentsDb }) {
  if (!guide) {
    return <p>No guide selected</p>;
  }

  return (
    <>
      <GuideTitle
        guide={guide}                
        updateGuide={onUpdateTitle}
      />      
      {/* Notes & attachments come back after DB migration */}      
      <CalendarPanel />
      <NotesPanel notesDb={notesDb} />
      <AttachmentPanel attachmentsDb={attachmentsDb} />
    </>
  );
}

export default GuideEditor;
