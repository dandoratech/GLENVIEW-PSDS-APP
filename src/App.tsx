/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Calendar as CalendarIcon,
  BookOpen,
  Users,
  ShieldCheck,
  CreditCard,
  Camera,
  MessageSquare,
  Smartphone,
  Monitor,
  Wifi,
  Sparkles,
  PhoneCall,
  Info,
} from 'lucide-react';
import { UserRole, Circular, Child, CalendarEvent, SubjectGroup, GroupMessage, DigitalBook } from './types';
import {
  INITIAL_CIRCULARS,
  INITIAL_CHILDREN,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_SUBJECT_GROUPS,
  INITIAL_DIGITAL_BOOKS,
} from './data/mockData';
import { TopNav } from './components/TopNav';
import { StaffDirectory } from './components/StaffDirectory';
import { ParentPortal } from './components/ParentPortal';
import { CommunicationTab } from './components/CommunicationTab';
import { CalendarTab } from './components/CalendarTab';
import { AcademicsTab } from './components/AcademicsTab';
import { TwoWayTab } from './components/TwoWayTab';
import { CashlessTab } from './components/CashlessTab';
import { SchoolLifeTab } from './components/SchoolLifeTab';
import { SubjectGroupsTab } from './components/SubjectGroupsTab';
import { DigitalLibraryTab } from './components/DigitalLibraryTab';
import { FeePaymentModal } from './components/FeePaymentModal';
import { AdminBroadcastModal } from './components/AdminBroadcastModal';
import { MobileBottomBar } from './components/MobileBottomBar';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('library');
  const [userRole, setUserRole] = useState<UserRole>('parent');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Application Data States
  const [circulars, setCirculars] = useState<Circular[]>(INITIAL_CIRCULARS);
  const [childrenList, setChildrenList] = useState<Child[]>(INITIAL_CHILDREN);
  const [selectedChildId, setSelectedChildId] = useState<string>('child-1');
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(INITIAL_CALENDAR_EVENTS);
  const [subjectGroups, setSubjectGroups] = useState<SubjectGroup[]>(INITIAL_SUBJECT_GROUPS);
  const [digitalBooks, setDigitalBooks] = useState<DigitalBook[]>(INITIAL_DIGITAL_BOOKS);

  // Modals & Interactivity
  const [isFeeModalOpen, setIsFeeModalOpen] = useState<boolean>(false);
  const [isAdminBroadcastOpen, setIsAdminBroadcastOpen] = useState<boolean>(false);
  const [preselectedTeacher, setPreselectedTeacher] = useState<string | null>(null);
  const [twoWayDefaultSubTab, setTwoWayDefaultSubTab] = useState<'absence' | 'interviews' | 'messages'>('absence');

  const unreadCircularsCount = circulars.filter((c) => !c.read).length;

  const handleToggleBookmark = (bookId: string) => {
    setDigitalBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isBookmarked: !b.isBookmarked } : b))
    );
  };

  const handleToggleDownload = (bookId: string) => {
    setDigitalBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isDownloaded: !b.isDownloaded } : b))
    );
  };

  const handleSendAdminGroupMessage = (groupId: string, message: GroupMessage) => {
    setSubjectGroups((prev) =>
      prev.map((grp) =>
        grp.id === groupId
          ? { ...grp, messages: [...grp.messages, message] }
          : grp
      )
    );
  };

  const handleMarkCircularRead = (id: string) => {
    setCirculars((prev) =>
      prev.map((c) => (c.id === id ? { ...c, read: true } : c))
    );
  };

  const handleToggleEventReminder = (id: string) => {
    setCalendarEvents((prev) =>
      prev.map((ev) =>
        ev.id === id ? { ...ev, reminderSet: !ev.reminderSet } : ev
      )
    );
  };

  const handlePublishBroadcast = (newCirc: Circular) => {
    setCirculars((prev) => [newCirc, ...prev]);
  };

  const handlePaymentSuccess = (amount: number) => {
    // Deduct from child's fee balance
    setChildrenList((prev) =>
      prev.map((child) =>
        child.id === selectedChildId
          ? { ...child, walletBalance: child.walletBalance }
          : child
      )
    );
  };

  const handleStartMessageFromDirectory = (teacherName: string, subject: string) => {
    setPreselectedTeacher(teacherName);
    setTwoWayDefaultSubTab('messages');
    setActiveTab('twoway');
  };

  const handleBookInterviewFromDirectory = (teacherName: string, subject: string) => {
    setPreselectedTeacher(teacherName);
    setTwoWayDefaultSubTab('interviews');
    setActiveTab('twoway');
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case 'portal':
        return (
          <ParentPortal
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
            onReportAbsenceClick={() => {
              setTwoWayDefaultSubTab('absence');
              setActiveTab('twoway');
            }}
            onOpenPaymentModal={() => setIsFeeModalOpen(true)}
          />
        );
      case 'groups':
        return (
          <SubjectGroupsTab
            groups={subjectGroups}
            userRole={userRole}
            onSendAdminMessage={handleSendAdminGroupMessage}
          />
        );
      case 'library':
        return (
          <DigitalLibraryTab
            books={digitalBooks}
            onToggleBookmark={handleToggleBookmark}
            onToggleDownload={handleToggleDownload}
          />
        );
      case 'directory':
        return (
          <StaffDirectory
            onStartMessage={handleStartMessageFromDirectory}
            onBookInterview={handleBookInterviewFromDirectory}
          />
        );
      case 'communication':
        return (
          <CommunicationTab
            circulars={circulars}
            onMarkRead={handleMarkCircularRead}
            userRole={userRole}
            onOpenBroadcastModal={() => setIsAdminBroadcastOpen(true)}
          />
        );
      case 'calendar':
        return (
          <CalendarTab
            events={calendarEvents}
            onToggleReminder={handleToggleEventReminder}
          />
        );
      case 'academics':
        return <AcademicsTab />;
      case 'twoway':
        return (
          <TwoWayTab
            childrenList={childrenList}
            preselectedTeacher={preselectedTeacher}
            onClearPreselectedTeacher={() => setPreselectedTeacher(null)}
            defaultSubTab={twoWayDefaultSubTab}
          />
        );
      case 'cashless':
        return (
          <CashlessTab
            onOpenFeePaymentModal={() => setIsFeeModalOpen(true)}
          />
        );
      case 'gallery':
        return <SchoolLifeTab />;
      default:
        return (
          <ParentPortal
            childrenList={childrenList}
            selectedChildId={selectedChildId}
            onSelectChild={setSelectedChildId}
            onReportAbsenceClick={() => {
              setTwoWayDefaultSubTab('absence');
              setActiveTab('twoway');
            }}
            onOpenPaymentModal={() => setIsFeeModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-900 selection:text-white">
      {/* Top Bar adhering strictly to 1-line 3-zone contract */}
      <TopNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        viewMode={viewMode}
        setViewMode={setViewMode}
        unreadCount={unreadCircularsCount}
      />

      {/* Main View Area */}
      {viewMode === 'desktop' ? (
        /* Full Desktop / Tablet Layout */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
          {renderActiveTabContent()}
        </main>
      ) : (
        /* Smartphone Simulation Frame for authentic mobile evaluation */
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center">
          <div className="w-full max-w-[420px] bg-slate-900 p-3.5 rounded-[48px] shadow-2xl border-4 border-slate-800">
            {/* Phone Bezel & Dynamic Island */}
            <div className="bg-slate-950 text-white rounded-[38px] overflow-hidden flex flex-col h-[780px] relative border border-slate-800">
              {/* Status Bar */}
              <div className="px-6 pt-3 pb-2 flex items-center justify-between text-xs text-slate-300 select-none shrink-0 bg-slate-950">
                <span className="font-semibold text-[11px] font-mono">08:35</span>
                <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-slate-800"></div>
                </div>
                <div className="flex items-center gap-1.5 text-[11px]">
                  <Wifi className="w-3 h-3" />
                  <span className="font-mono text-[10px]">5G</span>
                </div>
              </div>

              {/* In-Frame App Header */}
              <div className="px-4 py-2 bg-blue-950 border-b border-blue-900 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-amber-400 text-blue-950 font-bold flex items-center justify-center text-[10px]">
                    GV
                  </div>
                  <span className="font-bold text-xs text-white">GLENVIEW PSDS</span>
                </div>
                <span className="text-[10px] text-amber-300 font-medium capitalize">
                  {userRole === 'learner' ? 'Learner GRADE 7' : `${userRole} view`}
                </span>
              </div>

              {/* Scrollable Mobile Content */}
              <div className="flex-1 overflow-y-auto p-3.5 bg-slate-50 text-slate-900 pb-20">
                {renderActiveTabContent()}
              </div>

              {/* In-Frame Mobile Bottom Bar */}
              <div className="absolute bottom-0 left-0 right-0">
                <MobileBottomBar
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  unreadCount={unreadCircularsCount}
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4 text-center">
            Smartphone Preview Mode active · Toggle 'Full Screen' in the top bar anytime.
          </p>
        </main>
      )}

      {/* Global Mobile Bottom Navigation for actual mobile viewports */}
      {viewMode === 'desktop' && (
        <MobileBottomBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          unreadCount={unreadCircularsCount}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-900 text-amber-400 font-bold flex items-center justify-center text-[9px]">
              GV
            </div>
            <span>© 2026 Glenview Public Secondary School · EMIS: 7001429</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-400">Paperless School App v3.2</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">92% Paper Reduction</span>
            <span>·</span>
            <span className="text-slate-500 flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-slate-400" /> Helpline: +27 11 555 4000
            </span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <FeePaymentModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <AdminBroadcastModal
        isOpen={isAdminBroadcastOpen}
        onClose={() => setIsAdminBroadcastOpen(false)}
        onPublishBroadcast={handlePublishBroadcast}
      />
    </div>
  );
}
