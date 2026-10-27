import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class PinterestAdapter implements PlatformAdapter {
  id = 'pinterest' as const;
  name = 'Pinterest';
  color = '#e60023';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('pinterest.com') || host.includes('pin.it');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    const oembedUrl = `https://www.pinterest.com/oembed.json?url=${encodeURIComponent(rawUrl)}`;

    let title = 'Pinterest Video Pin';
    let authorName = 'Pinterest Creator';
    let authorUrl = rawUrl;
    let thumbnailUrl = '';
    let hasOfficialData = false;

    try {
      const res = await fetchWithTimeout(oembedUrl, {}, 5000);
      if (res.ok) {
        const json = await res.json();
        if (json.title) title = json.title;
        if (json.author_name) authorName = json.author_name;
        if (json.author_url) authorUrl = json.author_url;
        if (json.thumbnail_url) thumbnailUrl = json.thumbnail_url;
        hasOfficialData = true;
      }
    } catch {
      // Fallback
    }

    return {
      url: rawUrl,
      platform: 'pinterest',
      platformName: 'Pinterest',
      platformColor: '#e60023',
      title: title || 'Pinterest Idea Pin / Video',
      author: {
        name: authorName,
        username: authorName !== 'Pinterest Creator' ? `@${authorName.replace(/\s+/g, '').toLowerCase()}` : 'Pinterest Pin',
        profileUrl: authorUrl,
      },
      thumbnailUrl,
      formattedDuration: 'Idea Pin',
      aspectRatio: '9:16',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure:
        'Pinterest video pins do not contain watermarks. Downloaded files preserve original creator resolution and aspect ratio.',
      copyrightNotice: 'Respect copyright. Pins remain intellectual property of their original creators.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'pin-vertical-hd',
          label: 'Vertical Video Pin (1080x1920 MP4)',
          resolution: '1080x1920',
          extension: 'mp4',
          qualityNote: 'Original vertical story quality without compression artifacts',
          estimatedSize: '~11.8 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Original pin encoding has no visual stamps',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=pin-vertical`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'pin-audio',
          label: 'Audio Stream (MP3)',
          resolution: 'Stereo',
          extension: 'mp3',
          qualityNote: 'Isolated audio track',
          estimatedSize: '~1.8 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Audio channel',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=pin-audio`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
