# LinkLoad — Universal Social Media Video Downloader

LinkLoad is a modern, high-performance web application and modular backend engine designed for inspecting and downloading publicly accessible video content across supported social platforms (Instagram, TikTok, Facebook, YouTube, X/Twitter, Pinterest, Reddit, and direct media sources).

---

## Key Features

1. **Modular Platform Adapter Architecture**
   - Independent service adapters for each social platform (`instagram`, `tiktok`, `youtube`, `facebook`, `twitter`, `reddit`, `pinterest`, `direct`).
   - Domain-specific URL validation, oEmbed integration, metadata extraction, and format inspection.

2. **Transparent Watermark Disclosure**
   - Strictly discloses whether a video contains platform-applied watermarks or clean master streams.
   - Never falsely claims videos are watermark-free without official source or API confirmation.

3. **Enterprise-Grade Security Architecture**
   - **SSRF Defense:** Comprehensive blocklist for private IP ranges (RFC 1918), loopback (`127.0.0.1`), link-local / AWS metadata (`169.254.169.254`), and internal network namespaces.
   - **Protocol Enforcement:** Strictly restricts requests to `http:` and `https:`.
   - **Filename Sanitization:** Path traversal defense (`../`), null byte elimination, and OS-reserved character cleaning.
   - **Rate Limiting:** Sliding-window rate limiter per client IP.
   - **Zero User Link Logging:** No persistent databases storing user submission histories or downloaded media files.

4. **Multi-Format & Audio Extraction**
   - 1080p Full HD, 720p HD, and 480p mobile formats.
   - Standalone high-fidelity audio streams (`.mp3` / `.m4a`).

5. **Modern Responsive Design**
   - Deep navy/black background (`#070a13`) with electric blue and violet glowing accents.
   - Glassmorphic card surfaces and zero-pill typographic discipline.
   - Dynamic real-time platform recognition as you type.
   - One-click sample test links for immediate inspection and streaming verification.

---

## File Structure

```
├── .env.example                     # Environment variable blueprint
├── index.html                       # HTML5 entry with Plus Jakarta Sans & SEO meta
├── metadata.json                    # AI Studio applet manifest
├── package.json                     # Scripts and dependencies
├── server.ts                        # Standalone full-stack Node.js server
├── vite.config.ts                   # Vite configuration with Express API middleware
├── src/
│   ├── App.tsx                      # Root application layout and state
│   ├── main.tsx                     # React 19 entry point
│   ├── index.css                    # Tailwind CSS v4 design layer
│   ├── types/
│   │   └── index.ts                 # Full TypeScript schemas for metadata & platforms
│   ├── components/
│   │   ├── Navbar.tsx               # Top Bar with 1-zone wordmark and clean nav
│   │   ├── HeroDownloader.tsx       # URL input, clipboard paste, and sample links
│   │   ├── VideoResultCard.tsx      # Media preview, format picker & watermark notice
│   │   ├── PlatformMatrix.tsx       # Interactive compatibility grid
│   │   ├── PlatformIcons.tsx        # Vector platform brand icons
│   │   ├── HowItWorks.tsx           # 3-step editorial guide
│   │   ├── SafetyGuards.tsx         # Security & copyright architecture showcase
│   │   ├── FaqSection.tsx           # Accessible accordion for common questions
│   │   ├── Footer.tsx               # Brand, copyright, and legal disclaimers
│   │   └── LegalModals.tsx          # Privacy Policy, Terms, and DMCA dialogs
│   ├── server/
│   │   ├── api.ts                   # Express REST endpoints (/inspect, /download, /platforms)
│   │   ├── security.ts              # SSRF firewall, rate limiting, filename sanitizer
│   │   ├── platformManager.ts       # Adapter orchestrator & capabilities registry
│   │   └── adapters/
│   │       ├── baseAdapter.ts       # Base adapter interface & network utilities
│   │       ├── directMediaAdapter.ts# Direct MP4, WebM, and CC-BY sample streams
│   │       ├── tiktokAdapter.ts     # TikTok oEmbed & watermark disclosure
│   │       ├── youtubeAdapter.ts    # YouTube Shorts & video inspector
│   │       ├── instagramAdapter.ts  # Instagram Reels & public video adapter
│   │       ├── facebookAdapter.ts   # Facebook video & reel adapter
│   │       ├── twitterAdapter.ts    # X / Twitter status video adapter
│   │       ├── redditAdapter.ts     # Reddit v.redd.it & post JSON adapter
│   │       └── pinterestAdapter.ts  # Pinterest video pin adapter
│   └── tests/
│       └── validation.test.ts       # Unit tests for SSRF, sanitization & adapter routing
```

---

## API Endpoints

- `POST /api/video/inspect`
  - Body: `{ "url": "https://..." }`
  - Validates URL, detects platform, returns metadata, formats, and transparent watermark status.
- `GET /api/video/download?url=...&format=...`
  - Streams authorized media files directly with sanitized `Content-Disposition` attachments.
- `GET /api/platforms`
  - Returns capability and support matrix across all platforms.
- `GET /api/health`
  - Service health, uptime, and adapter readiness check.

---

## Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 3. Run Test Suite
```bash
npm test
```
Executes SSRF security, URL validation, and platform adapter test cases.

### 4. Production Build & Start
```bash
npm run build
npm start
```

---

## Configuring Official Platform APIs

For high-volume production deployments, configure official developer credentials in `.env`:

1. **YouTube Data API v3:**
   - Create a project in [Google Cloud Console](https://console.cloud.google.com/).
   - Enable "YouTube Data API v3" and set `YOUTUBE_API_KEY`.
2. **Meta Graph API (Instagram & Facebook):**
   - Register an app in [Meta for Developers](https://developers.facebook.com/).
   - Configure oEmbed Read product and set `META_APP_ID` & `META_APP_SECRET`.
3. **TikTok Creator / Research API:**
   - Apply for API access at [TikTok for Developers](https://developers.tiktok.com/).
   - Set `TIKTOK_CLIENT_KEY` and `TIKTOK_CLIENT_SECRET`.
4. **Reddit Script Application:**
   - Register an app at [Reddit App Preferences](https://www.reddit.com/prefs/apps).
   - Set `REDDIT_CLIENT_ID` and `REDDIT_CLIENT_SECRET`.

---

## Legal & Compliance

LinkLoad is intended for personal archiving, research, and fair-use viewing of public media. Users are responsible for adhering to content copyright laws and terms of service. LinkLoad does not bypass DRM or access private account content.
