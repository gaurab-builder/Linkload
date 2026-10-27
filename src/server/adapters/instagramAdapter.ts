import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class InstagramAdapter implements PlatformAdapter {
  id = 'instagram' as const;
  name = 'Instagram';
  color = '#e1306c';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('instagram.com') || host.includes('instagr.am');
  }

  extractShortcode(urlObj: URL): string | null {
    const match = urlObj.pathname.match(/\/(?:reel|p|tv)\/([^/?#&]+)/);
    return match ? match[1] : null;
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const shortcode = this.extractShortcode(urlObj);
    const isReel = urlObj.pathname.includes('/reel/');

    let title = isReel ? 'Instagram Reel' : 'Instagram Video Post';
    let authorName = 'Instagram Creator';
    let thumbnailUrl = '';
    let hasOfficialData = false;

    // Check Meta Graph / oEmbed endpoint
    try {
      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(rawUrl)}`;
      const res = await fetchWithTimeout(oembedUrl, {}, 5000);
      if (res.ok) {
        const json = await res.json();
        if (json.title) title = json.title;
        if (json.author_name) authorName = json.author_name;
        if (json.thumbnail_url) thumbnailUrl = json.thumbnail_url;
        hasOfficialData = true;
      }
    } catch {
      // Graceful fallback
    }

    return {
      url: rawUrl,
      platform: 'instagram',
      platformName: 'Instagram',
      platformColor: '#e1306c',
      title: title || (shortcode ? `Instagram Post #${shortcode}` : 'Instagram Reel'),
      author: {
        name: authorName,
        username: `@${authorName.replace(/\s+/g, '').toLowerCase()}`,
        profileUrl: authorName !== 'Instagram Creator' ? `https://instagram.com/${authorName}` : rawUrl,
      },
      thumbnailUrl,
      formattedDuration: isReel ? 'Reel Clip' : 'Video Post',
      aspectRatio: isReel ? '9:16' : '1:1',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure:
        'Instagram raw video streams do not include hard-baked logo stamps. If downloaded via the native mobile app share sheet, Instagram may append an author handle overlay.',
      copyrightNotice: 'Respect copyright. Public posts are property of the respective Instagram creator.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'ig-1080p',
          label: 'Original 1080p Video (MP4)',
          resolution: isReel ? '1080x1920' : '1080x1080',
          extension: 'mp4',
          qualityNote: 'Clean video stream with original creator audio sync',
          estimatedSize: isReel ? '~16 MB' : '~11 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Direct feed stream does not inject watermarks',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=ig-1080p`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'ig-audio',
          label: 'Original Audio Track (M4A)',
          resolution: 'Stereo Audio',
          extension: 'm4a',
          qualityNote: 'Isolated background music and dialogue',
          estimatedSize: '~2.1 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Clean extracted audio stream',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=ig-audio`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
