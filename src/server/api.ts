import express, { Request, Response } from 'express';
import { validateAndCheckSsrf, sanitizeFilename, rateLimiter } from './security';
import { platformManager } from './platformManager';
import { InspectResponse } from '../types';

export const apiRouter = express.Router();

apiRouter.use(express.json());

// GET /api/health
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'LinkLoad Media Inspection & Processing Engine',
    version: '1.0.0',
    supportedPlatforms: ['instagram', 'tiktok', 'facebook', 'youtube', 'twitter', 'pinterest', 'reddit', 'direct'],
  });
});

// GET /api/platforms
apiRouter.get('/platforms', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: platformManager.getCapabilities(),
  });
});

// POST /api/video/inspect
apiRouter.post('/video/inspect', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';

  // Rate limiting check
  if (!rateLimiter.isAllowed(clientIp)) {
    const errorResponse: InspectResponse = {
      success: false,
      errorCode: 'RATE_LIMITED',
      error: 'Too many requests. Please wait a moment before inspecting another link.',
      suggestedAction: 'Wait 30 seconds and try again.',
    };
    res.status(429).json(errorResponse);
    return;
  }

  const rawUrl = req.body?.url;
  const validation = validateAndCheckSsrf(rawUrl);

  if (!validation.safe || !validation.urlObj) {
    const errorResponse: InspectResponse = {
      success: false,
      errorCode: 'INVALID_URL',
      error: validation.error || 'The provided URL is invalid or inaccessible.',
      suggestedAction: 'Please paste a complete web link starting with https://.',
    };
    res.status(400).json(errorResponse);
    return;
  }

  const urlObj = validation.urlObj;
  const adapter = platformManager.getAdapterForUrl(urlObj);

  if (!adapter) {
    const errorResponse: InspectResponse = {
      success: false,
      errorCode: 'UNSUPPORTED_PLATFORM',
      error: `LinkLoad does not currently have an authorized adapter for "${urlObj.hostname}".`,
      suggestedAction:
        'Downloads for this platform are not supported. Supported sources: Instagram, TikTok, Facebook, YouTube, X (Twitter), Pinterest, Reddit, or direct MP4/WebM video links.',
      officialUrl: urlObj.toString(),
    };
    res.status(422).json(errorResponse);
    return;
  }

  try {
    const metadata = await adapter.inspect(urlObj);
    res.json({
      success: true,
      data: metadata,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown inspection error';
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      error: `Failed to inspect video: ${errorMessage}`,
      suggestedAction: 'You can open the original post to verify if the media is public.',
      officialUrl: urlObj.toString(),
    });
  }
});

// GET /api/video/download
apiRouter.get('/video/download', async (req: Request, res: Response) => {
  const rawUrl = req.query.url as string;
  const format = (req.query.format as string) || 'original';

  const validation = validateAndCheckSsrf(rawUrl);
  if (!validation.safe || !validation.urlObj) {
    res.status(400).send('Invalid or restricted URL.');
    return;
  }

  const urlObj = validation.urlObj;

  // For direct media URLs (e.g. Wikimedia, Google Storage, direct .mp4)
  if (
    urlObj.pathname.toLowerCase().endsWith('.mp4') ||
    urlObj.pathname.toLowerCase().endsWith('.webm') ||
    urlObj.hostname.includes('googleapis.com') ||
    urlObj.hostname.includes('wikimedia.org') ||
    urlObj.hostname.includes('archive.org')
  ) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      const upstream = await fetch(urlObj.toString(), {
        signal: controller.signal,
        headers: {
          'User-Agent': 'LinkLoad/1.0 (+https://linkload.app)',
        },
      });

      clearTimeout(timeout);

      if (!upstream.ok || !upstream.body) {
        res.status(upstream.status).send('Unable to retrieve stream from source host.');
        return;
      }

      const contentType = upstream.headers.get('content-type') || (format.includes('audio') ? 'audio/mp4' : 'video/mp4');
      const filename = sanitizeFilename(
        urlObj.pathname.split('/').pop() || `linkload-video-${Date.now()}.mp4`,
        'linkload-video.mp4'
      );

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

      const contentLength = upstream.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // Stream the response to client
      const reader = upstream.body.getReader();
      const pump = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            res.write(value);
          }
          res.end();
        } catch {
          res.end();
        }
      };
      await pump();
      return;
    } catch (err: unknown) {
      res.status(500).send('Failed to stream media: ' + (err instanceof Error ? err.message : 'Error'));
      return;
    }
  }

  // For social media platforms where direct third-party extraction is restricted by platform DRM or terms:
  // Transparently provide safe redirect or informative response
  res.redirect(urlObj.toString());
});
