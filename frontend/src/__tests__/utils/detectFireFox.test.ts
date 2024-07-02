import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import isFirefox from '../../utils/detectFireFox';

describe('isFirefox', () => {
  let originalUserAgent: string | undefined;

  beforeEach(() => {
    originalUserAgent = navigator.userAgent;
  });

  afterEach(() => {
    // Restore the original user agent after each test
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      writable: true,
      configurable: true,
    });
  });

  it('should return true for Firefox user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0',
      writable: true,
      configurable: true,
    });

    expect(isFirefox()).toBe(true);
  });

  it('should return false for Chrome user agent', () => {
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      writable: true,
      configurable: true,
    });
    
    expect(isFirefox()).toBe(false);
  });
});
