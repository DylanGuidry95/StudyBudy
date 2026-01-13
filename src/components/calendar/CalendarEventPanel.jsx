import { useEffect, useState } from "react";

function CalendarEventPanel({
  calendarDb,
  subjectId = null,
  selectedEvent,
  createDate,
  onClose,
}) {
  const isCreate = !!createDate;

  const [editing, setEditing] = useState(isCreate);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (selectedEvent) {
      setTitle(selectedEvent.title);
      setDate(selectedEvent.start_date);
      setTime(selectedEvent.start_time || "");
      setDescription(selectedEvent.description || "");
      setEditing(false);
    } else if (createDate) {
      setTitle("");
      setDate(createDate);
      setTime("");
      setDescription("");
      setEditing(true);
    }
  }, [selectedEvent, createDate]);

  if (!selectedEvent && !createDate) return null;

  const save = () => {
    if (isCreate) {
      calendarDb.addEvent({
        title,
        subject_id: subjectId ?? null,
        start_date: date,
        start_time: time || null,
        description,
      });
    } else {
      calendarDb.updateEvent(selectedEvent.id, {
        title,        
        start_date: date,
        start_time: time || null,
        description,
      });
    }

    onClose();
  };

  return (
    <div className="calendar-panel">
      <h3>{isCreate ? "New Event" : "Event Details"}</h3>

      <label>
        Title
        <input
          value={title}
          disabled={!editing}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>

      <label>
        Date
        <input
          type="date"
          value={date}
          disabled={!editing}
          onChange={(e) => setDate(e.target.value)}
        />
      </label>

      <label>
        Time
        <input
          type="time"
          value={time}
          disabled={!editing}
          onChange={(e) => setTime(e.target.value)}
        />
      </label>

      <label>
        Description
        <textarea
          value={description}
          disabled={!editing}
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>

      <div style={{ marginTop: "12px" }}>
        {editing ? (
          <button onClick={save}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}

        {!isCreate && (
          <button
            style={{ color: "red", marginLeft: "8px" }}
            onClick={() => {
              if (window.confirm("Delete this event?")) {
                calendarDb.deleteEvent(selectedEvent.id);
                onClose();
              }
            }}
          >
            Delete
          </button>
        )}

        <button onClick={onClose} style={{ marginLeft: "8px" }}>
          Close
        </button>
      </div>
    </div>
  );
}

export default CalendarEventPanel;
