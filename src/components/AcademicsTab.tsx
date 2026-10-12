import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Upload,
  ArrowUpRight,
  TrendingUp,
  Award,
} from 'lucide-react';
import { HomeworkItem, AssessmentItem } from '../types';
import { INITIAL_HOMEWORK, INITIAL_ASSESSMENTS, TIMETABLE_GRADE_10 } from '../data/mockData';

export const AcademicsTab: React.FC = () => {
  const [academicSubTab, setAcademicSubTab] = useState<'homework' | 'timetable' | 'assessments'>('homework');
  const [homeworkList, setHomeworkList] = useState<HomeworkItem[]>(INITIAL_HOMEWORK);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [submittingHwId, setSubmittingHwId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUploadHomework = (id: string) => {
    setHomeworkList((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: 'submitted', gradeScore: 'Submitted - Pending Educator Review' }
          : item
      )
    );
    setSubmittingHwId(null);
    showToast('Assignment submitted successfully to Mr. Botha\'s portal.');
  };

  const filteredHomework = homeworkList.filter((item) => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Academics at Your Fingertips
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Live homework submissions, weekly class timetables, cycle test scopes, and academic assessment milestones.
          </p>
        </div>

        {/* Sub-tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto">
          <button
            onClick={() => setAcademicSubTab('homework')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              academicSubTab === 'homework'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Homework & Tasks ({homeworkList.filter((h) => h.status === 'pending').length} Due)
          </button>
          <button
            onClick={() => setAcademicSubTab('timetable')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              academicSubTab === 'timetable'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Timetable
          </button>
          <button
            onClick={() => setAcademicSubTab('assessments')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              academicSubTab === 'assessments'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cycle Tests & Scope
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* ---------------- 1. HOMEWORK & ASSIGNMENTS ---------------- */}
      {academicSubTab === 'homework' && (
        <div className="space-y-4">
          {/* Status filter tabs */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Filter Tasks:</span>
            {['all', 'pending', 'submitted', 'graded'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-md font-medium capitalize transition-colors ${
                  filterStatus === status
                    ? 'bg-blue-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredHomework.map((hw) => (
              <div
                key={hw.id}
                className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {hw.subject}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">Assigned by {hw.assignedBy}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-amber-700 font-medium">Due: {hw.dueDate}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      hw.status === 'graded'
                        ? 'bg-emerald-50 text-emerald-800'
                        : hw.status === 'submitted'
                        ? 'bg-blue-50 text-blue-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {hw.status}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900">
                    {hw.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                    {hw.instructions}
                  </p>

                  {hw.gradeScore && (
                    <div className="mt-2 text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Result: {hw.gradeScore}</span>
                    </div>
                  )}
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  {hw.status === 'pending' ? (
                    <button
                      onClick={() => setSubmittingHwId(hw.id)}
                      className="px-3.5 py-2 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Submit Work
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 2. TIMETABLE ---------------- */}
      {academicSubTab === 'timetable' && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Grade 10A Official Master Timetable (Term 4)
              </h2>
              <span className="text-xs text-slate-500">
                Class Tutor: Mr. D. Botha · Form Room: Lab B-104
              </span>
            </div>
            <span className="text-xs font-mono bg-blue-50 text-blue-900 px-2.5 py-1 rounded font-medium">
              Bell Schedule: 08:00 - 14:30
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 pr-3">Period</th>
                  <th className="py-2.5 px-3">Monday</th>
                  <th className="py-2.5 px-3">Tuesday</th>
                  <th className="py-2.5 px-3">Wednesday</th>
                  <th className="py-2.5 px-3">Thursday</th>
                  <th className="py-2.5 px-3">Friday</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TIMETABLE_GRADE_10.map((row, idx) => (
                  <tr key={idx} className={row.period.includes('Break') ? 'bg-amber-50/40 font-medium' : 'hover:bg-slate-50/70'}>
                    <td className="py-3 pr-3 font-semibold text-slate-800 whitespace-nowrap">
                      {row.period}
                    </td>
                    <td className="py-3 px-3 text-slate-700">{row.mon}</td>
                    <td className="py-3 px-3 text-slate-700">{row.tue}</td>
                    <td className="py-3 px-3 text-slate-700">{row.wed}</td>
                    <td className="py-3 px-3 text-slate-700">{row.thu}</td>
                    <td className="py-3 px-3 text-slate-700">{row.fri}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------- 3. ASSESSMENTS & SCOPE ---------------- */}
      {academicSubTab === 'assessments' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {INITIAL_ASSESSMENTS.map((ass) => (
              <div key={ass.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      {ass.subject}
                    </span>
                    <span className="font-mono text-slate-400">{ass.date}</span>
                  </div>

                  <h2 className="text-base font-bold text-slate-900 mt-2">
                    {ass.title}
                  </h2>

                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Venue: {ass.venue}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-700 font-semibold">{ass.weight}</span>
                  </div>

                  <div className="mt-3 p-3 bg-slate-50 border border-slate-100 rounded-lg text-xs">
                    <span className="font-semibold text-slate-700 block mb-1">Prescribed Scope:</span>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{ass.scope}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => showToast(`Study guide downloaded for ${ass.subject}`)}
                    className="w-full py-2 px-3 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    Download Study Scope & Past Papers
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {submittingHwId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Submit Assignment Solution
            </h3>
            <p className="text-xs text-slate-500">
              Attach handwritten working diagrams or typed PDF document for teacher review.
            </p>

            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-900 cursor-pointer transition-colors bg-slate-50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">Click to upload solution file</p>
              <p className="text-[10px] text-slate-400 mt-0.5">PDF, DOCX, or High-Res Photo (Max 25MB)</p>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <span className="font-semibold">Sample Selected:</span>
              <p className="font-mono text-[11px] bg-slate-100 p-2 rounded">
                Sipho_Khumalo_Newton_Laws_Exercise_4.2.pdf (1.4 MB)
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setSubmittingHwId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUploadHomework(submittingHwId)}
                className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1.5 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
