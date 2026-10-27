import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class TwitterAdapter implements PlatformAdapter {
  id = 'twitter' as const;
  name = 'X (Twitter)';
  color = '#38bdf8';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('x.com') || host.includes('twitter.com');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const oembedUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(rawUrl)}`;

    let title = 'X (Twitter) Video Post';
    let authorName = 'X User';
    let authorUrl = rawUrl;
    let hasOfficialData = false;

    try {
      const res = await fetchWithTimeout(oembedUrl, {}, 5000);
      if (res.ok) {
        const json = await res.json();
        if (json.author_name) authorName = json.author_name;
        if (json.author_url) authorUrl = json.author_url;
        // Clean HTML markup from tweet text if present
        if (json.html) {
          const stripped = json.html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
          if (stripped.length > 0) {
            title = stripped.slice(0, 100);
          }
        }
        hasOfficialData = true;
      }
    } catch {
      // Fallback
    }

    return {
      url: rawUrl,
      platform: 'twitter',
      platformName: 'X (Twitter)',
      platformColor: '#38bdf8',
      title,
      author: {
        name: authorName,
        username: `@${authorName.replace(/\s+/g, '').toLowerCase()}`,
        profileUrl: authorUrl,
      },
      thumbnailUrl: '',
      formattedDuration: 'Video Post',
      aspectRatio: '16:9',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure: 'X/Twitter video masters are encoded without platform watermark stamps.',
      copyrightNotice: 'Content is subject to X terms and creator intellectual property.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'x-1080p',
          label: '1080p Full HD Video',
          resolution: '1920x1080',
          extension: 'mp4',
          qualityNote: 'Highest bitrate H.264/AAC rendition',
          estimatedSize: '~15.2 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'No visual stamps added',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=x-1080p`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'x-720p',
          label: '720p HD Video',
          resolution: '1280x720',
          extension: 'mp4',
          qualityNote: 'Standard HD stream',
          estimatedSize: '~8.1 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'No visual stamps added',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=x-720p`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
