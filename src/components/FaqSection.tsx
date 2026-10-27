import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FaqItem[] = [
    {
      question: 'Are video downloads and metadata inspections free on LinkLoad?',
      answer:
        'Yes. LinkLoad is completely free for individual users. There are no subscriptions, payment tiers, or hidden rate limits for fair personal usage.',
    },
    {
      question: 'Why do some TikTok or Instagram videos contain an author watermark?',
      answer:
        'When social media platforms generate mobile sharing links, their servers often bake the creator handle and platform logo into the video file. LinkLoad only provides watermark-free versions when an authorized source or official API provides a watermark-free master stream. We never claim a video is watermark-free unless the source confirms it.',
    },
    {
      question: 'Can I download private account videos, paywalled content, or Instagram Stories?',
      answer:
        'No. LinkLoad strictly respects platform privacy bounds, DRM protections, and user account permissions. We only process publicly accessible media links. Private group posts and subscriber-only videos cannot and should not be accessed without account authorization.',
    },
    {
      question: 'How do I save downloaded MP4 videos to my iPhone Camera Roll?',
      answer:
        'On iOS Safari, tap "Download" to trigger the file download. When Safari asks "Do you want to download linkload-video.mp4?", tap Download. Then tap the blue downloads icon in the Safari address bar, select the video, tap the Share icon, and choose "Save Video" to store it directly in your Photos / Camera Roll.',
    },
    {
      question: 'What video and audio formats are supported?',
      answer:
        'LinkLoad supports MP4 (H.264 / AAC) at 1080p, 720p, and 480p, as well as MP3 / M4A for audio-only extracts. Formats depend on what the source platform or creator originally encoded.',
    },
    {
      question: 'What are the legal guidelines regarding video downloading?',
      answer:
        'You are responsible for having permission to download, view, and reuse any content. Videos should only be saved for personal, offline archival, research, or fair-use educational purposes. Commercial reuse without explicit creator consent is prohibited by intellectual property laws.',
    },
  ];

  return (
    <section id="faq" className="py-16 md:py-24 border-t border-white/[0.06] relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
            Got Questions?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Everything you need to know about video resolutions, device saving, and platform policies.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.question}
                className="rounded-xl bg-slate-900/60 border border-white/[0.08] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left gap-4 text-white hover:text-indigo-300 transition-colors cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-white/[0.04]">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
