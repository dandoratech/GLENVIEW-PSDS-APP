import React from 'react';
import {
  Bell,
  ShieldCheck,
  Users,
  Calendar,
  Layers,
  CreditCard,
  BookOpen,
} from 'lucide-react';

interface MobileBottomBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
}) => {
  const tabs = [
    { id: 'communication', label: 'Notices', icon: Bell, badge: unreadCount },
    { id: 'portal', label: 'Portal', icon: ShieldCheck },
    { id: 'groups', label: 'Groups', icon: Layers },
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'directory', label: 'Staff', icon: Users },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200">
      <div className="grid grid-cols-6 items-center h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors relative ${
                isActive ? 'text-blue-900 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                {Boolean(tab.badge && tab.badge > 0) && (
                  <span className="absolute -top-1 -right-2 bg-rose-600 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-bold">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-blue-900 mt-0.5"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
