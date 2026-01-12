import { useEffect, useState } from "react";

export function useAttachmentsUi(attachmentsDb) {
  const [activeId, setActiveId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  // Load preview when selection changes
  useEffect(() => {
    if (!activeId) {
      setPreviewUrl(null);
      return;
    }

    const attachment = attachmentsDb.attachments.find(
      (a) => a.id === activeId
    );

    if (!attachment) return;

    attachmentsDb
      .getUrl(attachment.storage_path)
      .then(setPreviewUrl);
  }, [activeId, attachmentsDb.attachments]);

  const startRename = (attachment) => {
    setRenamingId(attachment.id);
    setRenameValue(attachment.name);
  };

  const cancelRename = () => {
    setRenamingId(null);
    setRenameValue("");
  };

  const saveRename = async () => {
    if (!renameValue.trim()) return;

    await attachmentsDb.rename(renamingId, renameValue.trim());
    cancelRename();
  };

  return {
    activeId,
    setActiveId,
    previewUrl,

    renamingId,
    renameValue,
    setRenameValue,
    startRename,
    saveRename,
    cancelRename,
  };
}
