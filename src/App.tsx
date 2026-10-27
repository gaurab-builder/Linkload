import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroDownloader } from './components/HeroDownloader';
import { VideoResultCard } from './components/VideoResultCard';
import { PlatformMatrix } from './components/PlatformMatrix';
import { HowItWorks } from './components/HowItWorks';
import { SafetyGuards } from './components/SafetyGuards';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { LegalModals } from './components/LegalModals';
import { PlatformCapability, PlatformId, VideoMetadata, InspectResponse } from './types';
import { platformManager } from './server/platformManager';

export default function App() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [capabilities, setCapabilities] = useState<PlatformCapability[]>(platformManager.getCapabilities());
  const [activeLegalModal, setActiveLegalModal] = useState<'privacy' | 'terms' | 'dmca' | 'contact' | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<PlatformId | null>(null);

  // Dynamic URL platform detection while typing
  useEffect(() => {
    if (!url.trim()) {
      setDetectedPlatform(null);
      return;
    }
    const lower = url.toLowerCase();
    if (lower.includes('tiktok.com')) setDetectedPlatform('tiktok');
    else if (lower.includes('instagram.com') || lower.includes('instagr.am')) setDetectedPlatform('instagram');
    else if (lower.includes('youtube.com') || lower.includes('youtu.be')) setDetectedPlatform('youtube');
    else if (lower.includes('facebook.com') || lower.includes('fb.watch') || lower.includes('fb.com')) setDetectedPlatform('facebook');
    else if (lower.includes('x.com') || lower.includes('twitter.com')) setDetectedPlatform('twitter');
    else if (lower.includes('reddit.com') || lower.includes('redd.it')) setDetectedPlatform('reddit');
    else if (lower.includes('pinterest.com') || lower.includes('pin.it')) setDetectedPlatform('pinterest');
    else if (lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.includes('googleapis.com')) setDetectedPlatform('direct');
    else setDetectedPlatform(null);
  }, [url]);

  // Load backend capabilities on mount
  useEffect(() => {
    fetch('/api/platforms')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setCapabilities(json.data);
        }
      })
      .catch(() => {
        // Fallback already preloaded
      });
  }, []);

  const handleInspect = async (targetUrl?: string) => {
    const rawToInspect = targetUrl || url;
    if (!rawToInspect.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/video/inspect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: rawToInspect.trim() }),
      });

      const data: InspectResponse = await res.json();

      if (!res.ok || !data.success || !data.data) {
        setError(data.error || 'Failed to inspect link. Please ensure the post is publicly accessible.');
        setMetadata(null);
      } else {
        setMetadata(data.data);
        setError(null);
        // Smooth scroll to result
        setTimeout(() => {
          window.scrollTo({
            top: 480,
            behavior: 'smooth',
          });
        }, 100);
      }
    } catch (err: unknown) {
      setError(
        'Unable to connect to inspection server. Please check your network connection and try again.'
      );
      setMetadata(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSample = (sampleUrl: string) => {
    setUrl(sampleUrl);
    handleInspect(sampleUrl);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-200 selection:bg-indigo-500 selection:text-white flex flex-col justify-between">
      <div>
        {/* Navigation Bar */}
        <Navbar onSelectSample={handleSelectSample} onOpenLegal={setActiveLegalModal} />

        {/* Hero & Downloader Section */}
        <HeroDownloader
          url={url}
          setUrl={setUrl}
          isLoading={isLoading}
          onInspect={handleInspect}
          error={error}
          detectedPlatform={detectedPlatform}
        />

        {/* Video Result Card */}
        {metadata && <VideoResultCard metadata={metadata} />}

        {/* Supported Platforms Directory */}
        <PlatformMatrix capabilities={capabilities} onSelectSample={handleSelectSample} />

        {/* How It Works */}
        <HowItWorks />

        {/* Safety & Compliance Section */}
        <SafetyGuards />

        {/* FAQ Accordion */}
        <FaqSection />
      </div>

      {/* Footer */}
      <Footer onOpenLegal={setActiveLegalModal} />

      {/* Legal & Compliance Modals */}
      <LegalModals activeModal={activeLegalModal} onClose={() => setActiveLegalModal(null)} />
    </div>
  );
}
