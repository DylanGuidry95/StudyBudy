import GuideTitle from "./GuideTitle";
import NotesPanel from "../notes/NotesPanel";
import AttachmentPanel from "../attachments/AttachmentPanel";
import CalendarPanel from "../home/CalendarPanel";

function GuideEditor({ guide, updateGuide }) {
  return (
    <>
      <GuideTitle guide={guide} updateGuide={updateGuide} />
      
      <NotesPanel
        notes={guide.notes}
        updateGuide={updateGuide}
      />

      <AttachmentPanel
        attachments={guide.attachments}
        updateGuide={updateGuide}
      />

      <CalendarPanel/>
    </>
  );
}

export default GuideEditor;
