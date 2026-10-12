import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Users,
  Bell,
  BellRing,
  Download,
  Filter,
  CheckCircle,
  Plus,
} from 'lucide-react';
import { CalendarEvent } from '../types';

interface CalendarTabProps {
  events: CalendarEvent[];
  onToggleReminder: (id: string) => void;
}

export const CalendarTab: React.FC<CalendarTabProps> = ({
  events,
  onToggleReminder,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [viewStyle, setViewStyle] = useState<'agenda' | 'month'>('agenda');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === 'all') return true;
    return ev.category === activeCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSyncToCalendar = (title: string, date: string) => {
    showToast(`Added "${title}" to your phone's calendar.`);
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'exam':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'sports':
        return 'text-amber-800 bg-amber-50 border-amber-200';
      case 'cultural':
        return 'text-purple-800 bg-purple-50 border-purple-200';
      case 'parent_meeting':
        return 'text-blue-900 bg-blue-50 border-blue-200';
      case 'term':
        return 'text-emerald-800 bg-emerald-50 border-emerald-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'exam':
        return 'Exam / Assessment';
      case 'sports':
        return 'Sports Fixture';
      case 'cultural':
        return 'Cultural & Arts';
      case 'parent_meeting':
        return 'Parent Consultation';
      case 'term':
        return 'Term / Holiday';
      default:
        return 'Event';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            School Calendar & Fixtures
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Never miss an event. Full interactive schedule for exam timetables, sports fixtures, cultural galas, and parent-teacher consultations with instant push reminders.
          </p>
        </div>

        {/* View switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setViewStyle('agenda')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewStyle === 'agenda'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Agenda View
          </button>
          <button
            onClick={() => setViewStyle('month')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              viewStyle === 'month'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            October 2026 Grid
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Filter Category Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Fixtures ({events.length})
        </button>
        <button
          onClick={() => setActiveCategory('sports')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'sports'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sports
        </button>
        <button
          onClick={() => setActiveCategory('exam')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'exam'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Exams & Tests
        </button>
        <button
          onClick={() => setActiveCategory('parent_meeting')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'parent_meeting'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Parent Consultations
        </button>
        <button
          onClick={() => setActiveCategory('cultural')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'cultural'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cultural & Arts
        </button>
        <button
          onClick={() => setActiveCategory('term')}
          className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            activeCategory === 'term'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Term Dates & Holidays
        </button>
      </div>

      {/* Agenda View */}
      {viewStyle === 'agenda' ? (
        <div className="space-y-3">
          {filteredEvents.map((evt) => {
            const dateObj = new Date(evt.date);
            const dayNum = evt.date.split('-')[2];
            const monthStr = 'OCT';

            return (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Date Monogram */}
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 text-center flex flex-col justify-center shrink-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {monthStr}
                    </span>
                    <span className="text-xl font-bold text-slate-900 tabular-nums leading-tight">
                      {dayNum}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${getCategoryColor(evt.category)}`}>
                        {getCategoryLabel(evt.category)}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Target: {evt.targetGrades}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      {evt.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                      {evt.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {evt.time} {evt.endTime ? `- ${evt.endTime}` : ''}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {evt.venue}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => {
                      onToggleReminder(evt.id);
                      showToast(
                        evt.reminderSet
                          ? `Cancelled reminder for ${evt.title}`
                          : `Reminder set! You will receive a notification 1 hour before.`
                      );
                    }}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 ${
                      evt.reminderSet
                        ? 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {evt.reminderSet ? (
                      <>
                        <BellRing className="w-3.5 h-3.5 text-amber-700" />
                        <span>Reminder Set</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5 text-slate-500" />
                        <span>Notify Me</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleSyncToCalendar(evt.title, evt.date)}
                    className="px-3 py-1.5 text-xs font-semibold bg-blue-900 text-white hover:bg-blue-800 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Sync
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Month Grid Preview */
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              October 2026 Academic Term 4 Calendar
            </h2>
            <span className="text-xs text-slate-500">Term 4 Week 3 of 10</span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-500 pb-2 border-b border-slate-100">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div className="text-slate-400">Sat</div>
            <div className="text-slate-400">Sun</div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Blank leading days */}
            <div className="h-20 p-1.5 bg-slate-50/50 rounded-lg text-slate-300">28</div>
            <div className="h-20 p-1.5 bg-slate-50/50 rounded-lg text-slate-300">29</div>
            <div className="h-20 p-1.5 bg-slate-50/50 rounded-lg text-slate-300">30</div>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
              const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
              const dayEvents = events.filter((e) => e.date === dateStr);

              return (
                <div
                  key={day}
                  className={`min-h-[80px] p-1.5 border rounded-lg transition-all ${
                    dayEvents.length > 0
                      ? 'border-blue-200 bg-blue-50/20'
                      : 'border-slate-100 hover:border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 tabular-nums">{day}</span>
                    {dayEvents.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-900"></span>
                    )}
                  </div>

                  <div className="mt-1 space-y-1">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className="text-[10px] p-1 rounded bg-white border border-slate-200 text-slate-800 truncate"
                        title={ev.title}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-slate-400 font-medium">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
