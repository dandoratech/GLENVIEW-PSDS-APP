import React, { useState } from 'react';
import {
  Lock,
  Send,
  Image as ImageIcon,
  Paperclip,
  CheckCircle,
  FileText,
  Search,
  Users,
  ShieldAlert,
  ShieldCheck,
  Download,
  Share2,
  Maximize2,
  BookOpen,
  X,
  AlertCircle,
  Upload,
} from 'lucide-react';
import { SubjectGroup, GroupMessage, UserRole } from '../types';

interface SubjectGroupsTabProps {
  groups: SubjectGroup[];
  userRole: UserRole;
  onSendAdminMessage: (groupId: string, message: GroupMessage) => void;
}

export const SubjectGroupsTab: React.FC<SubjectGroupsTabProps> = ({
  groups,
  userRole,
  onSendAdminMessage,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>('exams');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Admin Compose State
  const [textInput, setTextInput] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [imageCaptionInput, setImageCaptionInput] = useState<string>('');
  const [attachmentNameInput, setAttachmentNameInput] = useState<string>('');
  const [showImagePicker, setShowImagePicker] = useState<boolean>(false);
  const [activeLightboxImage, setActiveLightboxImage] = useState<{ url: string; caption: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const isAdmin = userRole === 'admin';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const sampleImages = [
    {
      url: '/src/assets/images/glenview_science_classroom_1791819371642.jpg',
      label: 'Science Lab / Formula Demonstration',
    },
    {
      url: '/src/assets/images/glenview_school_campus_1791819347316.jpg',
      label: 'Campus Library & Study Hall Schedule',
    },
    {
      url: '/src/assets/images/staff_math_teacher_1791819594861.jpg',
      label: 'Mathematics Olympiad Clinic',
    },
    {
      url: '/src/assets/images/glenview_choir_culture_1791819381644.jpg',
      label: 'Auditorium Arts Rehearsal',
    },
  ];

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      showToast('Action forbidden: Only administrators can post in official subject groups.');
      return;
    }
    if (!textInput.trim() && !imageUrlInput.trim()) {
      showToast('Please enter text or attach an image.');
      return;
    }

    const newMsg: GroupMessage = {
      id: `grp-msg-${Date.now()}`,
      senderName: 'Dr. Eleanor M. Naidoo (Principal & Admin)',
      senderRole: 'School Administration & Subject Directorate',
      text: textInput.trim(),
      timestamp: 'Just now',
      imageUrl: imageUrlInput.trim() || undefined,
      imageCaption: imageCaptionInput.trim() || undefined,
      attachmentName: attachmentNameInput.trim() || undefined,
      isAdminBroadcast: true,
    };

    onSendAdminMessage(selectedGroup.id, newMsg);
    setTextInput('');
    setImageUrlInput('');
    setImageCaptionInput('');
    setAttachmentNameInput('');
    setShowImagePicker(false);
    showToast(`Broadcast posted to ${selectedGroup.name}. All learners and parents notified.`);
  };

  const filteredMessages = selectedGroup.messages.filter((msg) => {
    const q = searchQuery.toLowerCase();
    return (
      msg.text.toLowerCase().includes(q) ||
      msg.senderName.toLowerCase().includes(q) ||
      (msg.attachmentName && msg.attachmentName.toLowerCase().includes(q)) ||
      (msg.imageCaption && msg.imageCaption.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Official Subject Groups
            </h1>
            <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              10 Channels
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Official academic broadcast groups for syllabus notes, revision diagrams, test scopes, and exam answer memorandums.
          </p>
        </div>

        {/* Admin status pill */}
        <div className="flex items-center gap-2 text-xs">
          {isAdmin ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Admin Mode: You have posting permissions</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg font-medium">
              <Lock className="w-4 h-4 text-slate-500" />
              <span>Read-Only Channel ({userRole === 'learner' ? 'Learner GRADE 7' : `${userRole} role`})</span>
            </div>
          )}
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Main Container: Channels Sidebar + Messages Area */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* 10 Groups Channel List (Sidebar) */}
        <div className="lg:col-span-4 border-r border-slate-200 bg-slate-50/50 flex flex-col">
          <div className="p-3.5 border-b border-slate-200 bg-white">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Select Group (1 - 10)
            </span>
            <p className="text-[11px] text-slate-500">
              Tap a subject to view official announcements & memos
            </p>
          </div>

          <div className="divide-y divide-slate-100 overflow-y-auto max-h-[560px] flex-1">
            {groups.map((grp) => {
              const isSelected = grp.id === selectedGroup.id;
              const isExams = grp.id === 'exams';

              return (
                <button
                  key={grp.id}
                  onClick={() => setSelectedGroupId(grp.id)}
                  className={`w-full p-3.5 text-left transition-all flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-900 text-white shadow-xs'
                      : 'hover:bg-slate-100/80 text-slate-800 bg-transparent'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold truncate ${
                        isSelected ? 'text-white' : isExams ? 'text-rose-700 font-extrabold' : 'text-slate-900'
                      }`}>
                        {grp.name}
                      </span>
                      {isExams && (
                        <span className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded ${
                          isSelected ? 'bg-amber-400 text-slate-950' : 'bg-rose-100 text-rose-800'
                        }`}>
                          Answers
                        </span>
                      )}
                    </div>
                    <p className={`text-xs mt-0.5 line-clamp-1 ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}>
                      {grp.adminInCharge}
                    </p>
                    <p className={`text-[11px] mt-1 line-clamp-1 italic ${
                      isSelected ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {grp.messages[grp.messages.length - 1]?.text || 'No broadcasts yet'}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isSelected ? 'bg-blue-950/60 text-blue-200' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {grp.messages.length}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Group Broadcast Thread (Main Panel) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-white">
          {/* Group Header Info */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedGroup.name}
                </h2>
                <span className="text-xs font-mono text-slate-400 font-medium">
                  [{selectedGroup.code}]
                </span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
                  Official School Channel
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">
                {selectedGroup.description}
              </p>
              <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-slate-400 mt-1.5">
                <span>Admin in Charge: <strong className="text-slate-700">{selectedGroup.adminInCharge}</strong> ({selectedGroup.adminRole})</span>
                <span aria-hidden="true">·</span>
                <span>{selectedGroup.subscriberCount} Enrolled Learners & Parents</span>
              </div>
            </div>

            {/* Search within this group */}
            <div className="relative min-w-[200px] shrink-0">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memo & answers..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
              />
            </div>
          </div>

          {/* Messages Stream */}
          <div className="p-4 sm:p-6 space-y-5 overflow-y-auto max-h-[460px] flex-1 bg-slate-50/30">
            {filteredMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p>No broadcast messages matching your search in this group.</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  {/* Sender metadata row */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-900 text-amber-400 font-bold flex items-center justify-center text-xs">
                        GV
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-xs text-slate-900">
                            {msg.senderName}
                          </span>
                          <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-1.5 py-0.2 rounded">
                            Verified Admin
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {msg.senderRole}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {msg.timestamp}
                    </span>
                  </div>

                  {/* Message Text Content */}
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {/* Attached Image (if present, e.g. formulas, test diagram, or answer sheet) */}
                  {msg.imageUrl && (
                    <div className="space-y-1.5 pt-1">
                      <div
                        onClick={() =>
                          setActiveLightboxImage({
                            url: msg.imageUrl!,
                            caption: msg.imageCaption || `${selectedGroup.name} Study Image`,
                          })
                        }
                        className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 cursor-pointer group max-h-72"
                      >
                        <img
                          src={msg.imageUrl}
                          alt={msg.imageCaption || 'Subject Material'}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                          <Maximize2 className="w-4 h-4" />
                          <span>Tap to view full resolution</span>
                        </div>
                      </div>
                      {msg.imageCaption && (
                        <p className="text-[11px] text-slate-500 italic">
                          📷 {msg.imageCaption}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Attached Document / PDF Memo */}
                  {msg.attachmentName && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-rose-600" />
                        <div>
                          <p className="font-semibold text-slate-800">{msg.attachmentName}</p>
                          <span className="text-[10px] text-slate-400">Official Memorandum PDF · Exam Directorate</span>
                        </div>
                      </div>
                      <button
                        onClick={() => showToast(`Downloaded ${msg.attachmentName}`)}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center gap-1 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </button>
                    </div>
                  )}

                  {/* Action strip */}
                  <div className="flex items-center justify-end gap-3 pt-1 text-[11px] text-slate-400 border-t border-slate-100">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(msg.text);
                        showToast('Memo text copied to clipboard.');
                      }}
                      className="hover:text-slate-700 flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" /> Copy Memo
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Posting Controls: STRICT ADMIN-ONLY GATE */}
          <div className="p-4 border-t border-slate-200 bg-white">
            {isAdmin ? (
              /* ADMIN COMPOSER UNLOCKED */
              <form onSubmit={handlePostMessage} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Admin Composer: Post to {selectedGroup.name}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Dispatched to {selectedGroup.subscriberCount} recipients
                  </span>
                </div>

                <textarea
                  rows={2}
                  required={!imageUrlInput}
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={`Write official announcement, study tip, or exam answer memo for ${selectedGroup.name}...`}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 leading-relaxed"
                ></textarea>

                {/* Optional Image / Attachment inputs */}
                {showImagePicker && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Attach Image / Answer Sheet:</span>
                      <button
                        type="button"
                        onClick={() => setShowImagePicker(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="text-[11px] font-medium text-slate-500 block mb-1">
                          Select from School Image Library:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {sampleImages.map((s, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                setImageUrlInput(s.url);
                                setImageCaptionInput(s.label);
                              }}
                              className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                                imageUrlInput === s.url
                                  ? 'border-blue-900 bg-blue-50 text-blue-900 font-semibold'
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              <img src={s.url} alt="" className="w-8 h-8 rounded object-cover" />
                              <span className="text-[10px] truncate">{s.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Or Image URL / Path:</label>
                          <input
                            type="text"
                            value={imageUrlInput}
                            onChange={(e) => setImageUrlInput(e.target.value)}
                            placeholder="/src/assets/images/... or https://..."
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-500 block mb-0.5">Image Caption:</label>
                          <input
                            type="text"
                            value={imageCaptionInput}
                            onChange={(e) => setImageCaptionInput(e.target.value)}
                            placeholder="e.g. Question 2 Worked Solution Diagram"
                            className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] text-slate-500 block mb-0.5">Attach Official PDF Name (Optional):</label>
                        <input
                          type="text"
                          value={attachmentNameInput}
                          onChange={(e) => setAttachmentNameInput(e.target.value)}
                          placeholder="e.g. Term4_Mathematics_Paper2_Marking_Guidelines.pdf"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(!showImagePicker)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border flex items-center gap-1.5 transition-colors ${
                        showImagePicker || imageUrlInput
                          ? 'bg-blue-50 border-blue-200 text-blue-900 font-semibold'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>{imageUrlInput ? 'Image Attached' : 'Attach Image / Memo'}</span>
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Broadcast</span>
                  </button>
                </div>
              </form>
            ) : (
              /* NON-ADMIN LOCKED BAR WITH EXPLICIT PERMISSION NOTICE */
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      Broadcast Channel: Admin Only
                    </span>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Only school administrators and subject heads can post images, texts, and answer keys in this group. Learners and parents have read-only access.
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] text-slate-400 block">
                    Logged in as: <strong className="capitalize text-slate-600">{userRole === 'learner' ? 'Learner GRADE 7' : userRole}</strong>
                  </span>
                  <span className="text-[10px] text-blue-900 font-medium">
                    (Switch role to "Admin" above to post)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for viewing memo diagrams & answer keys */}
      {activeLightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-3">
            <div className="relative aspect-16/10 max-h-[75vh] bg-black">
              <img
                src={activeLightboxImage.url}
                alt={activeLightboxImage.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActiveLightboxImage(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-md"
              >
                ✕
              </button>
            </div>

            <div className="p-4 text-white flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{activeLightboxImage.caption}</h3>
                <span className="text-[11px] text-slate-400">{selectedGroup.name} Official Study Image</span>
              </div>
              <button
                onClick={() => {
                  showToast('Downloaded full-resolution memo image.');
                  setActiveLightboxImage(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Save Image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
