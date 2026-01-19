import { createPortal } from "react-dom";
import { useAttachmentPreview } from "./AttachmentPreviewContext";
import { useEffect, useState } from "react";
import "./AttachmentPreviewPanel.css";

function AttachmentPreviewPanel({ attachmentsDb }) {
  const { attachment, closePreview } = useAttachmentPreview();
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!attachment) {
      setUrl(null);
      return;
    }

    let cancelled = false;

      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      attachmentsDb.getUrl(attachment.storage_path).then((u) => {
        if (!cancelled) setUrl(u);
      });
    });

    return () => {
      cancelled = true;
      document.body.style.overflow = originalOverflow;
    };
  }, [attachment]);

  if (!attachment) return null;

  return createPortal(
    <div className="attachment-overlay" onClick={closePreview}>
      <div
        className="attachment-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="attachment-header">
          <strong>{attachment.name}</strong>
          <button onClick={closePreview}>✕</button>
        </div>

        <div className="attachment-content">
          {!url ? (
            <div className="attachment-loading">Loading preview…</div>
          ) : attachment.type === "image" ? (
            <img src={url} alt={attachment.name} />
          ) : (
            <iframe src={url} title={attachment.name} />
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default AttachmentPreviewPanel;
