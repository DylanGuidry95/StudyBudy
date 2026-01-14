import { useState } from "react";

export function useAttachments(attachments, updateGuide) {
  const [activeAttachmentId, setActiveAttachmentId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const upload = (file) => {
    if (!file) return;

    const type = file.type.includes("pdf")
      ? "pdf"
      : file.type.includes("image")
      ? "image"
      : file.type.includes("text")
      ? "text"
      : null;

    if (!type) {
      alert("Unsupported file type");
      return;
    }

    const newAttachment = {
      id: Date.now(),
      name: file.name,
      type,
      url: URL.createObjectURL(file),
    };

    updateGuide({
      attachments: [...attachments, newAttachment],
    });

    setActiveAttachmentId(newAttachment.id);
  };

  const startRename = (file) => {
    setRenamingId(file.id);
    setRenameValue(file.name);
  };

  const saveRename = () => {
    updateGuide({
      attachments: attachments.map((a) =>
        a.id === renamingId ? { ...a, name: renameValue } : a
      ),
    });

    setRenamingId(null);
  };

  const remove = (id) => {
    if (!window.confirm("Delete this attachment?")) return;

    updateGuide({
      attachments: attachments.filter((a) => a.id !== id),
    });

    if (id === activeAttachmentId) {
      setActiveAttachmentId(null);
    }
  };

  const activeAttachment = attachments.find(
    (a) => a.id === activeAttachmentId
  );

  return {
    activeAttachment,
    activeAttachmentId,
    setActiveAttachmentId,
    renamingId,
    renameValue,
    setRenameValue,    
    upload,
    startRename,
    saveRename,
    remove,
  };
}
