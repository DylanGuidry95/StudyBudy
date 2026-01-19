import { useAttachmentPreview } from "../attachments/AttachmentPreviewContext";

function AttachmentList({ attachments = [], ui, db }) {
  const { openPreview } = useAttachmentPreview();
  return (
    <ul style={{ minWidth: "180px" }}>
      {attachments.map((file) => (
        <li key={file.id} style={{ marginBottom: "8px" }}>
          {ui.renamingId === file.id ? (
            <>
              <input
                value={ui.renameValue}
                onChange={(e) => ui.setRenameValue(e.target.value)}
              />
              <button onClick={() => ui.saveRename(file.id)}>
                Save
              </button>
              <button onClick={ui.cancelRename}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => openPreview(file)}
                style={{
                  fontWeight:
                    file.id === ui.activeId ? "bold" : "normal",
                }}
              >
                {file.name}
              </button>

              <button
                onClick={() => ui.startRename(file)}
                style={{ marginLeft: "6px" }}
              >
                ✏️
              </button>

              <button
                onClick={() => db.remove(file.id)}
                style={{ marginLeft: "6px", color: "red" }}
              >
                🗑️
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export default AttachmentList;
