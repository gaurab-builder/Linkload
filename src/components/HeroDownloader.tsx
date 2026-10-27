import React, { useState, useEffect } from 'react';
import { ArrowDownToLine, Clipboard, X, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PlatformId } from '../types';
import { PlatformIcon } from './PlatformIcons';

interface HeroDownloaderProps {
  url: string;
  setUrl: (url: string) => void;
  isLoading: boolean;
  onInspect: (targetUrl?: string) => void;
  error?: string | null;
  detectedPlatform: PlatformId | null;
}

export const SAMPLE_LINKS = [
  {
    label: 'Nature 1080p MP4 (Direct CC-BY)',
    platform: 'direct' as PlatformId,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    label: 'Tears of Steel (Blender 4K)',
    platform: 'direct' as PlatformId,
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  },
  {
    label: 'TikTok Clip URL',
    platform: 'tiktok' as PlatformId,
    url: 'https://www.tiktok.com/@scout2015/video/6718335390845095173',
  },
  {
    label: 'Instagram Reel URL',
    platform: 'instagram' as PlatformId,
    url: 'https://www.instagram.com/reel/C3b45XYZ123/',
  },
  {
    label: 'YouTube Shorts URL',
    platform: 'youtube' as PlatformId,
    url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ',
  },
  {
    label: 'Reddit Video URL',
    platform: 'reddit' as PlatformId,
    url: 'https://www.reddit.com/r/aww/comments/sample_cute_dog/',
  },
];

export const HeroDownloader: React.FC<HeroDownloaderProps> = ({
  url,
  setUrl,
  isLoading,
  onInspect,
  error,
  detectedPlatform,
}) => {
  const [pasteFeedback, setPasteFeedback] = useState(false);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text.trim());
        setPasteFeedback(true);
        setTimeout(() => setPasteFeedback(false), 2000);
      }
    } catch {
      // Browser permission denial or unsupported
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || isLoading) return;
    onInspect(url.trim());
  };

  return (
    <section id="downloader" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-sky-500/15 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
          style={{ textWrap: 'balance' }}
        >
          Download Videos.{' '}
          <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            Keep the Moments.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 font-normal leading-relaxed mb-10"
          style={{ textWrap: 'balance' }}
        >
          Paste a video link, preview available media, and download in supported quality — all in a few simple steps.
        </p>

        {/* Search / Input Box */}
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="relative flex flex-col sm:flex-row items-stretch gap-2.5 p-2 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/60 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all"
          >
            <div className="relative flex-1 flex items-center min-w-0 px-3">
              {/* Dynamic Platform Icon indicator */}
              <div className="shrink-0 mr-3 text-slate-400">
                {detectedPlatform ? (
                  <div className="p-1 rounded bg-white/5 border border-white/10">
                    <PlatformIcon platform={detectedPlatform} className="w-5 h-5 text-sky-400" size={20} />
                  </div>
                ) : (
                  <ArrowDownToLine className="w-5 h-5 text-slate-500" />
                )}
              </div>

              {/* URL Input */}
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste your social media video link here..."
                className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-500 focus:outline-none py-2.5"
                disabled={isLoading}
              />

              {/* Clear button */}
              {url && !isLoading && (
                <button
                  type="button"
                  onClick={() => setUrl('')}
                  aria-label="Clear link input"
                  className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-white/5 transition-colors cursor-pointer mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Paste from clipboard button */}
              <button
                type="button"
                onClick={handlePaste}
                aria-label="Paste from clipboard"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                {pasteFeedback ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Pasted</span>
                  </>
                ) : (
                  <>
                    <Clipboard className="w-3.5 h-3.5 text-slate-400" />
                    <span>Paste</span>
                  </>
                )}
              </button>
            </div>

            {/* Submit "Get Video" Button */}
            <button
              type="submit"
              disabled={isLoading || !url.trim()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 disabled:opacity-50 disabled:pointer-events-none rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Inspecting...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Get Video</span>
                </>
              )}
            </button>
          </form>

          {/* Validation Error Message */}
          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-950/40 border border-red-500/20 text-left flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-red-300">{error}</p>
                <p className="text-xs text-red-400/80 mt-1">
                  Downloads for this link are not currently supported. You can open the original post or try another supported source.
                </p>
              </div>
            </div>
          )}

          {/* Sample Links Quick Selector */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="text-slate-500 font-medium">Try sample links:</span>
            {SAMPLE_LINKS.map((sample) => (
              <button
                key={sample.label}
                type="button"
                onClick={() => {
                  setUrl(sample.url);
                  onInspect(sample.url);
                }}
                className="px-2.5 py-1 rounded-md bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/5 transition-colors cursor-pointer whitespace-nowrap"
              >
                {sample.label}
              </button>
            ))}
          </div>

          {/* Supported platform mini-bar */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Supported Platforms:</span>
            <div className="flex items-center gap-5 sm:gap-6 text-slate-400">
              <span className="hover:text-pink-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="instagram" size={16} /> Instagram
              </span>
              <span className="hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="tiktok" size={16} /> TikTok
              </span>
              <span className="hover:text-blue-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="facebook" size={16} /> Facebook
              </span>
              <span className="hover:text-red-500 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="youtube" size={16} /> YouTube
              </span>
              <span className="hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="twitter" size={16} /> X (Twitter)
              </span>
              <span className="hover:text-red-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="pinterest" size={16} /> Pinterest
              </span>
              <span className="hover:text-orange-400 transition-colors flex items-center gap-1.5 cursor-default">
                <PlatformIcon platform="reddit" size={16} /> Reddit
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
