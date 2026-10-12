import React from 'react';
import { ShieldCheck, Smartphone, Monitor, Bell } from 'lucide-react';
import { UserRole } from '../types';

interface TopNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  unreadCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  activeTab,
  setActiveTab,
  userRole,
  setUserRole,
  viewMode,
  setViewMode,
  unreadCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 py-3.5">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-900 text-amber-400 font-bold flex items-center justify-center text-sm tracking-wider shadow-sm">
            GV
          </div>
          <button
            onClick={() => setActiveTab('communication')}
            className="text-left font-bold text-slate-900 text-lg tracking-tight hover:text-blue-900 transition-colors whitespace-nowrap shrink-0"
          >
            GLENVIEW PSDS
          </button>
        </div>

        {/* Zone 2: 4-5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('communication')}
            className={`transition-colors whitespace-nowrap shrink-0 relative ${
              activeTab === 'communication'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Notices
            {unreadCount > 0 && (
              <span className="ml-1 text-[11px] font-bold text-amber-600">
                ({unreadCount})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'portal'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Parent Portal
          </button>

          <button
            onClick={() => setActiveTab('groups')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'groups'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Subject Groups
          </button>

          <button
            onClick={() => setActiveTab('library')}
            className={`transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'library'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Digital Library
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'directory'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Staff Directory
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'calendar'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Calendar
          </button>

          <button
            onClick={() => setActiveTab('academics')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'academics'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Academics
          </button>

          <button
            onClick={() => setActiveTab('cashless')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'cashless'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            Fees & Tuck Shop
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'gallery'
                ? 'text-blue-900 font-semibold underline underline-offset-8 decoration-2 decoration-blue-900'
                : 'hover:text-slate-900'
            }`}
          >
            School Life
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action Area */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Device Toggle */}
          <button
            onClick={() => setViewMode(viewMode === 'desktop' ? 'mobile' : 'desktop')}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            title="Toggle between Desktop Dashboard and Smartphone Simulator"
          >
            {viewMode === 'desktop' ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden lg:inline">Phone Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden lg:inline">Full Screen</span>
              </>
            )}
          </button>

          {/* Role selector */}
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 text-xs font-medium">
            <span className="px-2 py-1 text-slate-400 border-r border-slate-200 hidden sm:inline">Role:</span>
            <select
              value={userRole}
              aria-label="Select User Role"
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="bg-transparent px-2 py-1.5 text-slate-800 font-medium focus:outline-none cursor-pointer"
            >
              <option value="parent">Parent</option>
              <option value="learner">Learner GRADE 7</option>
              <option value="teacher">Teacher (Mr. Botha)</option>
              <option value="admin">School Admin (Principal)</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
