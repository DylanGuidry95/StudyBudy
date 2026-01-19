import { useRef } from "react";
import AttachmentList from "./AttachmentList";
import { useAttachmentsUi } from "../../hooks/useAttachmentsUi";

function AttachmentPanel({ attachmentsDb }) {
  const ui = useAttachmentsUi(attachmentsDb);
  const fileInputRef = useRef(null);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    attachmentsDb.upload(file);

    // Reset input so same file can be selected again later
    e.target.value = "";
  };

  const db = {
    ...attachmentsDb,
    deleteAttachment: attachmentsDb.remove
  }

  const activeFile = (attachmentsDb.attachments ?? []).find(
    (a) => a.id === ui.activeId
  );  

  if (attachmentsDb.loading) {
    return <p>Loading attachments…</p>;
  }

  return (
    <div>
      <h3>Attachments</h3>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,image/*,.txt"
        style={{ display: "none" }}
        onChange={handleFileSelected}
      />

      {/* Upload button */}
      <button onClick={openFileDialog}>➕ Upload Attachment</button>

      <AttachmentList
        attachments={attachmentsDb.attachments}
        ui={ui}
        db={db}
      />
    </div>
  );
}

export default AttachmentPanel;
