import React, { useState } from 'react';
import {
  Camera,
  Download,
  Share2,
  Calendar,
  Maximize2,
  Filter,
  CheckCircle,
} from 'lucide-react';
import { GalleryPhoto } from '../types';
import { GALLERY_PHOTOS } from '../data/mockData';

export const SchoolLifeTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories = ['All', 'Sports', 'Culture', 'Academics', 'Campus Life'];

  const filteredPhotos = GALLERY_PHOTOS.filter((photo) => {
    if (selectedCategory === 'All') return true;
    return photo.category === selectedCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            School Life & Event Galleries
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Experience Glenview PSDS in action. High-resolution captures of athletics derbies, symphony performances, and academic milestones.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg shrink-0 self-start sm:self-auto text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => setActivePhoto(photo)}
            className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="relative aspect-16/10 overflow-hidden bg-slate-100">
              <img
                src={photo.imageUrl}
                alt={photo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

              <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
                    {photo.category}
                  </span>
                  <h2 className="text-sm font-bold text-white mt-1 leading-snug drop-shadow-xs">
                    {photo.title}
                  </h2>
                </div>
                <button className="p-2 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/40 transition-colors">
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <p className="text-xs text-slate-600 leading-relaxed">
                {photo.caption}
              </p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {photo.date}
                </span>
                <span>Photo: {photo.photographer}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl space-y-4">
            <div className="relative aspect-16/10 max-h-[70vh] bg-black">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white bg-black/50 p-2 rounded-full backdrop-blur-md"
              >
                ✕
              </button>
            </div>

            <div className="p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                  {activePhoto.category}
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {activePhoto.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-xl">
                  {activePhoto.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    showToast('Photo link copied.');
                  }}
                  className="px-3.5 py-2 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Share
                </button>
                <button
                  onClick={() => showToast(`Saving full-resolution photo...`)}
                  className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download 8K
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
