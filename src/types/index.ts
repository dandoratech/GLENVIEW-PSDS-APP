export type UserRole = 'parent' | 'learner' | 'teacher' | 'admin';

export interface Child {
  id: string;
  name: string;
  grade: string;
  classGroup: string;
  studentNumber: string;
  avatar: string;
  attendanceRate: number;
  walletBalance: number;
}

export interface Circular {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'urgent' | 'circular' | 'sports' | 'academic' | 'general';
  date: string;
  sender: string;
  urgent: boolean;
  read: boolean;
  referenceNumber: string;
  attachmentName?: string;
  offlineCached?: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  endTime?: string;
  category: 'exam' | 'sports' | 'cultural' | 'term' | 'parent_meeting';
  venue: string;
  description: string;
  targetGrades: string;
  reminderSet?: boolean;
}

export interface HomeworkItem {
  id: string;
  subject: string;
  title: string;
  dueDate: string;
  instructions: string;
  assignedBy: string;
  status: 'pending' | 'submitted' | 'graded';
  gradeScore?: string;
  childId: string;
}

export interface AssessmentItem {
  id: string;
  subject: string;
  title: string;
  date: string;
  weight: string;
  venue: string;
  scope: string;
}

export interface SubjectReport {
  subject: string;
  teacher: string;
  term1Mark: number;
  term2Mark: number;
  term3Mark: number;
  gradeAverage: number;
  comment: string;
}

export interface ReportCard {
  term: string;
  year: number;
  overallAverage: number;
  positionInGrade: string;
  attendanceDays: number;
  totalDays: number;
  principalRemarks: string;
  subjects: SubjectReport[];
}

export interface AbsenceRecord {
  id: string;
  studentName: string;
  studentId: string;
  startDate: string;
  endDate: string;
  reason: string;
  notes: string;
  status: 'approved' | 'pending';
  referenceNumber: string;
  dateReported: string;
  hasMedicalCertificate: boolean;
}

export interface ConsentSlip {
  id: string;
  title: string;
  description: string;
  dateOfOuting: string;
  departureTime: string;
  returnTime: string;
  venue: string;
  cost: number;
  transportMode: string;
  teacherInCharge: string;
  deadline: string;
  isSigned: boolean;
  signedBy?: string;
  signedAt?: string;
  emergencyContact?: string;
}

export interface TeacherSlot {
  id: string;
  teacherName: string;
  subject: string;
  email: string;
  room: string;
  availableDates: {
    date: string;
    slots: string[];
  }[];
}

export interface InterviewBooking {
  id: string;
  teacherName: string;
  subject: string;
  date: string;
  timeSlot: string;
  childName: string;
  status: 'confirmed' | 'cancelled';
  notes?: string;
}

export interface MessageThread {
  id: string;
  teacherName: string;
  teacherRole: string;
  subject: string;
  unreadCount: number;
  lastMessage: string;
  lastTimestamp: string;
  messages: {
    id: string;
    sender: 'parent' | 'teacher';
    text: string;
    timestamp: string;
  }[];
}

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Sports' | 'Culture' | 'Academics' | 'Campus Life';
  date: string;
  imageUrl: string;
  caption: string;
  photographer: string;
}

export interface TuckShopItem {
  id: string;
  name: string;
  category: 'Meals' | 'Beverages' | 'Healthy Snacks' | 'Stationery';
  price: number;
  description: string;
  available: boolean;
}

export interface FeeTransaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'charge' | 'payment';
  balanceAfter: number;
  receiptNumber?: string;
}

export type StaffDepartment =
  | 'Leadership & Administration'
  | 'Sciences'
  | 'Mathematics'
  | 'Humanities & Languages'
  | 'Technology & Arts'
  | 'Sports & Student Well-being';

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: StaffDepartment;
  gradeLevels: string[];
  photo: string;
  email: string;
  phoneExtension: string;
  officeRoom: string;
  bio: string;
  subjects: string[];
  inAppMessageSupported: boolean;
}

export interface ParentUser {
  id: string;
  familyId: string;
  name: string;
  email: string;
  phone: string;
  twoFactorEnabled: boolean;
  biometricUnlocked: boolean;
  lastLogin: string;
  childrenIds: string[];
}

export interface GroupMessage {
  id: string;
  senderName: string;
  senderRole: string;
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageCaption?: string;
  attachmentName?: string;
  isAdminBroadcast: boolean;
}

export interface SubjectGroup {
  id: string;
  orderNumber: number;
  name: string;
  code: string;
  description: string;
  adminInCharge: string;
  adminRole: string;
  subscriberCount: number;
  messages: GroupMessage[];
}

export type LibraryCategory = 'e-textbooks' | 'study-guides' | 'past-papers' | 'workbooks';

export interface Chapter {
  id: string;
  chapterNumber: number;
  title: string;
  pageStart: number;
  contentSnippet: string;
}

export interface DigitalBook {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  category: LibraryCategory;
  authorOrPublisher: string;
  isbnOrCode: string;
  coverImage: string;
  fileSize: string;
  pageCount: number;
  year: number;
  syllabus: string;
  isDownloaded: boolean;
  isBookmarked: boolean;
  description: string;
  chapters: Chapter[];
}



