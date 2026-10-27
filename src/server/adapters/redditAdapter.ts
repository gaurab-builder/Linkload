import { PlatformAdapter, fetchWithTimeout } from './baseAdapter';
import { VideoMetadata } from '../../types';

export class RedditAdapter implements PlatformAdapter {
  id = 'reddit' as const;
  name = 'Reddit';
  color = '#ff4500';

  canHandle(urlObj: URL): boolean {
    const host = urlObj.hostname.toLowerCase();
    return host.includes('reddit.com') || host.includes('redd.it');
  }

  async inspect(urlObj: URL): Promise<VideoMetadata> {
    const rawUrl = urlObj.toString();
    let title = 'Reddit Video Post';
    let authorName = 'u/redditor';
    let subreddit = 'r/reddit';
    let thumbnailUrl = '';
    let hasOfficialData = false;
    let fallbackMediaUrl = '';

    try {
      // Reddit JSON API
      let jsonUrl = rawUrl.split('?')[0].replace(/\/+$/, '') + '.json';
      const res = await fetchWithTimeout(jsonUrl, {}, 5000);
      if (res.ok) {
        const data = await res.json();
        const post = data?.[0]?.data?.children?.[0]?.data;
        if (post) {
          if (post.title) title = post.title;
          if (post.author) authorName = `u/${post.author}`;
          if (post.subreddit_name_prefixed) subreddit = post.subreddit_name_prefixed;
          if (post.thumbnail && post.thumbnail.startsWith('http')) thumbnailUrl = post.thumbnail;
          if (post.media?.reddit_video?.fallback_url) {
            fallbackMediaUrl = post.media.reddit_video.fallback_url;
          }
          hasOfficialData = true;
        }
      }
    } catch {
      // Fallback
    }

    return {
      url: rawUrl,
      platform: 'reddit',
      platformName: 'Reddit',
      platformColor: '#ff4500',
      title: title || 'Reddit Video Submission',
      author: {
        name: authorName,
        username: subreddit,
        profileUrl: rawUrl,
      },
      thumbnailUrl,
      formattedDuration: 'Reddit Media',
      aspectRatio: '16:9',
      originalPostUrl: rawUrl,
      canDownload: true,
      watermarkDisclosure:
        'Native Reddit (v.redd.it) streams are encoded without watermarks. Audio and video tracks are stored separately by Reddit and multiplexed by LinkLoad for download.',
      copyrightNotice: 'Content is subject to Reddit user agreement and creator copyright.',
      fetchedAt: new Date().toISOString(),
      verifiedOfficialApi: hasOfficialData,
      formats: [
        {
          formatId: 'reddit-muxed-hd',
          label: 'HD Video with Audio Mux (MP4)',
          resolution: '1080p / 720p',
          extension: 'mp4',
          qualityNote: 'Muxed audio/video stream from v.redd.it media host',
          estimatedSize: '~14.2 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Original unmodified source stream',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(fallbackMediaUrl || rawUrl)}&format=reddit-hd`,
          isDirectDownload: false,
          hasAudio: true,
        },
        {
          formatId: 'reddit-audio',
          label: 'Audio Channel Only (MP3)',
          resolution: 'Audio Master',
          extension: 'mp3',
          qualityNote: 'Extracted standalone audio stream',
          estimatedSize: '~2.4 MB',
          watermarkStatus: 'no_watermark',
          watermarkNote: 'Clean sound stream',
          downloadUrl: `/api/video/download?url=${encodeURIComponent(rawUrl)}&format=reddit-audio`,
          isDirectDownload: false,
          hasAudio: true,
        },
      ],
    };
  }
}
