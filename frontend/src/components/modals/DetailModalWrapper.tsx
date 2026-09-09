import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface DetailModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  badge?: string;
  badgeColor?: string;
  children: React.ReactNode;
}

export const DetailModalWrapper: React.FC<DetailModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-cyan-500 text-black',
  children,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Dark backdrop with blur */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-4xl bg-[#0b1324] border-2 border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#090f1d]">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2.5">
                <h2 className="text-base sm:text-lg font-black tracking-wider uppercase text-slate-100 font-mono">
                  {title}
                </h2>
                {badge && (
                  <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded font-mono ${badgeColor}`}>
                    {badge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-slate-400 mt-0.5 font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-500 transition-colors"
            title="Close Inspector (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-200">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#080d19] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span>FOG-SAFE Advanced Telemetry Inspector</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
