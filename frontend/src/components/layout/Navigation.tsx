import React from 'react';
import { LayoutDashboard, LineChart, Cpu, FileText, Settings as SettingsIcon, Truck } from 'lucide-react';

export type NavTab = 'dashboard' | 'fleet' | 'analytics' | 'architecture' | 'overview' | 'settings';

interface NavigationProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'COMMAND CENTER', icon: LayoutDashboard },
    { id: 'fleet' as NavTab, label: 'FLEET OVERVIEW', icon: Truck },
    { id: 'analytics' as NavTab, label: 'ANALYTICS', icon: LineChart },
    { id: 'architecture' as NavTab, label: 'HARDWARE ARCHITECTURE', icon: Cpu },
    { id: 'overview' as NavTab, label: 'SYSTEM OVERVIEW', icon: FileText },
    { id: 'settings' as NavTab, label: 'SETTINGS', icon: SettingsIcon },
  ];

  return (
    <nav className="bg-[#0b1120] border-b border-slate-800/80 px-4 py-1.5 sticky top-[57px] z-40">
      <div className="max-w-[1920px] mx-auto flex items-center space-x-1.5 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-semibold tracking-wider transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-sm shadow-cyan-500/10'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
