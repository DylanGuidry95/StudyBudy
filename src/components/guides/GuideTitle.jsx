import { useState } from "react";

function GuideTitle({ guide, updateGuide }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(guide.title);

  const save = () => {
    if (!value.trim()) return;
    updateGuide(value.trim());
    setEditing(false);
  };

  return (
    <div style={{ display: "flex", gap: "8px" }}>
      {editing ? (
        <>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={save}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>{guide.title}</h2>
          <button onClick={() => setEditing(true)}>✏️</button>
        </>
      )}
    </div>
  );
}

export default GuideTitle;
