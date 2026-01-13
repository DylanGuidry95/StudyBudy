import GuideTitle from "./GuideTitle";
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
      <NotesPanel notesDb={notesDb} />
      <AttachmentPanel attachmentsDb={attachmentsDb} />
    </>
  );
}

export default GuideEditor;
