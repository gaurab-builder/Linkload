import React from 'react';
import { X, ShieldCheck, FileText, Mail } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | 'dmca' | 'contact' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  if (!activeModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-slate-900 border border-white/10 p-6 sm:p-8 text-slate-300 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {activeModal === 'privacy' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Privacy Policy</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-400">
              <p>
                LinkLoad prioritizes your privacy. We operate a stateless, privacy-first service designed for media inspection
                and authorized downloads.
              </p>
              <h4 className="font-semibold text-white text-sm">1. Data Collection & Retention</h4>
              <p>
                We do NOT store or log submitted video URLs, IP addresses, or personal identities into persistent databases.
                Requests are processed ephemerally in RAM and cleared once the inspection response or download stream finishes.
              </p>
              <h4 className="font-semibold text-white text-sm">2. Cookies & Tracking</h4>
              <p>
                LinkLoad does not deploy marketing cookies, ad trackers, or third-party pixel beacons. We only use browser session storage
                for UI preferences.
              </p>
              <h4 className="font-semibold text-white text-sm">3. Security Defenses</h4>
              <p>
                Our infrastructure protects internal networks against Server-Side Request Forgery (SSRF) and DNS rebinding attacks.
              </p>
            </div>
          </div>
        )}

        {activeModal === 'terms' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <FileText className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Terms of Service</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-400">
              <p>
                By accessing LinkLoad, you agree to comply with applicable copyright laws and platform terms of service.
              </p>
              <h4 className="font-semibold text-white text-sm">1. User Responsibility</h4>
              <p>
                Users are solely responsible for verifying that they have appropriate licenses, ownership, or fair-use permissions
                to download, archive, or repurpose any media accessed via LinkLoad.
              </p>
              <h4 className="font-semibold text-white text-sm">2. Prohibited Uses</h4>
              <p>
                You may not use LinkLoad to circumvent DRM, access private or paywalled accounts, scrape mass platform databases,
                or distribute copyrighted material for commercial gain without authorization.
              </p>
              <h4 className="font-semibold text-white text-sm">3. Disclaimer</h4>
              <p>
                LinkLoad is an independent software tool. We do not host, store, or index copyrighted videos on our servers. All videos
                are streamed from public third-party hosts.
              </p>
            </div>
          </div>
        )}

        {activeModal === 'dmca' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <FileText className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Copyright & DMCA Notice</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-400">
              <p>
                LinkLoad respects the intellectual property rights of content creators and copyright owners worldwide.
              </p>
              <h4 className="font-semibold text-white text-sm">1. Content Hosting Statement</h4>
              <p>
                LinkLoad does not host or store any videos, audio files, or media databases. When a user enters a link, the system
                queries public platform APIs or streams the authorized original file from the host server.
              </p>
              <h4 className="font-semibold text-white text-sm">2. Takedown & Blocking Requests</h4>
              <p>
                If you are a copyright owner or platform administrator and wish to blacklist your domain or request restrictions,
                please email our compliance department with full details.
              </p>
              <p className="text-indigo-400 font-mono text-xs">compliance@linkload.app</p>
            </div>
          </div>
        )}

        {activeModal === 'contact' && (
          <div>
            <div className="flex items-center gap-2.5 mb-4 text-white">
              <Mail className="w-6 h-6 text-indigo-400" />
              <h3 className="text-xl font-bold">Contact & Support</h3>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-400">
              <p>
                Need assistance with LinkLoad or have inquiries about platform integration?
              </p>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <p className="text-xs text-slate-400">Technical & General Support:</p>
                <p className="text-sm font-mono text-white">support@linkload.app</p>
                <p className="text-xs text-slate-400 pt-2">API Integration & Developer Partnerships:</p>
                <p className="text-sm font-mono text-white">partners@linkload.app</p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-8 pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
