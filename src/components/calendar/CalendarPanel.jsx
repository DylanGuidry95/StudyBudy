import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useCalendarDb } from "../../hooks/useCalendarDb";
import CalendarEventPanel from "./CalendarEventPanel";
import { useSubjectsDb } from "../../hooks/useSubjectsDb";

function CalendarPanel({ subjectId = null }) {
  const calendarDb = useCalendarDb();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const { subjects } = useSubjectsDb();

  const visibleEvents = subjectId
    ? calendarDb.events.filter((e) => e.subject_id == subjectId)
    : calendarDb.events;

  const handleDateClick = (info) => {
    setCreateDate(info.dateStr);
    setSelectedEvent(null);
  };

  const handleEventClick = (info) => {
    const event = calendarDb.events.find((e) => e.id === info.event.id);
    setSelectedEvent(event);
    setCreateDate(null);
  };

  return (
    <div className="calendar-layout">
      <div className="calendar-main">
        <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  dateClick={handleDateClick}
  eventClick={handleEventClick}
  events={visibleEvents.map((e) => {
    const subject = subjects.find(
      (s) => s.id === String(e.subject_id)
    );

    const color = subject?.color ?? "#3b82f6";

    return {
      id: e.id,
      title: e.title,
      start: e.start_date,
      backgroundColor: color,
      borderColor: color,
    };
  })}
  height="auto"
/>
      </div>

      <CalendarEventPanel
        calendarDb={calendarDb}
        subjectId={subjectId ?? null}
        selectedEvent={selectedEvent}
        createDate={createDate}
        onClose={() => {
          setSelectedEvent(null);
          setCreateDate(null);
        }}
      />
    </div>
  );
}

export default CalendarPanel;
