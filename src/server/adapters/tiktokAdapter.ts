import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class TikTokAdapter implements PlatformAdapter {
  id = 'tiktok' as const;
  name = 'TikTok';
  color = '#fe2c55';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('tiktok.com');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`;

    let title = 'TikTok Video';
    let authorName = 'TikTok Creator';
    let authorUrl = rawUrl;
    let thumbnailUrl = '';
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
      // In case network oEmbed is temporarily unreachable, extract user handle from path
      const match = urlObj.pathname.match(/@([^/]+)/);
      if (match) {
        authorName = `@${match[1]}`;
      }
    }

    return {
      url: rawUrl,
      platform: 'tiktok',
      platformName: 'TikTok',
      platformColor: '#fe2c55',
      title: title || 'TikTok Clip',
      author: {
        name: authorName,
        username: authorName.startsWith('@') ? authorName : `@${authorName.replace(/\s+/g, '').toLowerCase()}`,
        profileUrl: authorUrl,
      },
      thumbnailUrl,
      duration: undefined,
      formattedDuration: 'Reel / Clip',
      aspectRatio: '9:16',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure:
        'Standard platform stream includes official TikTok author watermark and bouncing logo. Verified watermark-free original masters are restricted by TikTok to authorized creators via the official TikTok Creator API.',
      copyrightNotice: 'Content belongs to the creator. Download for personal archival only.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'tiktok-hd-watermark',
          label: 'HD Mobile Video (Platform Master)',
          resolution: '1080x1920 (9:16 Vertical)',
          extension: 'mp4',
          qualityNote: 'Original resolution video with TikTok verified author tag',
          estimatedSize: '~12.5 MB',
          watermarkStatus: 'has_watermark',
          watermarkNote: 'Standard platform watermark is retained to respect creator attribution',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=tiktok-standard`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'tiktok-audio',
          label: 'Original Sound / Music Track',
          resolution: 'Stereo Audio',
          extension: 'mp3',
          qualityNote: 'High fidelity audio soundtrack from this post',
          estimatedSize: '~2.8 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Audio tracks do not contain visual watermark overlays',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=tiktok-audio`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
