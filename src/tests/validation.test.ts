/**
 * Unit & Integration Tests for LinkLoad
 * Tests URL validation, SSRF security guards, platform detection, and adapter handling.
 */

import { validateAndCheckSsrf, sanitizeFilename } from '../server/security';
import { platformManager } from '../server/platformManager';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log('\n--- Running LinkLoad Security & URL Validation Tests ---\n');

  // Test 1: SSRF - Localhost and Loopback blocking
  const local1 = validateAndCheckSsrf('http://127.0.0.1:8080/admin');
  assert(!local1.safe, 'Blocks 127.0.0.1 loopback address');

  const local2 = validateAndCheckSsrf('http://localhost/secret');
  assert(!local2.safe, 'Blocks localhost domain');

  // Test 2: SSRF - Private Class A/B/C and AWS metadata blocking
  const awsMeta = validateAndCheckSsrf('http://169.254.169.254/latest/meta-data/');
  assert(!awsMeta.safe, 'Blocks AWS/Cloud metadata IP (169.254.169.254)');

  const privA = validateAndCheckSsrf('http://10.0.0.1/video.mp4');
  assert(!privA.safe, 'Blocks private Class A IP (10.0.0.1)');

  const privC = validateAndCheckSsrf('http://192.168.1.1/video.mp4');
  assert(!privC.safe, 'Blocks private Class C IP (192.168.1.1)');

  // Test 3: Protocol restriction (only http and https)
  const fileProto = validateAndCheckSsrf('file:///etc/passwd');
  assert(!fileProto.safe, 'Blocks file:// protocol');

  const ftpProto = validateAndCheckSsrf('ftp://example.com/video.mp4');
  assert(!ftpProto.safe, 'Blocks ftp:// protocol');

  // Test 4: Valid public URLs
  const validPublic = validateAndCheckSsrf('https://www.tiktok.com/@creator/video/123456');
  assert(validPublic.safe && validPublic.urlObj !== undefined, 'Accepts valid HTTPS TikTok URL');

  // Test 5: Filename Sanitization & Path Traversal
  const clean1 = sanitizeFilename('../../etc/passwd.mp4');
  assert(!clean1.includes('..') && !clean1.includes('/'), 'Strips directory traversal sequences');

  const clean2 = sanitizeFilename('My Video: Best Reel ever?*#.mp4');
  assert(!clean2.includes(':') && !clean2.includes('?') && !clean2.includes('*'), 'Replaces OS illegal characters');

  console.log('\n--- Running Platform Adapter Matching Tests ---\n');

  // Test 6: Platform detection
  const testCases: Array<{ url: string; expectedPlatform: string }> = [
    { url: 'https://www.instagram.com/reel/C_12345/', expectedPlatform: 'instagram' },
    { url: 'https://www.tiktok.com/@user/video/7123456789', expectedPlatform: 'tiktok' },
    { url: 'https://vt.tiktok.com/ZSsample/', expectedPlatform: 'tiktok' },
    { url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', expectedPlatform: 'youtube' },
    { url: 'https://youtu.be/shorts/aqz-KE-bpKQ', expectedPlatform: 'youtube' },
    { url: 'https://www.facebook.com/reel/123456789', expectedPlatform: 'facebook' },
    { url: 'https://fb.watch/sampleId/', expectedPlatform: 'facebook' },
    { url: 'https://x.com/NASA/status/1789012345678901234', expectedPlatform: 'twitter' },
    { url: 'https://twitter.com/SpaceX/status/1789012345678901235', expectedPlatform: 'twitter' },
    { url: 'https://www.reddit.com/r/aww/comments/17xyz/cute_video/', expectedPlatform: 'reddit' },
    { url: 'https://www.pinterest.com/pin/123456789/', expectedPlatform: 'pinterest' },
    { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', expectedPlatform: 'direct' },
  ];

  for (const tc of testCases) {
    const parsed = new URL(tc.url);
    const adapter = platformManager.getAdapterForUrl(parsed);
    assert(adapter !== null && adapter.id === tc.expectedPlatform, `Correctly matched ${tc.url} to adapter "${tc.expectedPlatform}"`);
  }

  // Test 7: Direct Media inspection
  const directUrl = new URL('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4');
  const directAdapter = platformManager.getAdapterForUrl(directUrl);
  if (directAdapter) {
    const meta = await directAdapter.inspect(directUrl);
    assert(meta.canDownload === true, 'Direct media adapter allows download');
    assert(meta.formats.length >= 2, 'Direct media returns both video and audio formats');
    assert(meta.watermarkDisclosure.length > 10, 'Direct media provides transparent watermark disclosure');
  }

  console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!\n');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
