import React, { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Layout from "../layout/Layout";
import { getEventDetail, getEvents } from "../services/eventServices";

import { format, startOfWeek, endOfWeek } from "date-fns";
import CreateEventModal from "../components/CreateEventsModals";
import { socket } from "../socket/config";


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

const HOUR_HEIGHT = 60;
const MINUTE_HEIGHT = HOUR_HEIGHT / 60;

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
const EventCard: React.FC<{
  event: CalendarEvent;
  index: number;
  total: number;
  onclick: (ev: CalendarEvent, e: React.MouseEvent) => void;
}> = ({ event, index, total, onclick }) => {
  const start = new Date(event.start);
  const end = new Date(event.end);

  const startMinutes = start.getHours() * 60 + start.getMinutes();
  const durationMinutes = Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / 60000)
  );

  // const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  // const fmt = new Intl.DateTimeFormat("vi-VN", {
  //   hour: "2-digit",
  //   minute: "2-digit",
  //   hour12: false,
  //   timeZone,
  // });

  const widthPercent = 100 / total;
  const leftPercent = index * widthPercent;

  return (
    <div
      className="absolute bg-blue-500 text-white text-sm rounded px-2 py-1 overflow-hidden"
      style={{
        top: startMinutes * MINUTE_HEIGHT,
        height: durationMinutes * MINUTE_HEIGHT,
        width: `${widthPercent - 2}%`,
        left: `${leftPercent - 2}%`,
      }}
      onClick={(e) => onclick(event, e)}
    >
      <p className="text-sm font-semibold">{event.content}</p>
    </div>
  );
};

/* -------------------- Time Slot -------------------- */
const TimeSlot: React.FC<{ hour: number }> = ({ hour }) => (
  <div className="h-[60px] border-t border-gray-200 relative">
    <span className="absolute -top-3 text-xs text-gray-500">{hour}:00</span>
  </div>
);
/* -------------------- Week Grid -------------------- */
const WeekGrid: React.FC<{
  events: CalendarEvent[];
  onEventclick: (
    ev: CalendarEvent,
    e: React.MouseEvent
  ) => void | Promise<void>;
  onCeilClick: (dayIdx: number, hour: number) => void;
}> = ({ events, onEventclick, onCeilClick }) => {
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
          const jsDay = ev.start.getDay();
          const mappedDay = (dayIdx + 1) % 7;
          return jsDay === mappedDay;
        });

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
          <div
            key={day}
            className="col-span-1 border-l border-gray-200 relative "
          >
            {HOURS.map((hour) => (
              <div
                key={hour}
                onClick={() => onCeilClick(dayIdx, hour)}
                className="h-[60px] border-t border-gray-100 hover:bg-blue-50 cursor-pointer"
              />
            ))}

            {/* Render events trong nhóm overlap */}
            {groups.map((group) =>
              group.map((event, i) => (
                <EventCard
                  key={event.id}
                  event={event}
                  index={i}
                  total={group.length}
                  onclick={onEventclick}
                />
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

  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [eventDetail, setEventDetail] = useState<any>(null);

  const [modalPosition, setModalPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);

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

  const handleCellClick = (dayIdx: number, hour: number) => {
    const startOfWeekDate = getStartOfWeek(currentDate);
    const clickedDate = new Date(startOfWeekDate);
    clickedDate.setDate(startOfWeekDate.getDate() + dayIdx); // ✅ tính ngày trong tuần
    clickedDate.setHours(hour, 0, 0, 0);

    setSelectedDateTime(clickedDate);
    setIsCreateModalOpen(true);
  };

  const loadEvents = async (startDate: Date, endDate: Date) => {
    try {
      const startStr = format(startDate, "yyyy-MM-dd");
      const endStr = format(endDate, "yyyy-MM-dd");
      const res = await getEvents(startStr, endStr);
      setEvents(
        res.map((e) => ({
          id: e.id,
          content: e.content,
          description: e.description,
          start: new Date(e.startDate),
          end: new Date(e.endDate),
        }))
      );
    } catch (err) {
      console.error("Failed to load events", err);
    }
  };

useEffect(() => {

   if (!socket.connected) {
      socket.connect();
    }
    
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });
  socket.on("event:created", (newEvent) => {
    const mapped = {
      id: newEvent.id,
      content: newEvent.content,
      description: newEvent.description,
      start: new Date(newEvent.startDate),
      end: new Date(newEvent.endDate),
    };
    setEvents((prev) => [...prev, mapped]);
  });

  return () => {
    socket.off("event:created");
  };
}, []);

  const handleEventClick = async (
    event: CalendarEvent,
    e: React.MouseEvent
  ) => {
    setSelectedEvent(event);
    try {
      const detail = await getEventDetail(event.id);
      setEventDetail(detail);

      setModalPosition({ x: e.clientX, y: e.clientY });
    } catch (err) {
      console.error("Failed to fetch event detail", err);
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
              <div className="flex items-center gap-2 px-4 py-2 text-black">
                {viewMode === "week" ? (
                  <>
                    {format(
                      startOfWeek(currentDate, { weekStartsOn: 1 }),
                      "dd MMM yyyy"
                    )}{" "}
                    –{" "}
                    {format(
                      endOfWeek(currentDate, { weekStartsOn: 1 }),
                      "dd MMM yyyy"
                    )}
                  </>
                ) : (
                  currentDate.toLocaleDateString("default", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                )}
              </div>
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
        {viewMode === "week" && (
          <WeekGrid
            events={events}
            onEventclick={(event: CalendarEvent, e: React.MouseEvent) => {
              void handleEventClick(event, e);
            }}
            onCeilClick={handleCellClick}
          />
        )}
        {/* TODO: thêm DayGrid & MonthGrid */}:{/* Modal */}
        {selectedEvent && modalPosition && (
          <div className="fixed inset-0 bg-opacity-30">
            <div
              className="absolute bg-white p-4 rounded-lg shadow-lg w-[300px]"
              style={{
                top: modalPosition.y,
                left: modalPosition.x,
                transform: "translate(-50%, -10%)", // căn chỉnh cho đẹp
              }}
            >
              <h3 className="text-lg font-semibold mb-2">
                {eventDetail?.content || selectedEvent.content}
              </h3>
              <p className="text-sm text-gray-600 mb-2">
                {eventDetail?.description || selectedEvent.description}
              </p>
              <p className="text-xs text-gray-500">
                {selectedEvent.start.toLocaleString()} -{" "}
                {selectedEvent.end.toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-3 px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        )}
        <CreateEventModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          defaultDate={selectedDateTime || new Date()}
          onSubmit={(data: any) => console.log("Create Event:", data)}
        />
        ;
      </div>
    </Layout>
  );
};

export default Calendar;
