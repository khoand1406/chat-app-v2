import React, { useEffect, useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiClock,
} from "react-icons/fi";
import Layout from "../layout/Layout";
import { getEvents } from "../services/eventServices";


interface CalendarEvent {
  id: number;
  content: string;
  description: string;
  start: Date;
  end: Date;
}

type ViewMode = "day" | "week" | "month";

const HOURS: number[] = Array.from({ length: 24 }, (_, i) => i);
const DAYS: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const HOUR_HEIGHT = 120;            // phải khớp với TimeSlot: h-[120px]
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;
/* -------------------- Helpers -------------------- */
const getStartOfWeek = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay() || 7;
  if (day !== 1) d.setHours(-24 * (day - 1));
  return d;
};

const getMonthRange = (date: Date) => {
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { startDate, endDate };
};

/* -------------------- Event Card -------------------- */
const EventCard: React.FC<{ event: CalendarEvent; index: number; total: number }> = ({ event, index, total }) => {
  const start = new Date(event.start);
  const end = new Date(event.end);

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const durationMinutes = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 60000)
  );

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fmt = new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  });

  const widthPercent = 100 / total;
  const leftPercent = index * widthPercent;

  return (
    <div
      className="absolute bg-blue-500 text-white text-sm rounded px-2 py-1 overflow-hidden"
      style={{
        top: startMinutes * MINUTE_HEIGHT,
        height: durationMinutes * MINUTE_HEIGHT,
        width: `${widthPercent}%`,
        left: `${leftPercent}%`,
      }}
    >
      <p className="text-sm font-semibold truncate">{event.content}</p>
      <span className="text-xs flex items-center gap-1">
        <FiClock /> {fmt.format(start)} - {fmt.format(end)}
      </span>
    </div>
  );
};

/* -------------------- Time Slot -------------------- */
const TimeSlot: React.FC<{ hour: number }> = ({ hour }) => (
  <div className="h-[120px] border-t border-gray-200 relative">
    <span className="absolute -top-3 text-xs text-gray-500">{hour}:00</span>
  </div>
);
/* -------------------- Week Grid -------------------- */
const WeekGrid: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
  return (
    <div className="grid grid-cols-8 flex-1 overflow-auto">
      {/* Time column */}
      <div className="col-span-1 w-20 pr-2 text-right">
        {HOURS.map((hour) => (
          <TimeSlot key={hour} hour={hour} />
        ))}
      </div>

      {/* Days columns */}
      {DAYS.map((day, dayIdx) => {
        const dayEvents = events.filter((ev) => {
          const jsDay = ev.start.getDay(); // 0=Sun,...6=Sat
          const mappedDay = (dayIdx + 1) % 7;
          return jsDay === mappedDay;
        });

        // Gom nhóm overlap theo giờ
        const groups: CalendarEvent[][] = [];
        dayEvents.sort((a, b) => a.start.getTime() - b.start.getTime());

        dayEvents.forEach((ev) => {
          let placed = false;
          for (const group of groups) {
            if (group.every((g) => g.end <= ev.start || g.start >= ev.end)) {
              continue; // không overlap
            }
            group.push(ev);
            placed = true;
            break;
          }
          if (!placed) groups.push([ev]);
        });

        return (
          <div key={day} className="col-span-1 border-l border-gray-200 relative">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-[120px] border-t border-gray-100 hover:bg-blue-50 cursor-pointer"
              />
            ))}

            {/* Render events trong nhóm overlap */}
            {groups.map((group) =>
              group.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} total={group.length} />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------- Main Calendar Page -------------------- */
const Calendar: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);

  /* Load events when date/viewMode changes */
  useEffect(() => {
    let startDate: Date;
    let endDate: Date;

    if (viewMode === "month") {
      const range = getMonthRange(currentDate);
      startDate = range.startDate;
      endDate = range.endDate;
    } else if (viewMode === "week") {
      startDate = getStartOfWeek(currentDate);
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else {
      startDate = new Date(currentDate);
      endDate = new Date(currentDate);
    }

    loadEvents(startDate, endDate);
  }, [currentDate, viewMode]);

 const loadEvents = async (startDate: Date, endDate: Date) => {
  try {
    const res = await getEvents(startDate, endDate);
    setEvents(
      res.map(e => ({
        id: e.id,
    content: e.content,
    description: e.description,
    start: new Date(e.startDate),
    end: new Date(e.endDate)
  }))
    );
  } catch (err) {
    console.error("Failed to load events", err);
  }
};

  const navigate = (direction: "next" | "prev") => {
    const newDate = new Date(currentDate);
    if (viewMode === "month") {
      newDate.setMonth(
        currentDate.getMonth() + (direction === "next" ? 1 : -1)
      );
    } else if (viewMode === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7));
    } else {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  return (
    <Layout>
      <div className="flex flex-col h-screen bg-white w-auto">
        {/* Header */}
        <header className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("prev")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("next")}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentDate(new Date())}
                className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Today
              </button>
            </div>
            <h2 className="text-xl font-semibold">
              {currentDate.toLocaleDateString("default", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <div className="flex items-center gap-4">
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as ViewMode)}
                className="px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="day">Day</option>
                <option value="week">Week</option>
                <option value="month">Month</option>
              </select>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <FiPlus /> New Event
              </button>
            </div>
          </div>
          {viewMode === "week" && (
            <div className="grid grid-cols-8 text-sm font-medium">
              <div className="col-span-1 w-20" />
              {DAYS.map((day) => (
                <div key={day} className="col-span-1 p-4 text-center">
                  {day}
                </div>
              ))}
            </div>
          )}
        </header>

        {/* Calendar grid */}
        {viewMode === "week" && <WeekGrid events={events} />}
        {/* TODO: thêm DayGrid & MonthGrid */}

        {/* Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[400px]">
              <h3 className="text-lg font-semibold mb-4">Create New Event</h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Calendar;
