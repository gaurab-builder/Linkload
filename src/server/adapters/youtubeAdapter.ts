import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class YouTubeAdapter implements PlatformAdapter {
  id = 'youtube' as const;
  name = 'YouTube';
  color = '#ef4444';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('youtube.com') || host.includes('youtu.be');
  }

  extractVideoId(urlObj: URL): string | null {
    if (urlObj.hostname.includes('youtu.be')) {
      return urlObj.pathname.slice(1).split('?')[0] || null;
    }
    if (urlObj.pathname.includes('/shorts/')) {
      const parts = urlObj.pathname.split('/shorts/');
      return parts[1]?.split('/')[0]?.split('?')[0] || null;
    }
    return urlObj.searchParams.get('v');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const videoId = this.extractVideoId(urlObj);
    const isShort = urlObj.pathname.includes('/shorts/');
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(rawUrl)}&format=json`;

    let title = isShort ? 'YouTube Short' : 'YouTube Video';
    let authorName = 'YouTube Channel';
    let authorUrl = rawUrl;
    let thumbnailUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
    let hasOfficialData = false;

    try {
      const res = await fetchWithTimeout(oembedUrl, {}, 6000);
      if (res.ok) {
        const json = await res.json();
        if (json.title) title = json.title;
        if (json.author_name) authorName = json.author_name;
        if (json.author_url) authorUrl = json.author_url;
        if (json.thumbnail_url) thumbnailUrl = json.thumbnail_url;
        hasOfficialData = true;
      }
    } catch {
      // Fallback if network blocked
    }

    return {
      url: rawUrl,
      platform: 'youtube',
      platformName: 'YouTube',
      platformColor: '#ef4444',
      title,
      author: {
        name: authorName,
        username: `@${authorName.replace(/\s+/g, '').toLowerCase()}`,
        profileUrl: authorUrl,
      },
      thumbnailUrl,
      formattedDuration: isShort ? '< 60 seconds' : 'Standard Length',
      aspectRatio: isShort ? '9:16' : '16:9',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure: 'YouTube streams do not contain platform overlay watermarks; native video master.',
      copyrightNotice:
        'Downloads are subject to YouTube Terms of Service and content creator permissions. For commercial use, use YouTube Studio or official licensing.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'yt-1080p',
          label: '1080p Full HD (MP4)',
          resolution: isShort ? '1080x1920' : '1920x1080',
          extension: 'mp4',
          qualityNote: 'High bit-rate stream via YouTube DASH video container',
          estimatedSize: isShort ? '~14 MB' : '~45 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Standard YouTube encoding contains no visual watermark stamps',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=yt-1080p`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'yt-720p',
          label: '720p HD (MP4)',
          resolution: isShort ? '720x1280' : '1280x720',
          extension: 'mp4',
          qualityNote: 'Optimized standard resolution for all mobile devices',
          estimatedSize: isShort ? '~7 MB' : '~22 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Standard resolution without overlays',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=yt-720p`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'yt-audio',
          label: 'Audio Track (MP3 / 256kbps)',
          resolution: 'High Bitrate Audio',
          extension: 'mp3',
          qualityNote: 'Clear extracted audio track for offline listening',
          estimatedSize: '~3.6 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Pure audio stream',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=yt-audio`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
