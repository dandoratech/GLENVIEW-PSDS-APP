import React, { useState } from 'react';
import { Send, AlertTriangle, FileText, Bell, CheckCircle } from 'lucide-react';
import { Circular } from '../types';

interface AdminBroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishBroadcast: (circular: Circular) => void;
}

export const AdminBroadcastModal: React.FC<AdminBroadcastModalProps> = ({
  isOpen,
  onClose,
  onPublishBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'urgent' | 'circular' | 'sports' | 'academic' | 'general'>('urgent');
  const [urgent, setUrgent] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newCirc: Circular = {
      id: `circ-${Date.now()}`,
      title,
      summary: summary || title,
      content,
      category,
      urgent,
      date: new Date().toISOString().split('T')[0],
      sender: 'Dr. M. Naidoo (Principal)',
      read: false,
      referenceNumber: `CIR-2026/${Math.floor(100 + Math.random() * 900)}`,
      attachmentName: 'Official_Notice.pdf',
      offlineCached: true,
    };

    onPublishBroadcast(newCirc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-xs">
              GV
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Publish School Broadcast
              </h3>
              <p className="text-[11px] text-slate-400">Principal & Management Console</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Broadcast Title / Subject Line
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Urgent: Road Closure & Alternate Gate Access"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 text-xs"
              >
                <option value="urgent">Urgent School Alert</option>
                <option value="circular">Official SGB Circular</option>
                <option value="academic">Academic & Examinations</option>
                <option value="sports">Sports & Derby Fixtures</option>
                <option value="general">General Notice</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={urgent}
                  onChange={(e) => setUrgent(e.target.checked)}
                  className="rounded text-rose-600"
                />
                <span>Trigger High-Priority Push Notification</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Brief Summary (For mobile notification preview)
            </label>
            <input
              type="text"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-sentence takeaway for lock screen notifications..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 text-xs"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Full Circular Content (Formal Communiqué)
            </label>
            <textarea
              rows={4}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Draft official school communiqué with instructions, dates, and sign-off..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 text-xs leading-relaxed"
            ></textarea>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900 text-[11px]">
            ⚡ Instant delivery to 1,420 registered parents and 940 active learner profiles.
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              Dispatch Broadcast Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
