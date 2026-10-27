import React, { useState } from 'react';
import {
  Download,
  ExternalLink,
  Copy,
  Check,
  ShieldAlert,
  ShieldCheck,
  Music,
  Video,
  Clock,
  User,
  Share2,
  FileCheck,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { VideoMetadata, VideoFormat } from '../types';
import { PlatformIcon } from './PlatformIcons';

interface VideoResultCardProps {
  metadata: VideoMetadata;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({ metadata }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const handleDownload = (format: VideoFormat) => {
    setDownloadingId(format.formatId);
    setDownloadProgress(10);
    setDownloadComplete(null);

    // Simulate progress while triggering download
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 20;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setDownloadProgress(100);

      // Trigger the real browser download or stream
      const link = document.createElement('a');
      link.href = format.downloadUrl;
      link.setAttribute('download', `linkload-${metadata.platform}-${format.formatId}.${format.extension}`);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        setDownloadingId(null);
        setDownloadComplete(format.formatId);
        setTimeout(() => setDownloadComplete(null), 3500);
      }, 600);
    }, 1200);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(metadata.originalPostUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
      <div className="relative rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 overflow-hidden">
        {/* Top Header Strip */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <PlatformIcon platform={metadata.platform} size={20} className="text-sky-400" />
            <span className="text-sm font-semibold text-white">{metadata.platformName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400">{metadata.aspectRatio} Aspect Ratio</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <a
              href={metadata.originalPostUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Open Original</span>
            </a>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left: Thumbnail & Duration */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full aspect-video sm:aspect-square rounded-xl bg-slate-950/80 border border-white/10 overflow-hidden flex items-center justify-center group shadow-lg">
                {metadata.thumbnailUrl ? (
                  <img
                    src={metadata.thumbnailUrl}
                    alt={metadata.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback if cross-origin image blocks
                      (e.currentTarget as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950">
                    <Video className="w-12 h-12 text-indigo-400 mb-2 opacity-80" />
                    <span className="text-xs text-slate-400 font-medium">{metadata.platformName} Stream</span>
                  </div>
                )}

                {/* Duration Badge */}
                {metadata.formattedDuration && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur-md text-[11px] font-mono text-white/90 border border-white/10">
                    {metadata.formattedDuration}
                  </div>
                )}
              </div>

              {/* Author Info */}
              <div className="mt-4 w-full flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 text-xs font-bold shrink-0">
                  {metadata.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{metadata.author.name}</p>
                  {metadata.author.username && (
                    <p className="text-[11px] text-slate-400 truncate">{metadata.author.username}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Title, Watermark Disclosure & Formats */}
            <div className="md:col-span-7 flex flex-col gap-5">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-snug">
                  {metadata.title}
                </h3>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                  <span>Source: {metadata.platformName}</span>
                  <span>·</span>
                  <span>Verified Public Stream</span>
                </div>
              </div>

              {/* Watermark Disclosure Notice */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300 leading-relaxed">
                <div className="flex items-start gap-2.5">
                  {metadata.formats.some((f) => f.watermarkStatus === 'has_watermark') ? (
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-semibold text-white">Watermark Disclosure: </span>
                    <span>{metadata.watermarkDisclosure}</span>
                  </div>
                </div>
              </div>

              {/* Download Formats List */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Available Formats & Resolutions
                </h4>

                <div className="space-y-2.5">
                  {metadata.formats.map((format) => {
                    const isCurrentDownloading = downloadingId === format.formatId;
                    const isCurrentComplete = downloadComplete === format.formatId;

                    return (
                      <div
                        key={format.formatId}
                        className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.08] hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0 mt-0.5">
                            {format.extension === 'mp3' || format.extension === 'm4a' ? (
                              <Music className="w-4 h-4" />
                            ) : (
                              <Video className="w-4 h-4" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-white">{format.label}</span>
                              <span className="text-xs text-slate-400 font-mono">
                                ({format.extension.toUpperCase()})
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-slate-400">
                              <span>{format.resolution}</span>
                              {format.estimatedSize && (
                                <>
                                  <span>·</span>
                                  <span className="font-mono tabular-nums text-slate-300">
                                    {format.estimatedSize}
                                  </span>
                                </>
                              )}
                              <span>·</span>
                              <span
                                className={
                                  format.watermarkStatus === 'no_watermark'
                                    ? 'text-emerald-400 font-medium'
                                    : 'text-amber-400'
                                }
                              >
                                {format.watermarkStatus === 'no_watermark' ? 'Clean Stream' : 'Platform Watermark'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Download CTA Button */}
                        <div className="sm:self-center shrink-0">
                          <button
                            onClick={() => handleDownload(format)}
                            disabled={isCurrentDownloading}
                            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                              isCurrentComplete
                                ? 'bg-emerald-600 text-white'
                                : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white shadow-sm shadow-indigo-600/30'
                            }`}
                          >
                            {isCurrentDownloading ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Preparing ({downloadProgress}%)</span>
                              </>
                            ) : isCurrentComplete ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Downloaded</span>
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                <span>Download</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Legal Copyright Note */}
              <div className="pt-2 border-t border-white/[0.06] text-[11px] text-slate-500 leading-normal">
                {metadata.copyrightNotice} LinkLoad does not host copyrighted media files.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
