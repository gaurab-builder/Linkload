import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class FacebookAdapter implements PlatformAdapter {
  id = 'facebook' as const;
  name = 'Facebook';
  color = '#1877f2';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('facebook.com') || host.includes('fb.watch') || host.includes('fb.com');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const isReel = urlObj.pathname.includes('/reel/');

    let title = isReel ? 'Facebook Reel' : 'Facebook Public Video';
    let authorName = 'Facebook Page';
    let thumbnailUrl = '';
    let hasOfficialData = false;

    // Check Facebook oEmbed endpoint
    try {
      const oembedUrl = `https://www.facebook.com/plugins/video/oembed.json/?url=${encodeURIComponent(rawUrl)}`;
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
      platform: 'facebook',
      platformName: 'Facebook',
      platformColor: '#1877f2',
      title,
      author: {
        name: authorName,
        username: authorName !== 'Facebook Page' ? authorName : 'Facebook Creator',
      },
      thumbnailUrl,
      formattedDuration: isReel ? 'Short Reel' : 'Video',
      aspectRatio: isReel ? '9:16' : '16:9',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure:
        'Facebook public videos do not embed dynamic watermarks into the video stream. Only publicly accessible videos can be processed; private group posts require viewer authorization.',
      copyrightNotice: 'Ensure compliance with Facebook terms and original creator ownership rights.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'fb-hd',
          label: 'HD High Quality (720p/1080p MP4)',
          resolution: isReel ? '1080x1920' : '1280x720',
          extension: 'mp4',
          qualityNote: 'High definition render with full AAC audio',
          estimatedSize: '~18.5 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Standard Facebook stream has no watermark stamp',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=fb-hd`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'fb-sd',
          label: 'SD Standard Definition (MP4)',
          resolution: isReel ? '480x854' : '640x360',
          extension: 'mp4',
          qualityNote: 'Lightweight format for slower connections or mobile data savings',
          estimatedSize: '~6.8 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Clean stream',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=fb-sd`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
