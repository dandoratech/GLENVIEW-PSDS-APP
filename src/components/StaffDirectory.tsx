import React, { useState, useMemo } from 'react';
import {
  Search,
  Mail,
  MessageSquare,
  Calendar,
  Building,
  Phone,
  BookOpen,
  CheckCircle2,
  Filter,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { StaffMember, StaffDepartment } from '../types';
import { STAFF_DIRECTORY } from '../data/mockData';

interface StaffDirectoryProps {
  onStartMessage: (teacherName: string, subject: string) => void;
  onBookInterview: (teacherName: string, subject: string) => void;
}

const DEPARTMENTS: StaffDepartment[] = [
  'Leadership & Administration',
  'Sciences',
  'Mathematics',
  'Humanities & Languages',
  'Technology & Arts',
  'Sports & Student Well-being',
];

const GRADE_LEVELS = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
];

export const StaffDirectory: React.FC<StaffDirectoryProps> = ({
  onStartMessage,
  onBookInterview,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [groupingMode, setGroupingMode] = useState<'department' | 'grade' | 'flat'>('department');
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({});
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const toggleBio = (id: string) => {
    setExpandedBios((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyEmail = (email: string) => {
    navigator.clipboard?.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2500);
  };

  const filteredStaff = useMemo(() => {
    return STAFF_DIRECTORY.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        staff.officeRoom.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === 'all' || staff.department === selectedDepartment;

      const matchesGrade =
        selectedGrade === 'all' ||
        staff.gradeLevels.some((g) => g.includes(selectedGrade) || g.includes('All Grades'));

      return matchesSearch && matchesDepartment && matchesGrade;
    });
  }, [searchQuery, selectedDepartment, selectedGrade]);

  const staffByDepartment = useMemo(() => {
    const map = new Map<StaffDepartment, StaffMember[]>();
    DEPARTMENTS.forEach((dept) => map.set(dept, []));

    filteredStaff.forEach((staff) => {
      const list = map.get(staff.department) || [];
      list.push(staff);
      map.set(staff.department, list);
    });

    return map;
  }, [filteredStaff]);

  const staffByGrade = useMemo(() => {
    const map = new Map<string, StaffMember[]>();
    GRADE_LEVELS.forEach((grade) => map.set(grade, []));
    map.set('School-Wide / All Grades', []);

    filteredStaff.forEach((staff) => {
      let matched = false;
      GRADE_LEVELS.forEach((grade) => {
        if (staff.gradeLevels.some((g) => g.includes(grade))) {
          const list = map.get(grade) || [];
          list.push(staff);
          map.set(grade, list);
          matched = true;
        }
      });
      if (!matched || staff.gradeLevels.some((g) => g.includes('All Grades'))) {
        const list = map.get('School-Wide / All Grades') || [];
        list.push(staff);
        map.set('School-Wide / All Grades', list);
      }
    });

    return map;
  }, [filteredStaff]);

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Teacher & Staff Directory
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Official educator contact registry for Glenview PSDS. Reach educators directly via secure in-app messaging, verified school email, or schedule parent-teacher consultation sessions.
          </p>
        </div>

        {/* Grouping Mode Selector */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start md:self-auto">
          <button
            onClick={() => setGroupingMode('department')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              groupingMode === 'department'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Department
          </button>
          <button
            onClick={() => setGroupingMode('grade')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              groupingMode === 'grade'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            By Grade Level
          </button>
          <button
            onClick={() => setGroupingMode('flat')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              groupingMode === 'flat'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Staff ({filteredStaff.length})
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by educator name, subject, or office room..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900/20 focus:border-blue-900"
            />
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="px-3 py-2 text-xs font-medium text-slate-500 hover:text-slate-800 self-center"
            >
              Clear Search
            </button>
          )}
        </div>

        {/* Quick Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Department:
          </span>
          <button
            onClick={() => setSelectedDepartment('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedDepartment === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedDepartment === dept
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium shrink-0 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Grade Level:
          </span>
          <button
            onClick={() => setSelectedGrade('all')}
            className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
              selectedGrade === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Grades
          </button>
          {GRADE_LEVELS.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedGrade === grade
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grade}
            </button>
          ))}
        </div>
      </div>

      {copiedEmail && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Copied email address: <span className="font-mono font-medium">{copiedEmail}</span>
        </div>
      )}

      {/* Directory Content Display */}
      {filteredStaff.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Building className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No staff members found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, department filters, or grade level selections.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedDepartment('all');
              setSelectedGrade('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : groupingMode === 'department' ? (
        /* Organized By Department */
        <div className="space-y-8">
          {Array.from(staffByDepartment.entries()).map(([department, staffList]) => {
            if (staffList.length === 0) return null;
            return (
              <section key={department} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-900"></span>
                    {department}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {staffList.length} {staffList.length === 1 ? 'member' : 'members'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staffList.map((staff) => renderStaffCard(staff))}
                </div>
              </section>
            );
          })}
        </div>
      ) : groupingMode === 'grade' ? (
        /* Organized By Grade Level */
        <div className="space-y-8">
          {Array.from(staffByGrade.entries()).map(([grade, staffList]) => {
            if (staffList.length === 0) return null;
            return (
              <section key={grade} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
                    {grade}
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {staffList.length} {staffList.length === 1 ? 'faculty' : 'faculties'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staffList.map((staff) => renderStaffCard(staff))}
                </div>
              </section>
            );
          })}
        </div>
      ) : (
        /* Flat Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredStaff.map((staff) => renderStaffCard(staff))}
        </div>
      )}
    </div>
  );

  function renderStaffCard(staff: StaffMember) {
    const isExpanded = expandedBios[staff.id];

    return (
      <div
        key={staff.id}
        className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
      >
        <div>
          {/* Top row: Photo + Name + Title */}
          <div className="flex items-start gap-3.5">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 shadow-inner">
              <img
                src={staff.photo}
                alt={staff.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-slate-900 text-base leading-snug truncate">
                  {staff.name}
                </h3>
              </div>
              <p className="text-xs font-medium text-blue-900 mt-0.5 line-clamp-1">
                {staff.role}
              </p>

              {/* Clean unboxed metadata with bullet separators */}
              <div className="flex flex-wrap items-center gap-x-1.5 text-xs text-slate-500 mt-1.5">
                <span>{staff.department}</span>
                <span aria-hidden="true">·</span>
                <span>{staff.officeRoom}</span>
                <span aria-hidden="true">·</span>
                <span>{staff.phoneExtension}</span>
              </div>
            </div>
          </div>

          {/* Subjects and Grade Levels */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">Covers:</span>
            {staff.subjects.map((sub, i) => (
              <span key={i} className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                {sub}
              </span>
            ))}
            <span className="text-slate-300 mx-1">|</span>
            <span className="text-slate-500 text-[11px]">
              {staff.gradeLevels.join(', ')}
            </span>
          </div>

          {/* Bio Expander */}
          <div className="mt-2.5">
            <p className={`text-xs text-slate-600 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
              {staff.bio}
            </p>
            <button
              onClick={() => toggleBio(staff.id)}
              className="text-[11px] font-medium text-blue-900 hover:underline mt-1 inline-flex items-center gap-0.5"
            >
              {isExpanded ? (
                <>Less info <ChevronUp className="w-3 h-3" /></>
              ) : (
                <>Read full bio <ChevronDown className="w-3 h-3" /></>
              )}
            </button>
          </div>
        </div>

        {/* Primary Contact Method Actions */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {/* Primary Contact 1: In-App Message */}
          <button
            onClick={() => onStartMessage(staff.name, staff.subjects[0] || 'Inquiry')}
            className="flex-1 min-w-[120px] py-2 px-3 text-xs font-medium bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            In-App Message
          </button>

          {/* Primary Contact 2: Email */}
          <button
            onClick={() => copyEmail(staff.email)}
            className="py-2 px-3 text-xs font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title={`Copy ${staff.email}`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Copy Email</span>
            <span className="sm:hidden">Email</span>
          </button>

          {/* Consultation / Interview button */}
          <button
            onClick={() => onBookInterview(staff.name, staff.subjects[0] || 'Subject Inquiry')}
            className="py-2 px-3 text-xs font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title="Book 15-min Consultation"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>Consult</span>
          </button>
        </div>
      </div>
    );
  }
};
