import GuideTitle from "./GuideTitle";
import CalendarPanel from "../home/CalendarPanel";

function GuideEditor({ guide, onUpdateTitle }) {
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
    </>
  );
}

export default GuideEditor;
