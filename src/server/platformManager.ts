import { PlatformAdapter } from './adapters/baseAdapter';
import { DirectMediaAdapter } from './adapters/directMediaAdapter';
import { TikTokAdapter } from './adapters/tiktokAdapter';
import { YouTubeAdapter } from './adapters/youtubeAdapter';
import { InstagramAdapter } from './adapters/instagramAdapter';
import { FacebookAdapter } from './adapters/facebookAdapter';
import { TwitterAdapter } from './adapters/twitterAdapter';
import { RedditAdapter } from './adapters/redditAdapter';
import { PinterestAdapter } from './adapters/pinterestAdapter';
import { PlatformCapability, PlatformId } from '../types';

export class PlatformManager {
  private adapters: PlatformAdapter[];

  constructor() {
    this.adapters = [
      new DirectMediaAdapter(),
      new TikTokAdapter(),
      new YouTubeAdapter(),
      new InstagramAdapter(),
      new FacebookAdapter(),
      new TwitterAdapter(),
      new RedditAdapter(),
      new PinterestAdapter(),
    ];
  }

  public getAdapterForUrl(urlObj: URL): PlatformAdapter | null {
    for (const adapter of this.adapters) {
      if (adapter.canHandle(urlObj)) {
        return adapter;
      }
    }
    return null;
  }

  public getCapabilities(): PlatformCapability[] {
    return [
      {
        id: 'instagram',
        name: 'Instagram',
        domainPattern: 'instagram.com/reel/*, /p/*',
        examples: [
          'https://www.instagram.com/reel/C_ample123/',
          'https://www.instagram.com/p/DBample456/',
        ],
        supportedTypes: ['Reels', 'Public Video Posts', 'Audio Tracks'],
        maxResolution: '1080p (1080x1920)',
        watermarkPolicy: 'Clean direct master (no added stamps in raw streams)',
        status: 'active',
        statusDescription: 'Public reels and posts verified. Private accounts require owner access.',
        accentColor: '#e1306c',
      },
      {
        id: 'tiktok',
        name: 'TikTok',
        domainPattern: 'tiktok.com/@user/video/*, vt.tiktok.com/*',
        examples: [
          'https://www.tiktok.com/@nationalgeographic/video/7312345678901234567',
          'https://vt.tiktok.com/ZSsample123/',
        ],
        supportedTypes: ['Shorts', 'Mobile Clips', 'Sounds & Audio'],
        maxResolution: '1080p HD',
        watermarkPolicy: 'Platform watermark preserved for creator attribution. Watermark-free via official Creator API.',
        status: 'active',
        statusDescription: 'Full public inspection supported. Watermarks transparently reported.',
        accentColor: '#fe2c55',
      },
      {
        id: 'facebook',
        name: 'Facebook',
        domainPattern: 'facebook.com/reel/*, /watch, fb.watch/*',
        examples: [
          'https://www.facebook.com/reel/123456789012345',
          'https://fb.watch/sampleVideoId/',
        ],
        supportedTypes: ['Facebook Reels', 'Public Videos', 'Watch Streams'],
        maxResolution: '1080p HD',
        watermarkPolicy: 'Clean stream without dynamic watermarks',
        status: 'active',
        statusDescription: 'Public videos and page reels supported.',
        accentColor: '#1877f2',
      },
      {
        id: 'youtube',
        name: 'YouTube',
        domainPattern: 'youtube.com/watch?v=*, youtu.be/*, /shorts/*',
        examples: [
          'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
          'https://youtu.be/shorts/123456789',
        ],
        supportedTypes: ['Shorts', 'Standard Videos', 'Audio (MP3)'],
        maxResolution: '1080p Full HD',
        watermarkPolicy: 'No added stamps; subject to YouTube Terms & creator permissions',
        status: 'active',
        statusDescription: 'Official oEmbed metadata inspection with compliant stream options.',
        accentColor: '#ef4444',
      },
      {
        id: 'twitter',
        name: 'X (Twitter)',
        domainPattern: 'x.com/*/status/*, twitter.com/*/status/*',
        examples: [
          'https://x.com/NASA/status/1789012345678901234',
          'https://twitter.com/SpaceX/status/1789012345678901235',
        ],
        supportedTypes: ['Tweet Videos', 'Broadcast Clips', 'GIFs'],
        maxResolution: '1080p Full HD',
        watermarkPolicy: 'No platform watermarks',
        status: 'active',
        statusDescription: 'Public status videos and clip extracts supported.',
        accentColor: '#38bdf8',
      },
      {
        id: 'reddit',
        name: 'Reddit',
        domainPattern: 'reddit.com/r/*/comments/*, v.redd.it/*',
        examples: [
          'https://www.reddit.com/r/aww/comments/17xyz/sample_cute_dog_playing/',
          'https://v.redd.it/samplemedia123',
        ],
        supportedTypes: ['v.redd.it Videos', 'Subreddit Clips', 'Audio Streams'],
        maxResolution: '1080p HD',
        watermarkPolicy: 'No watermarks; audio and video multiplexed on demand',
        status: 'active',
        statusDescription: 'Public subreddit video submissions supported.',
        accentColor: '#ff4500',
      },
      {
        id: 'pinterest',
        name: 'Pinterest',
        domainPattern: 'pinterest.com/pin/*, pin.it/*',
        examples: [
          'https://www.pinterest.com/pin/123456789012345678/',
          'https://pin.it/samplePin789',
        ],
        supportedTypes: ['Video Pins', 'Idea Pins', 'Vertical Stories'],
        maxResolution: '1080x1920 (9:16)',
        watermarkPolicy: 'No visual watermark stamps added',
        status: 'active',
        statusDescription: 'Public video and idea pins supported.',
        accentColor: '#e60023',
      },
      {
        id: 'direct',
        name: 'Direct Media & Samples',
        domainPattern: '*.mp4, *.webm, *.mov, public media archives',
        examples: [
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        ],
        supportedTypes: ['Direct MP4', 'WebM', 'M4A Audio', 'Open Movie Media'],
        maxResolution: 'Original Source (Up to 4K)',
        watermarkPolicy: 'Pure original master without modifications',
        status: 'active',
        statusDescription: 'Full direct high-speed streaming and instant download ready.',
        accentColor: '#0284c7',
      },
    ];
  }
}

export const platformManager = new PlatformManager();
