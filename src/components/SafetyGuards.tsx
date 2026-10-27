import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2 } from 'lucide-react';

export const SafetyGuards: React.FC = () => {
  return (
    <section id="security" className="py-16 md:py-24 border-t border-white/[0.06] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image showcase with anti-broken image fallback */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-950/40 group">
              <img
                src="/src/assets/images/feature_secure_stream_1793068068350.jpg"
                alt="LinkLoad Secure Transmission Architecture"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-transparent to-transparent opacity-60" />
            </div>
          </div>

          {/* Right Column: Security Principles & Ethics */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-2">
              Security & Creator Integrity
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-6">
              Engineered with Strict Privacy and Compliance Standards
            </h2>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mb-8">
              LinkLoad operates as an ethical media inspection tool. We enforce server-side security checks
              to protect network infrastructure while respecting intellectual property rights and platform terms.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>SSRF & Rebinding Defense</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Incoming requests undergo strict RFC-1918 private subnet checks, loopback prevention, and DNS
                  verification before external network calls are made.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                  <EyeOff className="w-4 h-4 text-purple-400" />
                  <span>Zero Link Retention</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We do not retain submitted links, user IP logs, or personal history. Inspected data is processed
                  in-memory and purged immediately.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                  <Lock className="w-4 h-4 text-emerald-400" />
                  <span>No DRM or Login Circumvention</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  LinkLoad strictly respects private accounts, paywalls, and encryption. If content is private or
                  copyright-restricted, direct viewing links are provided instead.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/60 border border-white/[0.08]">
                <div className="flex items-center gap-2.5 mb-2 text-white font-semibold text-sm">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Transparent Watermark Policy</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We never claim videos are watermark-free unless the authorized official API provides an unmodified
                  master. Creator attribution is respected.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
