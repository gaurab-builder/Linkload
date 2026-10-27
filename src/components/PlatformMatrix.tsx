import React, { useState } from 'react';
import { PlatformCapability, PlatformId } from '../types';
import { PlatformIcon } from './PlatformIcons';
import { ArrowUpRight, Check, Shield, AlertTriangle } from 'lucide-react';

interface PlatformMatrixProps {
  capabilities: PlatformCapability[];
  onSelectSample: (sampleUrl: string) => void;
}

export const PlatformMatrix: React.FC<PlatformMatrixProps> = ({ capabilities, onSelectSample }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'short_form' | 'social' | 'direct'>('all');

  const filtered = capabilities.filter((p) => {
    if (selectedFilter === 'short_form') return ['tiktok', 'instagram', 'youtube'].includes(p.id);
    if (selectedFilter === 'social') return ['facebook', 'twitter', 'reddit', 'pinterest'].includes(p.id);
    if (selectedFilter === 'direct') return p.id === 'direct';
    return true;
  });

  return (
    <section id="platforms" className="py-16 md:py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Coverage & Compatibility
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Supported Social Platforms
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            LinkLoad adheres to authorized platform interfaces and content rights. Below is our transparent
            compatibility matrix covering formats, watermark policies, and stream permissions.
          </p>
        </div>

        {/* Filter Tabs (Interactive Segmented Control) */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-white/10 rounded-xl w-fit mb-8">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Platforms ({capabilities.length})
          </button>
          <button
            onClick={() => setSelectedFilter('short_form')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'short_form'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Reels & Shorts
          </button>
          <button
            onClick={() => setSelectedFilter('social')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'social'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Social Networks
          </button>
          <button
            onClick={() => setSelectedFilter('direct')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedFilter === 'direct'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct & CC-BY
          </button>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-6 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-white/[0.08] hover:border-indigo-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Platform Header */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: `${item.accentColor}25`, border: `1px solid ${item.accentColor}40` }}
                    >
                      <PlatformIcon platform={item.id} size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white tracking-tight">{item.name}</h3>
                      <p className="text-[11px] text-slate-500 font-mono truncate max-w-[140px]">
                        {item.domainPattern}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Supported Media Types */}
                <div className="mb-4">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Supported Formats
                  </p>
                  <div className="flex flex-wrap gap-1.5 text-xs text-slate-300">
                    {item.supportedTypes.map((type, idx) => (
                      <span key={type} className="inline-flex items-center gap-1 text-slate-300">
                        <span>{type}</span>
                        {idx < item.supportedTypes.length - 1 && <span className="text-slate-600">·</span>}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Max Resolution & Watermark Note */}
                <div className="space-y-2 mb-4 text-xs text-slate-400 border-t border-white/[0.06] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Max Quality:</span>
                    <span className="font-semibold text-white font-mono">{item.maxResolution}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Watermark Policy:</span>
                    <span className="text-slate-300 text-[11px] leading-relaxed block">
                      {item.watermarkPolicy}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action: Test sample button */}
              <div className="pt-4 border-t border-white/[0.06]">
                <button
                  type="button"
                  onClick={() => {
                    const sample = item.examples[0];
                    if (sample) {
                      onSelectSample(sample);
                    }
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 hover:text-white transition-colors cursor-pointer group-hover:border-white/20"
                >
                  <span>Test Link</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
