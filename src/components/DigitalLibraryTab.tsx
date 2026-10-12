import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Download,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  CheckCircle2,
  FileText,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Type,
  Wifi,
  WifiOff,
  Sparkles,
} from 'lucide-react';
import { DigitalBook, LibraryCategory, Chapter } from '../types';

interface DigitalLibraryTabProps {
  books: DigitalBook[];
  onToggleBookmark: (bookId: string) => void;
  onToggleDownload: (bookId: string) => void;
}

export const DigitalLibraryTab: React.FC<DigitalLibraryTabProps> = ({
  books,
  onToggleBookmark,
  onToggleDownload,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyOffline, setOnlyOffline] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // E-Reader Reader Modal State
  const [readingBook, setReadingBook] = useState<DigitalBook | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>('light');
  const [readerFontSize, setReaderFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [isReaderFullscreen, setIsReaderFullscreen] = useState<boolean>(false);

  const subjects = [
    'All',
    'Maths',
    'NS',
    'English',
    'Afrikaans',
    'Geography',
    'History',
    'EXAMS (Answers)',
  ];

  const categories = [
    { id: 'all', label: 'All Resources' },
    { id: 'e-textbooks', label: 'E-Textbooks' },
    { id: 'study-guides', label: 'Study Guides' },
    { id: 'past-papers', label: 'Past Papers & Memos' },
    { id: 'workbooks', label: 'Workbooks' },
  ];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.authorOrPublisher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.isbnOrCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubject =
        selectedSubject === 'all' || selectedSubject === 'All' || b.subject === selectedSubject;

      const matchesCategory =
        selectedCategory === 'all' || b.category === selectedCategory;

      const matchesGrade =
        selectedGrade === 'all' || b.gradeLevel === selectedGrade || b.gradeLevel === 'All Grades';

      const matchesOffline = !onlyOffline || b.isDownloaded;

      return matchesSearch && matchesSubject && matchesCategory && matchesGrade && matchesOffline;
    });
  }, [books, searchQuery, selectedSubject, selectedCategory, selectedGrade, onlyOffline]);

  const handleOpenReader = (book: DigitalBook) => {
    setReadingBook(book);
    setActiveChapterIndex(0);
  };

  const handleDownloadToggle = (book: DigitalBook) => {
    onToggleDownload(book.id);
    if (!book.isDownloaded) {
      showToast(`Downloaded "${book.title}" for offline study without data.`);
    } else {
      showToast(`Removed "${book.title}" from local device cache.`);
    }
  };

  const currentChapter: Chapter | undefined = readingBook?.chapters[activeChapterIndex];

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Glenview Digital Library
            </h1>
            <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
              E-Textbooks & Learning Hub
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Official e-textbooks, CAPS study guides, interactive revision workbooks, and past exam memorandums. Read in-app or download to study completely offline.
          </p>
        </div>

        {/* Offline Bookshelf quick switch */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setOnlyOffline(!onlyOffline)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg border transition-colors flex items-center gap-1.5 ${
              onlyOffline
                ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {onlyOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-300" /> : <Wifi className="w-3.5 h-3.5 text-slate-400" />}
            <span>My Offline Bookshelf ({books.filter((b) => b.isDownloaded).length})</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Search & Subject Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, subject, publisher, or ISBN..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium text-slate-700"
            >
              <option value="all">All Grades</option>
              <option value="Grade 7">Grade 7</option>
              <option value="Grade 8">Grade 8</option>
              <option value="Grade 9">Grade 9</option>
              <option value="Grade 10">Grade 10</option>
            </select>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-1.5 text-xs text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Subjects horizontal row */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Subject:
          </span>
          {subjects.map((subj) => (
            <button
              key={subj}
              onClick={() => setSelectedSubject(subj === 'All' ? 'all' : subj)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                (selectedSubject === 'all' && subj === 'All') || selectedSubject === subj
                  ? 'bg-blue-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Categories row */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-400 font-medium mr-1 flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" /> Type:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-md font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedSubject('all');
              setSelectedCategory('all');
              setSelectedGrade('all');
              setOnlyOffline(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map((book) => (
            <div
              key={book.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                {/* Book Card Top: Cover Preview + Info */}
                <div className="p-4 flex gap-4">
                  {/* Cover image container */}
                  <div
                    onClick={() => handleOpenReader(book)}
                    className="w-24 sm:w-28 aspect-3/4 rounded-xl overflow-hidden bg-slate-900 shadow-md shrink-0 cursor-pointer group relative border border-slate-200"
                  >
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-200"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <Eye className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="min-w-0 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                          {book.subject}
                        </span>
                        <button
                          onClick={() => onToggleBookmark(book.id)}
                          className="text-slate-400 hover:text-amber-500 p-1"
                          title="Bookmark title"
                        >
                          {book.isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-500" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <h2
                        onClick={() => handleOpenReader(book)}
                        className="font-bold text-slate-900 text-sm mt-1.5 leading-snug cursor-pointer hover:text-blue-900 line-clamp-2"
                      >
                        {book.title}
                      </h2>

                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        {book.authorOrPublisher}
                      </p>
                    </div>

                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex flex-wrap items-center gap-x-1.5 text-[11px] text-slate-400 mt-2">
                      <span>{book.gradeLevel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.pageCount} pages</span>
                      <span aria-hidden="true">·</span>
                      <span>{book.fileSize}</span>
                    </div>
                  </div>
                </div>

                {/* Description excerpt */}
                <div className="px-4 pb-2">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {book.description}
                  </p>
                </div>
              </div>

              {/* Bottom Actions Bar */}
              <div className="p-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => handleOpenReader(book)}
                  className="flex-1 py-2 px-3 text-xs font-semibold bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Read E-Book
                </button>

                <button
                  onClick={() => handleDownloadToggle(book)}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1.5 ${
                    book.isDownloaded
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                  title={book.isDownloaded ? 'Downloaded to offline storage' : 'Download for offline reading'}
                >
                  {book.isDownloaded ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cached</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5 text-slate-500" />
                      <span>Offline</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= IN-APP E-READER MODAL ================= */}
      {readingBook && currentChapter && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
          <div
            className={`w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all border ${
              isReaderFullscreen ? 'h-[98vh] max-w-[98vw]' : 'h-[88vh]'
            } ${
              readerTheme === 'dark'
                ? 'bg-slate-950 text-slate-100 border-slate-800'
                : readerTheme === 'sepia'
                ? 'bg-[#fbf7ed] text-[#3c362a] border-[#e8dfc9]'
                : 'bg-white text-slate-900 border-slate-200'
            }`}
          >
            {/* E-Reader Top Bar */}
            <div
              className={`p-3 sm:p-4 border-b flex items-center justify-between gap-3 shrink-0 ${
                readerTheme === 'dark'
                  ? 'border-slate-800 bg-slate-900/60'
                  : readerTheme === 'sepia'
                  ? 'border-[#e6dcbf] bg-[#f5efe0]'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <BookOpen className="w-4 h-4 text-blue-900 shrink-0" />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs sm:text-sm truncate">
                    {readingBook.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 block truncate">
                    {readingBook.authorOrPublisher} · {readingBook.syllabus}
                  </span>
                </div>
              </div>

              {/* Reader Controls Toolbar */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Theme Selector */}
                <div className="hidden sm:flex items-center p-0.5 rounded-lg border border-slate-200 bg-white/70 text-xs">
                  <button
                    onClick={() => setReaderTheme('light')}
                    className={`px-2 py-1 rounded text-[10px] font-medium ${
                      readerTheme === 'light' ? 'bg-slate-900 text-white' : 'text-slate-600'
                    }`}
                  >
                    Day
                  </button>
                  <button
                    onClick={() => setReaderTheme('sepia')}
                    className={`px-2 py-1 rounded text-[10px] font-medium ${
                      readerTheme === 'sepia' ? 'bg-[#4a3b2c] text-white' : 'text-[#6b5840]'
                    }`}
                  >
                    Sepia
                  </button>
                  <button
                    onClick={() => setReaderTheme('dark')}
                    className={`px-2 py-1 rounded text-[10px] font-medium ${
                      readerTheme === 'dark' ? 'bg-slate-800 text-white' : 'text-slate-600'
                    }`}
                  >
                    Night
                  </button>
                </div>

                {/* Font Size Selector */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() =>
                      setReaderFontSize((prev) => (prev === 'lg' ? 'base' : 'sm'))
                    }
                    className="p-1.5 rounded hover:bg-slate-200/50"
                    title="Smaller text"
                  >
                    A-
                  </button>
                  <button
                    onClick={() =>
                      setReaderFontSize((prev) => (prev === 'sm' ? 'base' : 'lg'))
                    }
                    className="p-1.5 rounded hover:bg-slate-200/50 font-bold"
                    title="Larger text"
                  >
                    A+
                  </button>
                </div>

                {/* Fullscreen toggle */}
                <button
                  onClick={() => setIsReaderFullscreen(!isReaderFullscreen)}
                  className="p-1.5 rounded hover:bg-slate-200/50 text-slate-500"
                  title="Toggle Fullscreen"
                >
                  {isReaderFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>

                {/* Close modal */}
                <button
                  onClick={() => setReadingBook(null)}
                  className="p-1.5 rounded-lg hover:bg-slate-200/60 font-bold text-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* E-Reader Body: Chapter List (Sidebar) + Reading Canvas */}
            <div className="flex-1 flex overflow-hidden">
              {/* Chapters Drawer */}
              <div
                className={`hidden md:block w-64 border-r overflow-y-auto p-3 text-xs shrink-0 ${
                  readerTheme === 'dark'
                    ? 'border-slate-800 bg-slate-900/30'
                    : readerTheme === 'sepia'
                    ? 'border-[#e6dcbf] bg-[#f8f3e5]'
                    : 'border-slate-100 bg-slate-50/50'
                }`}
              >
                <span className="font-bold text-[11px] uppercase tracking-wider text-slate-400 block mb-2 px-2">
                  Table of Contents
                </span>
                <div className="space-y-1">
                  {readingBook.chapters.map((ch, idx) => (
                    <button
                      key={ch.id}
                      onClick={() => setActiveChapterIndex(idx)}
                      className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex items-start gap-2 ${
                        activeChapterIndex === idx
                          ? 'bg-blue-900 text-white font-semibold'
                          : 'hover:bg-slate-200/40 text-slate-700'
                      }`}
                    >
                      <span className="font-mono text-[10px] shrink-0 mt-0.5">
                        Ch.{ch.chapterNumber}
                      </span>
                      <span className="line-clamp-2">{ch.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Reading Flow Canvas */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-10 flex flex-col justify-between">
                <article className="max-w-2xl mx-auto w-full space-y-6">
                  {/* Chapter Header */}
                  <div className="border-b pb-4 border-slate-200/60">
                    <span className="text-xs font-semibold text-blue-900 uppercase tracking-widest block">
                      Chapter {currentChapter.chapterNumber} · Page {currentChapter.pageStart}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold mt-1 tracking-tight">
                      {currentChapter.title}
                    </h2>
                  </div>

                  {/* Chapter Reading Text */}
                  <div
                    className={`leading-relaxed whitespace-pre-line font-serif ${
                      readerFontSize === 'sm'
                        ? 'text-sm'
                        : readerFontSize === 'lg'
                        ? 'text-lg leading-loose'
                        : 'text-base leading-relaxed'
                    }`}
                  >
                    {currentChapter.contentSnippet}
                  </div>

                  {/* Study check box */}
                  <div className="p-4 rounded-xl border border-blue-900/20 bg-blue-50/50 text-slate-800 text-xs space-y-1 font-sans">
                    <span className="font-bold text-blue-950 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-900" />
                      Glenview Curriculum Review Checkpoint
                    </span>
                    <p className="text-[11px] text-slate-600">
                      Take 5 minutes to summarize key formulas and vocabulary in your subject exercise book before progressing to the next chapter.
                    </p>
                  </div>
                </article>

                {/* Footer Page Navigation */}
                <div className="max-w-2xl mx-auto w-full pt-8 mt-6 border-t border-slate-200/60 flex items-center justify-between text-xs font-sans">
                  <button
                    disabled={activeChapterIndex === 0}
                    onClick={() => setActiveChapterIndex((prev) => Math.max(0, prev - 1))}
                    className="px-3.5 py-2 rounded-lg border border-slate-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous Chapter</span>
                  </button>

                  <span className="text-slate-400 font-mono text-[11px]">
                    Chapter {activeChapterIndex + 1} of {readingBook.chapters.length}
                  </span>

                  <button
                    disabled={activeChapterIndex === readingBook.chapters.length - 1}
                    onClick={() =>
                      setActiveChapterIndex((prev) =>
                        Math.min(readingBook.chapters.length - 1, prev + 1)
                      )
                    }
                    className="px-3.5 py-2 rounded-lg bg-blue-900 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-blue-800 flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <span>Next Chapter</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
