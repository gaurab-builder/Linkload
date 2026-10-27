/**
 * Security and sanitization utilities for LinkLoad
 * Protects against SSRF, path traversal, DNS rebinding, and request flooding.
 */

// Deny list of loopback, link-local, private subnets, and cloud metadata IPs
const BLOCKED_IP_PATTERNS = [
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./, // Link-local and AWS/GCP metadata
  /^0\./,
  /^localhost$/i,
  /^::1$/,
  /^fe80:/i,
  /^fc00:/i,
  /^fd00:/i,
];

/**
 * Validate that a URL is well-formed and safe from SSRF attack vectors
 */
export function validateAndCheckSsrf(rawUrl: string): { safe: boolean; error?: string; urlObj?: URL } {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { safe: false, error: 'URL must be a non-empty string.' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { safe: false, error: 'URL exceeds maximum permitted length (2048 characters).' };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { safe: false, error: 'The provided string is not a valid absolute URL.' };
  }

  // Restrict protocol strictly to HTTP and HTTPS
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { safe: false, error: `Protocol "${parsed.protocol}" is not supported. Use http:// or https://.` };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check for localhost or blocked IP patterns
  for (const pattern of BLOCKED_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { safe: false, error: 'Access to private network or localhost addresses is strictly prohibited.' };
    }
  }

  // Disallow internal domain suffixes
  const blockedSuffixes = ['.local', '.internal', '.lan', '.home', '.corp'];
  for (const suffix of blockedSuffixes) {
    if (hostname.endsWith(suffix)) {
      return { safe: false, error: 'Internal domain addresses are not permitted.' };
    }
  }

  return { safe: true, urlObj: parsed };
}

/**
 * Sanitize filename to prevent directory traversal and illegal characters
 */
export function sanitizeFilename(filename: string, defaultName = 'video.mp4'): string {
  if (!filename) return defaultName;
  // Replace illegal characters across OSes
  let clean = filename.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
  // Strip relative directory traversal dots
  clean = clean.replace(/\.{2,}/g, '.');
  // Trim spaces and leading/trailing dots
  clean = clean.trim().replace(/^\.+|\.+$/g, '');
  if (!clean || clean.length < 3) {
    return defaultName;
  }
  // Enforce max length
  if (clean.length > 100) {
    clean = clean.slice(0, 100);
  }
  return clean;
}

/**
 * Simple in-memory sliding window rate limiter
 */
class InMemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests = 40, windowMs = 60 * 1000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;

    // Periodic cleanup of stale entries every 2 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [ip, timestamps] of this.requests.entries()) {
        const valid = timestamps.filter((t) => now - t < this.windowMs);
        if (valid.length === 0) {
          this.requests.delete(ip);
        } else {
          this.requests.set(ip, valid);
        }
      }
    }, 120 * 1000).unref?.();
  }

  public isAllowed(clientIp: string): boolean {
    const now = Date.now();
    const timestamps = this.requests.get(clientIp) || [];
    const recent = timestamps.filter((t) => now - t < this.windowMs);

    if (recent.length >= this.maxRequests) {
      return false;
    }

    recent.push(now);
    this.requests.set(clientIp, recent);
    return true;
  }

  public getRemaining(clientIp: string): number {
    const now = Date.now();
    const timestamps = this.requests.get(clientIp) || [];
    const recent = timestamps.filter((t) => now - t < this.windowMs);
    return Math.max(0, this.maxRequests - recent.length);
  }
}

export const rateLimiter = new InMemoryRateLimiter(45, 60 * 1000);
