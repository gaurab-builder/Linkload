export type PlatformId =
  | 'instagram'
  | 'tiktok'
  | 'facebook'
  | 'youtube'
  | 'twitter'
  | 'pinterest'
  | 'reddit'
  | 'direct';

export interface AuthorInfo {
  name: string;
  username?: string;
  avatar?: string;
  verified?: boolean;
  profileUrl?: string;
}

export type WatermarkStatus = 'no_watermark' | 'has_watermark' | 'platform_dependent';

export interface VideoFormat {
  formatId: string;
  label: string;
  resolution: string;
  extension: 'mp4' | 'mp3' | 'webm' | 'm4a';
  qualityNote: string;
  estimatedSize?: string;
  watermarkStatus: WatermarkStatus;
  watermarkNote: string;
  downloadUrl: string;
  isDirectDownload: boolean;
  hasAudio: boolean;
}

export interface VideoMetadata {
  url: string;
  platform: PlatformId;
  platformName: string;
  platformColor: string;
  title: string;
  author: AuthorInfo;
  thumbnailUrl: string;
  duration?: number;
  formattedDuration?: string;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5' | 'unknown';
  formats: VideoFormat[];
  originalPostUrl: string;
  canDownload: boolean;
  limitationNotice?: string;
  watermarkDisclosure: string;
  copyrightNotice: string;
  fetchedAt: string;
  verifiedOfficialApi?: boolean;
}

export interface InspectRequest {
  url: string;
}

export interface InspectResponse {
  success: boolean;
  data?: VideoMetadata;
  error?: string;
  errorCode?:
    | 'INVALID_URL'
    | 'UNSUPPORTED_PLATFORM'
    | 'PRIVATE_OR_RESTRICTED'
    | 'MEDIA_NOT_FOUND'
    | 'RATE_LIMITED'
    | 'SERVER_ERROR'
    | 'SSRF_BLOCKED';
  suggestedAction?: string;
  officialUrl?: string;
}

export interface PlatformCapability {
  id: PlatformId;
  name: string;
  domainPattern: string;
  examples: string[];
  supportedTypes: string[];
  maxResolution: string;
  watermarkPolicy: string;
  status: 'active' | 'requires_api_key' | 'view_only';
  statusDescription: string;
  accentColor: string;
}
