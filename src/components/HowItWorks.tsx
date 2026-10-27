import React from 'react';
import { Copy, Search, DownloadCloud } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Copy the Video URL',
      description:
        'Navigate to Instagram, TikTok, YouTube, Reddit, Facebook, X, or Pinterest and copy the shareable link of any publicly accessible video.',
      icon: Copy,
    },
    {
      step: '02',
      title: 'Inspect & Select Quality',
      description:
        'Paste the link into LinkLoad. Our adapter instantly validates the platform, checks authorized streams, inspects watermark status, and reveals resolutions.',
      icon: Search,
    },
    {
      step: '03',
      title: 'Direct High-Speed Download',
      description:
        'Select 1080p Full HD, standard MP4, or standalone audio. Download files directly to your device storage without annoying popup redirects or clutter.',
      icon: DownloadCloud,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Simple 3-Step Process
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How LinkLoad Works
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Fast, secure, and transparent. No account registration or invasive browser extensions required.
          </p>
        </div>

        {/* 3 Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative p-8 rounded-2xl bg-slate-900/60 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-2xl font-mono font-bold text-indigo-400">
                      {item.step}.
                    </span>
                    <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3 tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
