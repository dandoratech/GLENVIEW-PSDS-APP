import React, { useState } from 'react';
import {
  Lock,
  Shield,
  ShieldCheck,
  User,
  KeyRound,
  Eye,
  EyeOff,
  Clock,
  Download,
  CreditCard,
  Calendar,
  AlertCircle,
  CheckCircle,
  FileText,
  Fingerprint,
  LogOut,
  ChevronRight,
  TrendingUp,
  Receipt,
  FileCheck,
  Smartphone,
  ExternalLink,
} from 'lucide-react';
import { Child, ReportCard, AbsenceRecord, FeeTransaction, ConsentSlip } from '../types';
import { REPORT_CARD_SIPHO, INITIAL_ABSENCES, INITIAL_TRANSACTIONS, INITIAL_CONSENT_SLIPS } from '../data/mockData';

interface ParentPortalProps {
  childrenList: Child[];
  selectedChildId: string;
  onSelectChild: (childId: string) => void;
  onReportAbsenceClick: () => void;
  onOpenPaymentModal: () => void;
}

export const ParentPortal: React.FC<ParentPortalProps> = ({
  childrenList,
  selectedChildId,
  onSelectChild,
  onReportAbsenceClick,
  onOpenPaymentModal,
}) => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [require2FA, setRequire2FA] = useState<boolean>(false);
  const [twoFactorCode, setTwoFactorCode] = useState<string>('');
  const [familyIdInput, setFamilyIdInput] = useState<string>('FAM-GV-8821');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [privacyMask, setPrivacyMask] = useState<boolean>(false);
  const [portalTab, setPortalTab] = useState<'reports' | 'attendance' | 'fees' | 'events'>('reports');
  const [downloadModal, setDownloadModal] = useState<string | null>(null);
  const [signedSlips, setSignedSlips] = useState<ConsentSlip[]>(INITIAL_CONSENT_SLIPS);
  const [signingSlipId, setSigningSlipId] = useState<string | null>(null);
  const [consentSuccessToast, setConsentSuccessToast] = useState<string | null>(null);

  const activeChild = childrenList.find((c) => c.id === selectedChildId) || childrenList[0];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!require2FA) {
      setRequire2FA(true);
    } else {
      setIsAuthenticated(true);
      setRequire2FA(false);
    }
  };

  const handleBiometricLogin = () => {
    setIsAuthenticated(true);
    setRequire2FA(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRequire2FA(false);
  };

  const handleSignConsent = (slipId: string) => {
    setSignedSlips((prev) =>
      prev.map((slip) =>
        slip.id === slipId
          ? {
              ...slip,
              isSigned: true,
              signedBy: 'Mrs. Lerato Khumalo',
              signedAt: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              emergencyContact: '+27 82 555 0192',
            }
          : slip
      )
    );
    setSigningSlipId(null);
    setConsentSuccessToast('Digital consent signed and cryptographically verified.');
    setTimeout(() => setConsentSuccessToast(null), 3500);
  };

  /* ----------------- LOGIN / AUTHENTICATION GATE ----------------- */
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-blue-900 text-amber-400 mx-auto flex items-center justify-center shadow-xs">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Secure Parent Portal
          </h1>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Protected access to academic results, official report cards, attendance logs, and financial records for Glenview PSDS parents.
          </p>
        </div>

        {!require2FA ? (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Family Identifier or Parent Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={familyIdInput}
                  onChange={(e) => setFamilyIdInput(e.target.value)}
                  placeholder="e.g. FAM-GV-8821 or name@email.com"
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portal Password / Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-900" />
                <span>Remember this device</span>
              </label>
              <span className="text-blue-900 font-medium cursor-pointer hover:underline">
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Lock className="w-4 h-4" />
              Sign In to Parent Portal
            </button>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleBiometricLogin}
                className="w-full py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Fingerprint className="w-4 h-4 text-emerald-600" />
                Quick Unlock with Biometrics (TouchID / FaceID)
              </button>
            </div>
          </form>
        ) : (
          /* 2FA Verification Screen */
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-900">
              <p className="font-semibold">Two-Factor Authentication Required</p>
              <p className="text-blue-700 mt-0.5">
                A 6-digit one-time verification passcode was dispatched to registered mobile ending in <span className="font-mono font-bold">...0192</span>.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Enter Verification Code (Demo: 884 219)
              </label>
              <input
                type="text"
                autoFocus
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                placeholder="884219"
                className="w-full text-center tracking-widest text-lg font-mono py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Verify & Authorize Session
            </button>

            <button
              type="button"
              onClick={() => setRequire2FA(false)}
              className="w-full text-xs text-slate-500 hover:text-slate-800 text-center"
            >
              Back to credentials login
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>256-Bit SSL · Strict POPIA & Student Record Protection</span>
        </div>
      </div>
    );
  }

  /* ----------------- AUTHENTICATED SECURE DASHBOARD ----------------- */
  return (
    <div className="space-y-6">
      {/* Security Status Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900">
                  Parent Portal: Mrs. Lerato Khumalo
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-0.5">
                <span>Family ID: <strong className="text-slate-700 font-mono">FAM-GV-8821</strong></span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium">Session Encrypted</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3 h-3" /> Auto-lock: 14m
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {/* Privacy Mask Toggle */}
            <button
              onClick={() => setPrivacyMask(!privacyMask)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Mask financial balances and marks when in public"
            >
              {privacyMask ? (
                <>
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>Show Numbers</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Mask Data</span>
                </>
              )}
            </button>

            {/* Lock / Logout */}
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Children Switcher Strip */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-400 shrink-0">
            Select Child:
          </span>
          {childrenList.map((child) => {
            const isSelected = child.id === activeChild.id;
            return (
              <button
                key={child.id}
                onClick={() => onSelectChild(child.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                  isSelected ? 'bg-amber-400 text-blue-950' : 'bg-slate-300 text-slate-700'
                }`}>
                  {child.avatar}
                </span>
                <span>{child.name}</span>
                <span className={`text-[11px] ${isSelected ? 'text-blue-200' : 'text-slate-400'}`}>
                  ({child.grade})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {consentSuccessToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {consentSuccessToast}
        </div>
      )}

      {/* Child Summary KPI Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400">Class & Tutor</span>
          <p className="text-sm font-bold text-slate-800 mt-1">{activeChild.grade} ({activeChild.classGroup})</p>
          <span className="text-[11px] text-slate-500">Mr. D. Botha</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400">Attendance Rate</span>
          <p className="text-sm font-bold text-emerald-700 mt-1 tabular-nums">
            {privacyMask ? '•••%' : `${activeChild.attendanceRate}%`}
          </p>
          <span className="text-[11px] text-slate-500">61 of 62 days recorded</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400">Term 3 Average</span>
          <p className="text-sm font-bold text-blue-900 mt-1 tabular-nums">
            {privacyMask ? '•••%' : `${REPORT_CARD_SIPHO.overallAverage}%`}
          </p>
          <span className="text-[11px] text-slate-500">{REPORT_CARD_SIPHO.positionInGrade}</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-medium text-slate-400">School Fee Account</span>
          <p className="text-sm font-bold text-slate-800 mt-1 tabular-nums">
            {privacyMask ? '$••••' : '$395.00'}
          </p>
          <span className="text-[11px] text-amber-600 font-medium">Due: 31 October 2026</span>
        </div>
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
        <button
          onClick={() => setPortalTab('reports')}
          className={`flex-1 min-w-[120px] px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            portalTab === 'reports'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Academic Reports
        </button>

        <button
          onClick={() => setPortalTab('attendance')}
          className={`flex-1 min-w-[120px] px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            portalTab === 'attendance'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          Attendance Records
        </button>

        <button
          onClick={() => setPortalTab('fees')}
          className={`flex-1 min-w-[120px] px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            portalTab === 'fees'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          Fee Statements
        </button>

        <button
          onClick={() => setPortalTab('events')}
          className={`flex-1 min-w-[120px] px-3 py-2 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center justify-center gap-1.5 ${
            portalTab === 'events'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Upcoming Events & Outings
        </button>
      </div>

      {/* ---------------- 1. ACADEMIC REPORTS ---------------- */}
      {portalTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {REPORT_CARD_SIPHO.term} Official Academic Assessment
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>Student ID: <strong className="font-mono text-slate-700">{activeChild.studentNumber}</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Grade Rank: {REPORT_CARD_SIPHO.positionInGrade}</span>
                </div>
              </div>

              <button
                onClick={() => setDownloadModal('report')}
                className="self-start sm:self-auto px-3.5 py-2 text-xs font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                Download Official Signed PDF
              </button>
            </div>

            {/* Subject Table */}
            <div className="overflow-x-auto mt-4">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 pr-4">Subject</th>
                    <th className="py-2.5 px-3">Educator</th>
                    <th className="py-2.5 px-3 text-right">Term 1</th>
                    <th className="py-2.5 px-3 text-right">Term 2</th>
                    <th className="py-2.5 px-3 text-right">Term 3</th>
                    <th className="py-2.5 px-3 text-right">Grade Avg</th>
                    <th className="py-2.5 pl-4">Educator Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {REPORT_CARD_SIPHO.subjects.map((sub, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 pr-4 font-semibold text-slate-900">
                        {sub.subject}
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                        {sub.teacher}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        {privacyMask ? '••%' : `${sub.term1Mark}%`}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-600">
                        {privacyMask ? '••%' : `${sub.term2Mark}%`}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-bold text-blue-900">
                        {privacyMask ? '••%' : `${sub.term3Mark}%`}
                      </td>
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-400">
                        {sub.gradeAverage}%
                      </td>
                      <td className="py-3 pl-4 text-slate-600 max-w-xs text-[11px] leading-relaxed">
                        {sub.comment}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Principal Commentary */}
            <div className="mt-5 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                <FileCheck className="w-4 h-4 text-blue-900" />
                Principal & Management Endorsement
              </div>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed italic">
                "{REPORT_CARD_SIPHO.principalRemarks}"
              </p>
              <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Certified by: Dr. Eleanor M. Naidoo (Executive Principal)</span>
                <span>Stamp: Glenview PSDS Academic Directorate</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 2. ATTENDANCE RECORDS ---------------- */}
      {portalTab === 'attendance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Attendance & Register Audit
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official roll-call records verified by Grade 10 Tutor (Mr. Botha) and biometric campus gate scanner.
                </p>
              </div>

              <button
                onClick={onReportAbsenceClick}
                className="self-start sm:self-auto px-3.5 py-2 text-xs font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                Report New Absence
              </button>
            </div>

            {/* Attendance Breakdown Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-center">
                <span className="text-[11px] font-semibold text-emerald-800">Days Present</span>
                <p className="text-xl font-bold text-emerald-700 mt-0.5 tabular-nums">61</p>
                <span className="text-[10px] text-emerald-600">On-time register</span>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-center">
                <span className="text-[11px] font-semibold text-amber-800">Authorized Leave</span>
                <p className="text-xl font-bold text-amber-700 mt-0.5 tabular-nums">1</p>
                <span className="text-[10px] text-amber-600">Doctor certificate</span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-center">
                <span className="text-[11px] font-semibold text-slate-700">Unexcused Absences</span>
                <p className="text-xl font-bold text-slate-800 mt-0.5 tabular-nums">0</p>
                <span className="text-[10px] text-slate-500">Zero truancy flagged</span>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-center">
                <span className="text-[11px] font-semibold text-blue-900">Compliance Rate</span>
                <p className="text-xl font-bold text-blue-900 mt-0.5 tabular-nums">98.4%</p>
                <span className="text-[10px] text-blue-700">Meets distinction bar</span>
              </div>
            </div>

            {/* Absence Records Audit List */}
            <div className="mt-6">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Absence & Medical Leave History
              </h3>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden">
                {INITIAL_ABSENCES.map((abs) => (
                  <div key={abs.id} className="p-3.5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{abs.reason}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-medium border border-emerald-200">
                          Approved by Office
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{abs.notes}</p>
                      <div className="flex items-center gap-2 text-slate-400 text-[10px] mt-1">
                        <span>Dates: {abs.startDate} to {abs.endDate}</span>
                        <span>·</span>
                        <span>Reference: {abs.referenceNumber}</span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-[11px] text-slate-400">Recorded: {abs.dateReported}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 3. FEE STATEMENTS ---------------- */}
      {portalTab === 'fees' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  School Fee Account & Ledger
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                  <span>Billing Account: <strong className="font-mono text-slate-700">GV-ACC-8821-KHUMALO</strong></span>
                  <span aria-hidden="true">·</span>
                  <span>Primary Payer: Mrs. L. Khumalo</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDownloadModal('statement')}
                  className="px-3 py-2 text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tax Statement
                </button>
                <button
                  onClick={onOpenPaymentModal}
                  className="px-3.5 py-2 text-xs font-medium bg-emerald-700 text-white hover:bg-emerald-800 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  Pay Fees Online
                </button>
              </div>
            </div>

            {/* Account Balance Summary */}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-blue-950 to-blue-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-blue-200 font-medium">Outstanding Balance (Term 4)</span>
                <p className="text-2xl font-bold font-mono tracking-tight mt-0.5">
                  {privacyMask ? '$••••••' : '$395.00'}
                </p>
                <p className="text-xs text-blue-300 mt-1">Due date: 31 October 2026</p>
              </div>

              <div className="text-right sm:text-right border-t sm:border-t-0 border-blue-800 pt-3 sm:pt-0">
                <span className="text-xs text-blue-200 font-medium">Year-To-Date Paid</span>
                <p className="text-lg font-semibold font-mono text-amber-300 mt-0.5">
                  {privacyMask ? '$••••••' : '$2,850.00'}
                </p>
                <span className="text-[11px] text-blue-300">100% on-time payment track</span>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="mt-5">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">
                Recent Transactions & Receipts
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] tracking-wider">
                      <th className="py-2.5 pr-4">Date</th>
                      <th className="py-2.5 px-3">Description</th>
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3 text-right">Amount</th>
                      <th className="py-2.5 px-3 text-right">Balance</th>
                      <th className="py-2.5 pl-4 text-right">Receipt / Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {INITIAL_TRANSACTIONS.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 pr-4 font-mono text-slate-500 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-3 px-3 font-medium text-slate-800">
                          {tx.description}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                            tx.type === 'payment'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {tx.type === 'payment' ? 'Payment' : 'Fee Charge'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-slate-900">
                          {privacyMask ? '$•••' : `${tx.type === 'payment' ? '-' : '+'}$${tx.amount.toFixed(2)}`}
                        </td>
                        <td className="py-3 px-3 text-right font-mono tabular-nums text-slate-500">
                          {privacyMask ? '$•••' : `$${tx.balanceAfter.toFixed(2)}`}
                        </td>
                        <td className="py-3 pl-4 text-right font-mono text-[11px] text-blue-900">
                          {tx.receiptNumber || 'INV-2026-441'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- 4. UPCOMING EVENTS & OUTING CONSENTS ---------------- */}
      {portalTab === 'events' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h2 className="text-base font-bold text-slate-900">
              Digital Excursion & Outing Consent Slips
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 mb-4">
              Paperless legal indemnity authorization for school trips, sports tours, and academic camps.
            </p>

            <div className="space-y-4">
              {signedSlips.map((slip) => (
                <div
                  key={slip.id}
                  className={`border rounded-xl p-4 transition-all ${
                    slip.isSigned
                      ? 'border-slate-200 bg-slate-50/50'
                      : 'border-amber-200 bg-amber-50/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 text-sm">
                          {slip.title}
                        </h3>
                        {slip.isSigned ? (
                          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3 text-emerald-700" /> Signed & Approved
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-700" /> Action Required
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                        {slip.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 pt-1">
                        <span>Date: <strong>{slip.dateOfOuting}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Venue: <strong>{slip.venue}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Cost: <strong>${slip.cost.toFixed(2)}</strong></span>
                        <span aria-hidden="true">·</span>
                        <span>Transport: {slip.transportMode}</span>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      {!slip.isSigned ? (
                        <button
                          onClick={() => setSigningSlipId(slip.id)}
                          className="px-4 py-2 text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                        >
                          Review & Sign Consent
                        </button>
                      ) : (
                        <div className="text-right text-[11px] text-slate-400">
                          <p>Signed by: <strong className="text-slate-700">{slip.signedBy}</strong></p>
                          <p className="text-[10px]">{slip.signedAt}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Signing Modal */}
      {signingSlipId && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">
              Electronic Parental Consent & Indemnity
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Please verify student details and authorize participation.
            </p>

            <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-2">
              <p><strong>Student:</strong> {activeChild.name} ({activeChild.grade} - {activeChild.studentNumber})</p>
              <p><strong>Outing:</strong> Grade 10 National Science & Innovation Centre Excursion</p>
              <p><strong>Date & Times:</strong> 29 October 2026 (07:30 AM – 16:00 PM)</p>
              <p className="text-slate-600 leading-relaxed text-[11px] pt-1 border-t border-slate-200">
                I, as the registered parent/legal guardian, hereby give consent for my child to participate in the above school-sponsored excursion and travel by authorized school transport.
              </p>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Parent Signature (Type Full Legal Name)
              </label>
              <input
                type="text"
                defaultValue="Mrs. Lerato Khumalo"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
              />
            </div>

            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setSigningSlipId(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSignConsent(signingSlipId)}
                className="px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                Sign & Authorize Electronically
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Document Simulation Modal */}
      {downloadModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                {downloadModal === 'report' ? 'Official Academic Report PDF' : 'Official Statement PDF'}
              </h3>
              <button
                onClick={() => setDownloadModal(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Glenview Public Secondary School</span>
                <span className="text-[10px] text-slate-400">EMIS: 7001429</span>
              </div>
              <p className="text-slate-500">Student: {activeChild.name} ({activeChild.studentNumber})</p>
              <p className="text-slate-500">Document: {downloadModal === 'report' ? 'Term 3 Academic Report Card' : 'Consolidated Fee Account Statement'}</p>
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded text-[11px] border border-emerald-100 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Digitally signed and sealed with Glenview PSDS verification hash.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setDownloadModal(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  window.print?.();
                  setDownloadModal(null);
                }}
                className="px-4 py-2 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
