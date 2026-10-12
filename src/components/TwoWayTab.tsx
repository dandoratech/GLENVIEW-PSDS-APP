import React, { useState } from 'react';
import {
  MessageSquare,
  UserCheck,
  Calendar,
  Send,
  CheckCircle,
  FileText,
  Clock,
  AlertCircle,
  Plus,
  Paperclip,
  Check,
} from 'lucide-react';
import {
  Child,
  AbsenceRecord,
  InterviewBooking,
  MessageThread,
  TeacherSlot,
} from '../types';
import {
  INITIAL_TEACHERS,
  INITIAL_INTERVIEW_BOOKINGS,
  INITIAL_MESSAGES,
} from '../data/mockData';

interface TwoWayTabProps {
  childrenList: Child[];
  preselectedTeacher?: string | null;
  onClearPreselectedTeacher?: () => void;
  defaultSubTab?: 'absence' | 'interviews' | 'messages';
}

export const TwoWayTab: React.FC<TwoWayTabProps> = ({
  childrenList,
  preselectedTeacher,
  onClearPreselectedTeacher,
  defaultSubTab = 'absence',
}) => {
  const [subTab, setSubTab] = useState<'absence' | 'interviews' | 'messages'>(defaultSubTab);

  // Absence form states
  const [selectedChildId, setSelectedChildId] = useState<string>(childrenList[0]?.id || '');
  const [absenceStartDate, setAbsenceStartDate] = useState<string>('2026-10-14');
  const [absenceEndDate, setAbsenceEndDate] = useState<string>('2026-10-14');
  const [absenceReason, setAbsenceReason] = useState<string>('Illness / Medical Appointment');
  const [absenceNotes, setAbsenceNotes] = useState<string>('');
  const [hasDoctorNote, setHasDoctorNote] = useState<boolean>(false);
  const [submittedAbsenceRef, setSubmittedAbsenceRef] = useState<string | null>(null);

  // Interview Booking states
  const [bookings, setBookings] = useState<InterviewBooking[]>(INITIAL_INTERVIEW_BOOKINGS);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(
    preselectedTeacher
      ? INITIAL_TEACHERS.find((t) => t.teacherName.includes(preselectedTeacher))?.id || INITIAL_TEACHERS[0].id
      : INITIAL_TEACHERS[0].id
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('15:30');
  const [bookingToast, setBookingToast] = useState<string | null>(null);

  // Messaging states
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_MESSAGES);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_MESSAGES[0].id);
  const [messageInput, setMessageInput] = useState<string>('');

  const activeThread = threads.find((t) => t.id === activeThreadId) || threads[0];
  const activeTeacher = INITIAL_TEACHERS.find((t) => t.id === selectedTeacherId) || INITIAL_TEACHERS[0];

  const handleReportAbsence = (e: React.FormEvent) => {
    e.preventDefault();
    const ref = `ABS-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setSubmittedAbsenceRef(ref);
  };

  const handleBookSlot = (teacher: TeacherSlot, slot: string) => {
    const newBooking: InterviewBooking = {
      id: `bk-${Date.now()}`,
      teacherName: teacher.teacherName,
      subject: teacher.subject,
      date: '2026-10-23',
      timeSlot: slot,
      childName: 'Sipho Khumalo',
      status: 'confirmed',
    };
    setBookings((prev) => [newBooking, ...prev]);
    setBookingToast(`Consultation confirmed with ${teacher.teacherName} at ${slot} on 23 October.`);
    setTimeout(() => setBookingToast(null), 4000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      sender: 'parent' as const,
      text: messageInput.trim(),
      timestamp: 'Just now',
    };

    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === activeThread.id
          ? {
              ...thread,
              lastMessage: newMsg.text,
              lastTimestamp: 'Just now',
              messages: [...thread.messages, newMsg],
            }
          : thread
      )
    );
    setMessageInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Two-Way School Communication
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Report learner absences in one tap, schedule parent-educator interviews, and correspond directly with classroom tutors.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setSubTab('absence')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'absence'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Report Absence
          </button>
          <button
            onClick={() => setSubTab('interviews')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'interviews'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Book Consultations ({bookings.length})
          </button>
          <button
            onClick={() => setSubTab('messages')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              subTab === 'messages'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Teacher Messaging
          </button>
        </div>
      </div>

      {bookingToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {bookingToast}
        </div>
      )}

      {/* ---------------- 1. REPORT ABSENCE ---------------- */}
      {subTab === 'absence' && (
        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-xl p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              One-Tap Learner Absence Notification
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Instantly notifies the school administration and class tutor to update the official morning register.
            </p>
          </div>

          {submittedAbsenceRef ? (
            <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3 text-center">
              <CheckCircle className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="text-base font-bold text-emerald-900">
                Absence Acknowledged by Glenview PSDS
              </h3>
              <p className="text-xs text-emerald-800 max-w-md mx-auto">
                Your submission has been logged into the school register and forwarded to Mr. Botha. An official verification SMS has been dispatched.
              </p>
              <div className="font-mono text-xs bg-white border border-emerald-200 px-3 py-1.5 rounded-lg inline-block text-emerald-950 font-bold">
                Ref No: {submittedAbsenceRef}
              </div>
              <div>
                <button
                  onClick={() => setSubmittedAbsenceRef(null)}
                  className="mt-2 text-xs font-medium text-emerald-800 underline"
                >
                  Submit Another Notice
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleReportAbsence} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Learner
                </label>
                <select
                  value={selectedChildId}
                  onChange={(e) => setSelectedChildId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 font-medium"
                >
                  {childrenList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.grade} ({c.studentNumber})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Start Date of Absence
                  </label>
                  <input
                    type="date"
                    required
                    value={absenceStartDate}
                    onChange={(e) => setAbsenceStartDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Expected Return Date
                  </label>
                  <input
                    type="date"
                    required
                    value={absenceEndDate}
                    onChange={(e) => setAbsenceEndDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Absence
                </label>
                <select
                  value={absenceReason}
                  onChange={(e) => setAbsenceReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 font-medium"
                >
                  <option value="Illness / Fever">Illness / Flu / Fever</option>
                  <option value="Medical / Dentist Specialist Appointment">Medical / Dentist Specialist Appointment</option>
                  <option value="Family Emergency or Bereavement">Family Emergency or Bereavement</option>
                  <option value="Approved Academic or Sporting Representation">Approved External Provincial Representation</option>
                  <option value="Religious Observance">Religious Observance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Additional Notes for Class Tutor
                </label>
                <textarea
                  rows={3}
                  value={absenceNotes}
                  onChange={(e) => setAbsenceNotes(e.target.value)}
                  placeholder="Provide any relevant recovery context or homework collection requests..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                ></textarea>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700">
                  <input
                    type="checkbox"
                    checked={hasDoctorNote}
                    onChange={(e) => setHasDoctorNote(e.target.checked)}
                    className="rounded text-blue-900"
                  />
                  <span>Attach Doctor's Note / Medical Certificate</span>
                </label>
                <span className="text-[11px] text-slate-400">PDF / Image upload simulated</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
                Submit Official Absence Notice
              </button>
            </form>
          )}
        </div>
      )}

      {/* ---------------- 2. BOOK PARENT-TEACHER INTERVIEWS ---------------- */}
      {subTab === 'interviews' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Book Parent-Teacher Consultations
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Session Date: Friday 23 October 2026 (15:30 - 18:30) · Main Library & Subject Rooms
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INITIAL_TEACHERS.map((teacher) => (
                <div key={teacher.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/50">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {teacher.teacherName}
                    </h3>
                    <p className="text-xs text-blue-900 font-medium mt-0.5">
                      {teacher.subject}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Venue: {teacher.room}
                    </p>

                    <div className="mt-3">
                      <span className="text-[11px] font-semibold text-slate-600 block mb-1.5">
                        Available 15-Min Slots:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {teacher.availableDates[0]?.slots.map((slot) => {
                          const isBooked = bookings.some(
                            (b) => b.teacherName === teacher.teacherName && b.timeSlot === slot
                          );

                          return (
                            <button
                              key={slot}
                              disabled={isBooked}
                              onClick={() => handleBookSlot(teacher, slot)}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                                isBooked
                                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed line-through'
                                  : 'bg-white border border-slate-200 text-slate-700 hover:border-blue-900 hover:text-blue-900 shadow-2xs'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmed Bookings list */}
            {bookings.length > 0 && (
              <div className="mt-6 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                  Your Confirmed Consultations
                </h3>
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-emerald-950">{b.teacherName}</span>
                        <span className="text-emerald-700 ml-2">({b.subject})</span>
                        <div className="text-[11px] text-emerald-600 mt-0.5">
                          Date: {b.date} at <strong className="font-mono">{b.timeSlot}</strong> · Student: {b.childName}
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-800 bg-white px-2.5 py-1 rounded border border-emerald-200">
                        Confirmed
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ---------------- 3. TEACHER MESSAGING ---------------- */}
      {subTab === 'messages' && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-3 min-h-[500px]">
          {/* Threads list */}
          <div className="border-r border-slate-200 bg-slate-50/50 p-3 space-y-2">
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
              Active Educator Dialogues
            </h2>

            {threads.map((thread) => {
              const isActive = thread.id === activeThread.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isActive ? 'bg-white shadow-xs border border-slate-200' : 'hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs">
                      {thread.teacherName}
                    </span>
                    <span className="text-[10px] text-slate-400">{thread.lastTimestamp}</span>
                  </div>
                  <p className="text-[11px] text-blue-900 font-medium mt-0.5">
                    {thread.subject}
                  </p>
                  <p className="text-xs text-slate-500 truncate mt-1">
                    {thread.lastMessage}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 flex flex-col justify-between bg-white">
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeThread.teacherName}
                </h3>
                <p className="text-xs text-slate-500">
                  {activeThread.teacherRole} · Glenview PSDS Verified
                </p>
              </div>
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                Official School Thread
              </span>
            </div>

            {/* Messages Body */}
            <div className="p-4 space-y-3 overflow-y-auto max-h-[360px] flex-1">
              {activeThread.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'parent' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-xl p-3 text-xs leading-relaxed ${
                      m.sender === 'parent'
                        ? 'bg-blue-900 text-white rounded-br-xs'
                        : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {m.timestamp}
                  </span>
                </div>
              ))}
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 flex items-center gap-2 bg-slate-50/50">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message to educator..."
                className="flex-1 px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
              />
              <button
                type="submit"
                className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
