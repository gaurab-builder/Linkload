import React from 'react';
import { ArrowDownToLine, Sparkles } from 'lucide-react';

interface NavbarProps {
  onSelectSample: (sampleUrl: string) => void;
  onOpenLegal: (tab: 'privacy' | 'terms' | 'dmca') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectSample, onOpenLegal }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-[#070a13]/80 border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-sky-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
            <div className="w-full h-full bg-[#090d1a] rounded-[7px] flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <span>LinkLoad</span>
        </a>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-400">
          <a href="#downloader" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Downloader
          </a>
          <a href="#platforms" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Platforms
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            How It Works
          </a>
          <a href="#security" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            Security & Rights
          </a>
          <a href="#faq" className="hover:text-white transition-colors whitespace-nowrap shrink-0">
            FAQ
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectSample('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 rounded-lg shadow-sm shadow-indigo-500/20 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-200" />
            <span>Try Sample</span>
          </button>
        </div>
      </div>
    </header>
  );
};
