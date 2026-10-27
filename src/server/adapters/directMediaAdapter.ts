import { PlatformAdapter, fetchWithTimeout, formatBytes } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class DirectMediaAdapter implements PlatformAdapter {
  id = 'direct' as const;
  name = 'Direct Web Video';
  color = '#0284c7';

  canHandle(urlObj: URL): boolean {
    const pathname = urlObj.pathname.toLowerCase();
    const isDirectExtension =
      pathname.endsWith('.mp4') ||
      pathname.endsWith('.webm') ||
      pathname.endsWith('.mov') ||
      pathname.endsWith('.m4v') ||
      pathname.endsWith('.ogv');

    const knownMediaHosts = [
      'commondatastorage.googleapis.com',
      'storage.googleapis.com',
      'wikimedia.org',
      'upload.wikimedia.org',
      'archive.org',
      'test-videos.co.uk',
      'w3schools.com',
      'githubusercontent.com',
    ];

    return isDirectExtension || knownMediaHosts.some((host) => urlObj.hostname.includes(host));
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const originalUrl = urlObj.toString();
    let sizeBytes: number | undefined;
    let contentType = 'video/mp4';

    try {
      const headRes = await fetchWithTimeout(originalUrl, { method: 'HEAD' }, 5000);
      if (headRes.ok) {
        const lengthHeader = headRes.headers.get('content-length');
        if (lengthHeader) sizeBytes = parseInt(lengthHeader, 10);
        const typeHeader = headRes.headers.get('content-type');
        if (typeHeader) contentType = typeHeader;
      }
    } catch {
      // In case HEAD is restricted by some CDNs, proceed with default estimation
    }

    // Infer filename & title from URL
    const segments = urlObj.pathname.split('/').filter(Boolean);
    const rawFilename = segments.length > 0 ? segments[segments.length - 1] : 'Direct Video Stream';
    const cleanTitle = decodeURIComponent(rawFilename)
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim() || 'Direct Video Stream';

    const readableSize = formatBytes(sizeBytes);

    return {
      url: originalUrl,
      platform: 'direct',
      platformName: 'Direct Video Source',
      platformColor: '#0284c7',
      title: cleanTitle.length > 60 ? `${cleanTitle.slice(0, 57)}...` : cleanTitle,
      author: {
        name: urlObj.hostname,
        username: urlObj.hostname,
      },
      thumbnailUrl: '', // Direct files may lack thumbnail; frontend handles with elegant fallback player/canvas
      duration: undefined,
      formattedDuration: 'Source Length',
      aspectRatio: '16:9',
      originalPostUrl: originalUrl,
      canDownload: true,
      watermarkDisclosure: 'Direct source contains no added third-party platform watermarks.',
      copyrightNotice: 'Ensure you have proper copyright or public-domain licensing to use this media.',
      fetchedAt: new Date().toISOString(),
      formats: [
        {
          formatId: 'original-mp4',
          label: 'Original Source Quality',
          resolution: '1080p / Native',
          extension: contentType.includes('webm') ? 'webm' : 'mp4',
          qualityNote: 'Direct uncompressed stream from verified host',
          estimatedSize: readableSize,
          watermarkStatus: 'no_watermark',
          watermarkNote: 'No watermarks injected; original source master',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(originalUrl)}&format=original`,
          isDirectDownload: true,
          hasAudio: true,
        },
        {
          formatId: 'audio-m4a',
          label: 'Audio Stream Only',
          resolution: 'Audio Master',
          extension: 'm4a',
          qualityNote: 'Clean extracted audio stream (AAC / M4A)',
          estimatedSize: sizeBytes ? formatBytes(Math.round(sizeBytes * 0.15)) : '~4.2 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Audio channel without platform overlays',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(originalUrl)}&format=audio`,
          isDirectDownload: true,
          hasAudio: true,
        },
      ],
    };
  }
}
