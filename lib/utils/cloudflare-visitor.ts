import CryptoJS from 'crypto-js';

interface CloudflareTraceInfo {
  ip?: string;
  timestamp?: string;
  visit_scheme?: string;
  uag?: string;
  colo?: string;
  sliver?: string;
  http?: string;
  loc?: string;
  tls?: string;
  sni?: string;
  warp?: string;
  gateway?: string;
  rbi?: string;
  kex?: string;
}

interface CloudflareVisitorInfo {
  visitorId: string;
  traceInfo: CloudflareTraceInfo;
  headers: Record<string, string>;
  country?: string;
  region?: string;
  city?: string;
  timezone?: string;
  asn?: string;
  isp?: string;
  timestamp: number;
}

/**
 * Cloudflare visitor identification and information gathering
 * Collects Cloudflare-specific data for enhanced user tracking
 */
export class CloudflareVisitorDetector {
  private static instance: CloudflareVisitorDetector;
  private cachedVisitorInfo: CloudflareVisitorInfo | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): CloudflareVisitorDetector {
    if (!CloudflareVisitorDetector.instance) {
      CloudflareVisitorDetector.instance = new CloudflareVisitorDetector();
    }
    return CloudflareVisitorDetector.instance;
  }

  /**
   * Get Cloudflare trace information
   */
  private async getCFTrace(): Promise<CloudflareTraceInfo> {
    try {
      const response = await fetch('/cdn-cgi/trace', {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const text = await response.text();
        const traceInfo: CloudflareTraceInfo = {};

        // Parse the trace response
        text.split('\n').forEach((line) => {
          const [key, value] = line.split('=');
          if (key && value) {
            (traceInfo as Record<string, string>)[key.trim()] = value.trim();
          }
        });

        return traceInfo;
      }
    } catch (error) {
      console.warn('Failed to get Cloudflare trace:', error);
    }

    return {};
  }

  /**
   * Get Cloudflare headers from API
   */
  private async getCFHeaders(): Promise<Record<string, string>> {
    try {
      const response = await fetch('/api/cf-headers', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return data.headers || {};
      }
    } catch (error) {
      console.warn('Failed to get Cloudflare headers:', error);
    }

    return {};
  }

  /**
   * Get Cloudflare country information
   */
  private async getCFCountry(): Promise<{ country?: string; region?: string; city?: string }> {
    try {
      const response = await fetch('/api/cf-country', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          country: data.country,
          region: data.region,
          city: data.city,
        };
      }
    } catch (error) {
      console.warn('Failed to get Cloudflare country info:', error);
    }

    return {};
  }

  /**
   * Extract visitor ID from Cloudflare cookie
   */
  private getCFVisitorCookie(): string | null {
    try {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === '__cflb' || name === '__cfuvid' || name === 'cf_clearance') {
          return value;
        }
      }
    } catch (error) {
      console.warn('Failed to get Cloudflare visitor cookie:', error);
    }
    return null;
  }

  /**
   * Generate fallback visitor ID if Cloudflare data is not available
   */
  private generateFallbackCFVisitorId(): string {
    const data = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timestamp: Date.now(),
      random: Math.random(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const hash = CryptoJS.SHA256(JSON.stringify(data)).toString();
    return `cf_base_${hash.substring(0, 16)}`;
  }

  /**
   * Check if the site is behind Cloudflare
   */
  private async isCloudflareEnabled(): Promise<boolean> {
    try {
      // Try to access Cloudflare trace endpoint
      const response = await fetch('/cdn-cgi/trace', {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get comprehensive Cloudflare visitor information
   */
  public async getCloudflareVisitorInfo(): Promise<CloudflareVisitorInfo> {
    // Return cached result if still valid
    if (this.cachedVisitorInfo && Date.now() < this.cacheExpiry) {
      return this.cachedVisitorInfo;
    }

    try {
      // Check if Cloudflare is enabled
      const isCloudflare = await this.isCloudflareEnabled();

      let visitorId: string;
      let traceInfo: CloudflareTraceInfo = {};
      let headers: Record<string, string> = {};
      let geoInfo: { country?: string; region?: string; city?: string } = {};

      if (isCloudflare) {
        // Get Cloudflare trace information
        traceInfo = await this.getCFTrace();

        // Get Cloudflare headers
        headers = await this.getCFHeaders();

        // Get Cloudflare country information
        geoInfo = await this.getCFCountry();

        // Try to get visitor ID from various sources
        const cookieId = this.getCFVisitorCookie();
        const rayId = headers['cf-ray'] || traceInfo.timestamp;
        const connectingIp = headers['cf-connecting-ip'] || traceInfo.ip;

        if (cookieId) {
          visitorId = `cf_cookie_${CryptoJS.MD5(cookieId).toString()}`;
        } else if (rayId) {
          visitorId = `cf_ray_${CryptoJS.MD5(rayId).toString()}`;
        } else if (connectingIp) {
          visitorId = `cf_ip_${CryptoJS.MD5(connectingIp).toString()}`;
        } else {
          visitorId = this.generateFallbackCFVisitorId();
        }
      } else {
        // Generate fallback visitor ID
        visitorId = this.generateFallbackCFVisitorId();
      }

      // Get additional geolocation info if available
      let timezone: string | undefined;
      let asn: string | undefined;
      let isp: string | undefined;

      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (error) {
        // Ignore
      }

      // Try to get ISP info from headers
      if (headers['cf-ipcountry']) {
        geoInfo.country = headers['cf-ipcountry'];
      }

      const result: CloudflareVisitorInfo = {
        visitorId,
        traceInfo,
        headers,
        country: geoInfo.country,
        region: geoInfo.region,
        city: geoInfo.city,
        timezone,
        asn,
        isp,
        timestamp: Date.now(),
      };

      // Cache the result
      this.cachedVisitorInfo = result;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result;
    } catch (error) {
      console.warn('Failed to get Cloudflare visitor info:', error);

      // Return fallback info
      const fallbackResult: CloudflareVisitorInfo = {
        visitorId: this.generateFallbackCFVisitorId(),
        traceInfo: {},
        headers: {},
        timestamp: Date.now(),
      };

      return fallbackResult;
    }
  }

  /**
   * Get just the Cloudflare visitor ID
   */
  public async getCloudflareVisitorId(): Promise<string> {
    const info = await this.getCloudflareVisitorInfo();
    return info.visitorId;
  }

  /**
   * Get Cloudflare connecting IP
   */
  public async getCFConnectingIP(): Promise<string | null> {
    try {
      const headers = await this.getCFHeaders();
      return headers['cf-connecting-ip'] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get Cloudflare country code
   */
  public async getCFCountryCode(): Promise<string | null> {
    try {
      const headers = await this.getCFHeaders();
      return headers['cf-ipcountry'] || null;
    } catch (error) {
      return null;
    }
  }

  /**
   * Clear cached visitor information
   */
  public clearCache(): void {
    this.cachedVisitorInfo = null;
    this.cacheExpiry = 0;
  }
}

// Export convenience functions
export const getCloudflareVisitorInfo = async (): Promise<CloudflareVisitorInfo> => {
  const detector = CloudflareVisitorDetector.getInstance();
  return detector.getCloudflareVisitorInfo();
};

export const getCloudflareVisitorId = async (): Promise<string> => {
  const detector = CloudflareVisitorDetector.getInstance();
  return detector.getCloudflareVisitorId();
};

export const getCFConnectingIP = async (): Promise<string | null> => {
  const detector = CloudflareVisitorDetector.getInstance();
  return detector.getCFConnectingIP();
};

export const getCFCountryCode = async (): Promise<string | null> => {
  const detector = CloudflareVisitorDetector.getInstance();
  return detector.getCFCountryCode();
};

export const clearCFCache = (): void => {
  const detector = CloudflareVisitorDetector.getInstance();
  detector.clearCache();
};
