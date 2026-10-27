import React from 'react';
import { ArrowDownToLine } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (tab: 'privacy' | 'terms' | 'dmca' | 'contact') => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal }) => {
  return (
    <footer className="border-t border-white/[0.08] bg-[#05070d] py-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-white/[0.06]">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4 text-sky-400" />
            </div>
            <span className="text-base font-bold text-white tracking-tight">LinkLoad</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-500">Universal Social Media Video Downloader</span>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400">
            <button
              onClick={() => onOpenLegal('privacy')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => onOpenLegal('terms')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => onOpenLegal('dmca')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              DMCA & Copyright
            </button>
            <button
              onClick={() => onOpenLegal('contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-slate-500">
          <p className="max-w-2xl leading-relaxed">
            Disclaimer: LinkLoad is an independent software tool. We do not host or archive copyrighted videos on our servers.
            All third-party trademarks, platform marks, and logos belong to their respective owners (Meta, TikTok, Google, X Corp, Reddit, Pinterest).
          </p>
          <p className="shrink-0 font-mono text-[11px] text-slate-600">
            © 2026 LinkLoad. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
