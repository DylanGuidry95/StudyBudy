function AttachmentList({ attachments, ui, db }) {
  return (
    <ul style={{ minWidth: "180px" }}>
      {(attachments ?? []).map((file) => (
        <li key={file.id} style={{ marginBottom: "8px" }}>
          {ui.renamingId === file.id ? (
            <>
              <input
                value={ui.renameValue}
                onChange={(e) => ui.setRenameValue(e.target.value)}
              />
              <button onClick={ui.saveRename}>Save</button>
              <button onClick={() => ui.setRenamingId(null)}>Cancel</button>
            </>
          ) : (
            <>
              <button
                onClick={() =>
                  ui.setActiveId((prev) => (prev === file.id ? null : file.id))
                }
                style={{
                  fontWeight: file.id === ui.activeId ? "bold" : "normal",
                }}
              >
                {file.name}
              </button>

              <button
                onClick={() => {
                  ui.setRenamingId(file.id);
                  ui.setRenameValue(file.name);
                }}
                style={{ marginLeft: "6px" }}
              >
                ✏️
              </button>

              <button
                onClick={() => {
                  db.deleteAttachment(file.id);
                  ui.setActiveId((prev) => (prev === file.id ? null : prev));
                }}
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
