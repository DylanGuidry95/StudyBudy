import { parseAttachmentLinks } from "../../utils/parseAttachmentLinks";
import AttachmentLink from "../attachments/AttachmentLink";

function NotePreview({ content, attachments }) {
  const parts = parseAttachmentLinks(content);

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {parts.map((part, i) =>
        part.type === "text" ? (
          <span key={i}>{part.value}</span>
        ) : (
          <AttachmentLink            
            name={part.value}
            attachments={attachments}            
          />
        )
      )}
    </div>
  );
}

export default NotePreview;
