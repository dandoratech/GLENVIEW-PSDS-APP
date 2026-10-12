import React, { useState } from 'react';
import {
  Bell,
  Wifi,
  WifiOff,
  AlertTriangle,
  FileText,
  Trophy,
  BookOpen,
  Search,
  CheckCircle2,
  Download,
  Share2,
  Calendar,
  Send,
  PlusCircle,
  Eye,
} from 'lucide-react';
import { Circular, UserRole } from '../types';

interface CommunicationTabProps {
  circulars: Circular[];
  onMarkRead: (id: string) => void;
  userRole: UserRole;
  onOpenBroadcastModal: () => void;
}

export const CommunicationTab: React.FC<CommunicationTabProps> = ({
  circulars,
  onMarkRead,
  userRole,
  onOpenBroadcastModal,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [offlineMode, setOfflineMode] = useState<boolean>(false);
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredCirculars = circulars.filter((item) => {
    const matchesCategory =
      activeCategory === 'all' ||
      (activeCategory === 'urgent' && item.urgent) ||
      item.category === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesOffline = !offlineMode || item.offlineCached;

    return matchesCategory && matchesSearch && matchesOffline;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Offline Mode Banner & Live Sync Status */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        offlineMode
          ? 'bg-amber-50 border-amber-200 text-amber-900'
          : 'bg-white border-slate-200 text-slate-800'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
            offlineMode ? 'bg-amber-200 text-amber-800' : 'bg-blue-50 text-blue-900'
          }`}>
            {offlineMode ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold">
                {offlineMode ? 'Offline Cached Mode Active' : 'Live Sync Connected'}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                {offlineMode ? 'Local Cache Only' : 'Real-Time'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {offlineMode
                ? 'No data? No problem! All critical circulars, emergency contacts, and schedules are saved offline.'
                : 'All latest circulars, timetables, and notices are synchronized.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {userRole === 'admin' && (
            <button
              onClick={onOpenBroadcastModal}
              className="px-3.5 py-1.5 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Broadcast
            </button>
          )}

          <button
            onClick={() => {
              setOfflineMode(!offlineMode);
              showToast(offlineMode ? 'Live data connection restored.' : 'Offline mode enabled. Reading from local cache.');
            }}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              offlineMode
                ? 'bg-amber-600 text-white border-amber-600'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {offlineMode ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span>{offlineMode ? 'Go Online' : 'Simulate Offline'}</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Urgent Emergency Alert Banner if any unread urgent */}
      {circulars.some((c) => c.urgent && !c.read) && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-rose-900">
                Official School Alert
              </h2>
              <span className="text-[10px] text-rose-600 font-medium">Urgent</span>
            </div>
            <p className="text-xs text-rose-800 mt-1 font-medium">
              Early dismissal this Friday at 12:45 PM for district curriculum moderation. Scholar transport notified.
            </p>
          </div>
          <button
            onClick={() => {
              const urgentCirc = circulars.find((c) => c.urgent);
              if (urgentCirc) setSelectedCircular(urgentCirc);
            }}
            className="px-3 py-1 text-xs font-semibold bg-rose-600 text-white rounded-md hover:bg-rose-700 transition-colors shrink-0"
          >
            Read Notice
          </button>
        </div>
      )}

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Notices ({circulars.length})
          </button>
          <button
            onClick={() => setActiveCategory('urgent')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'urgent'
                ? 'bg-white text-rose-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Urgent Alerts
          </button>
          <button
            onClick={() => setActiveCategory('circular')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'circular'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Circulars
          </button>
          <button
            onClick={() => setActiveCategory('academic')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'academic'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic
          </button>
          <button
            onClick={() => setActiveCategory('sports')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              activeCategory === 'sports'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sports & Fixtures
          </button>
        </div>

        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search circulars..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
          />
        </div>
      </div>

      {/* Circulars List */}
      <div className="space-y-3">
        {filteredCirculars.map((circular) => (
          <div
            key={circular.id}
            onClick={() => {
              setSelectedCircular(circular);
              if (!circular.read) onMarkRead(circular.id);
            }}
            className={`bg-white border rounded-xl p-4 sm:p-5 cursor-pointer transition-all hover:border-slate-300 hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              !circular.read ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200'
            }`}
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] text-slate-400">
                  {circular.referenceNumber}
                </span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs text-slate-500">{circular.date}</span>
                <span aria-hidden="true" className="text-slate-300">·</span>
                <span className="text-xs text-slate-600 font-medium">{circular.sender}</span>
                {circular.urgent && (
                  <span className="text-[10px] font-bold text-rose-700 uppercase bg-rose-50 px-2 py-0.5 rounded">
                    Urgent Alert
                  </span>
                )}
                {!circular.read && (
                  <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                    New
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-900 leading-snug">
                {circular.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {circular.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {circular.attachmentName && (
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  PDF Attachment
                </span>
              )}
              <button className="px-3 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors">
                <Eye className="w-3.5 h-3.5" />
                View Notice
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Circular Reader Modal */}
      {selectedCircular && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-slate-200 space-y-5">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <span className="font-mono text-xs text-slate-400">
                  {selectedCircular.referenceNumber}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedCircular.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                  <span>Issued: {selectedCircular.date}</span>
                  <span aria-hidden="true">·</span>
                  <span>From: {selectedCircular.sender}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedCircular(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {/* School Letterhead Preview */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded bg-blue-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                    GV
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">GLENVIEW PSDS</h4>
                    <span className="text-[10px] text-slate-400">Excellence · Integrity · Ubuntu</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">OFFICIAL COMMUNIQUÉ</span>
              </div>

              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {selectedCircular.content}
              </div>

              {selectedCircular.attachmentName && (
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 text-xs">
                    <FileText className="w-4 h-4 text-blue-900" />
                    <div>
                      <p className="font-medium text-slate-800">{selectedCircular.attachmentName}</p>
                      <span className="text-[10px] text-slate-400">Official PDF · 480 KB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${selectedCircular.attachmentName}`)}
                    className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText?.(window.location.href);
                  showToast('Notice share link copied to clipboard.');
                }}
                className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5" />
                Share Notice
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCircular(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    window.print?.();
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
