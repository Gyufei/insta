interface IPInfo {
  ip: string;
  type: 'public' | 'private' | 'unknown';
  source: 'webrtc' | 'api' | 'header' | 'stun';
}

interface VPNDetectionResult {
  isVPN: boolean;
  confidence: number;
  indicators: string[];
  realIP?: string;
  vpnIP?: string;
}

interface ComprehensiveIPInfo {
  publicIP: string;
  privateIPs: string[];
  realIP?: string;
  vpnDetection: VPNDetectionResult;
  geolocation?: {
    country?: string;
    region?: string;
    city?: string;
    timezone?: string;
  };
  isp?: string;
  timestamp: number;
}

/**
 * Advanced IP detection and VPN identification utility
 * Uses multiple techniques including WebRTC, STUN servers, and API calls
 */
export class IPDetector {
  private static instance: IPDetector;
  private cachedIPInfo: ComprehensiveIPInfo | null = null;
  private cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  // STUN servers for WebRTC IP detection
  private readonly stunServers = [
    'stun:stun.l.google.com:19302',
    'stun:stun1.l.google.com:19302',
    'stun:stun2.l.google.com:19302',
    'stun:stun3.l.google.com:19302',
    'stun:stun4.l.google.com:19302',
    'stun:stun.cloudflare.com:3478',
    'stun:stun.nextcloud.com:443',
  ];

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): IPDetector {
    if (!IPDetector.instance) {
      IPDetector.instance = new IPDetector();
    }
    return IPDetector.instance;
  }

  /**
   * Get all available IP addresses using WebRTC
   */
  private async getWebRTCIPs(): Promise<IPInfo[]> {
    return new Promise((resolve) => {
      const ips: IPInfo[] = [];
      const seenIPs = new Set<string>();

      try {
        const rtcConfig = {
          iceServers: this.stunServers.map(url => ({ urls: url })),
          iceCandidatePoolSize: 10,
        };

        const pc = new RTCPeerConnection(rtcConfig);

        const handleIceCandidate = (event: RTCPeerConnectionIceEvent) => {
          if (event.candidate) {
            const candidate = event.candidate.candidate;
            const ipMatch = candidate.match(/(\d+\.\d+\.\d+\.\d+)/);
            
            if (ipMatch) {
              const ip = ipMatch[1];
              if (!seenIPs.has(ip)) {
                seenIPs.add(ip);
                ips.push({
                  ip,
                  type: this.getIPType(ip),
                  source: 'webrtc',
                });
              }
            }
          }
        };

        pc.onicecandidate = handleIceCandidate;

        // Create data channel to trigger ICE gathering
        pc.createDataChannel('ip-detection');

        // Create offer to start ICE gathering
        pc.createOffer()
          .then(offer => pc.setLocalDescription(offer))
          .catch(() => {
            // Ignore errors, just resolve with what we have
          });

        // Set timeout to resolve after reasonable time
        const timeout = setTimeout(() => {
          pc.close();
          resolve(ips);
        }, 3000);

        // Also resolve when ICE gathering is complete
        pc.onicegatheringstatechange = () => {
          if (pc.iceGatheringState === 'complete') {
            clearTimeout(timeout);
            pc.close();
            resolve(ips);
          }
        };

      } catch (error) {
        console.warn('WebRTC IP detection failed:', error);
        resolve(ips);
      }
    });
  }

  /**
   * Determine IP address type
   */
  private getIPType(ip: string): 'public' | 'private' | 'unknown' {
    const parts = ip.split('.').map(Number);
    
    if (parts.length !== 4 || parts.some(part => isNaN(part) || part < 0 || part > 255)) {
      return 'unknown';
    }

    // Private IP ranges
    if (
      (parts[0] === 10) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 169 && parts[1] === 254) || // Link-local
      (parts[0] === 127) // Loopback
    ) {
      return 'private';
    }

    return 'public';
  }

  /**
   * Get public IP from external API
   */
  private async getPublicIPFromAPI(): Promise<string | null> {
    const apis = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip',
      'https://api.my-ip.io/ip.json',
    ];

    for (const api of apis) {
      try {
        const response = await fetch(api, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          const data = await response.json();
          
          // Different APIs return IP in different formats
          const ip = data.ip || data.origin || data.query || null;
          if (ip && typeof ip === 'string') {
            return ip.trim();
          }
        }
      } catch (error) {
        console.warn(`Failed to get IP from ${api}:`, error);
        continue;
      }
    }

    return null;
  }

  /**
   * Get detailed IP information including geolocation
   */
  private async getDetailedIPInfo(ip: string): Promise<Partial<ComprehensiveIPInfo>> {
    try {
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          geolocation: {
            country: data.country_name,
            region: data.region,
            city: data.city,
            timezone: data.timezone,
          },
          isp: data.org,
        };
      }
    } catch (error) {
      console.warn('Failed to get detailed IP info:', error);
    }

    return {};
  }

  /**
   * Detect VPN usage using multiple indicators
   */
  private async detectVPN(publicIP: string, privateIPs: string[]): Promise<VPNDetectionResult> {
    const indicators: string[] = [];
    let confidence = 0;

    try {
      // Check for multiple public IPs (common with VPN)
      const publicIPs = privateIPs.filter(ip => this.getIPType(ip) === 'public');
      if (publicIPs.length > 1) {
        indicators.push('multiple_public_ips');
        confidence += 30;
      }

      // Check for suspicious IP ranges or known VPN providers
      const vpnIndicators = await this.checkVPNIndicators(publicIP);
      indicators.push(...vpnIndicators.indicators);
      confidence += vpnIndicators.confidence;

      // Check for WebRTC leak protection (common VPN feature)
      if (privateIPs.length === 0) {
        indicators.push('webrtc_blocked');
        confidence += 20;
      }

      // Check for inconsistent geolocation
      const geoCheck = await this.checkGeolocationConsistency(publicIP);
      if (geoCheck.suspicious) {
        indicators.push('geo_inconsistency');
        confidence += geoCheck.confidence;
      }

      // Determine real IP vs VPN IP
      let realIP: string | undefined;
      let vpnIP: string | undefined;

      if (confidence > 50) {
        vpnIP = publicIP;
        // Try to find real IP from WebRTC leaks
        const leakedPublicIPs = privateIPs.filter(ip => 
          this.getIPType(ip) === 'public' && ip !== publicIP
        );
        if (leakedPublicIPs.length > 0) {
          realIP = leakedPublicIPs[0];
          indicators.push('webrtc_leak_detected');
          confidence += 20;
        }
      }

      return {
        isVPN: confidence > 50,
        confidence: Math.min(confidence, 100),
        indicators,
        realIP,
        vpnIP,
      };

    } catch (error) {
      console.warn('VPN detection failed:', error);
      return {
        isVPN: false,
        confidence: 0,
        indicators: ['detection_failed'],
      };
    }
  }

  /**
   * Check for known VPN indicators
   */
  private async checkVPNIndicators(ip: string): Promise<{ indicators: string[]; confidence: number }> {
    const indicators: string[] = [];
    let confidence = 0;

    try {
      // Check against known VPN IP ranges (simplified check)
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        
        // Check ISP/Organization for VPN keywords
        const org = (data.org || '').toLowerCase();
        const vpnKeywords = [
          'vpn', 'proxy', 'hosting', 'datacenter', 'cloud', 'server',
          'digital ocean', 'amazon', 'google cloud', 'microsoft',
          'linode', 'vultr', 'ovh', 'hetzner'
        ];

        for (const keyword of vpnKeywords) {
          if (org.includes(keyword)) {
            indicators.push(`suspicious_org_${keyword.replace(' ', '_')}`);
            confidence += 15;
            break;
          }
        }

        // Check for suspicious ASN
        if (data.asn && typeof data.asn === 'string') {
          const asn = data.asn.toLowerCase();
          if (asn.includes('hosting') || asn.includes('datacenter')) {
            indicators.push('suspicious_asn');
            confidence += 10;
          }
        }
      }
    } catch (error) {
      // Ignore API errors
    }

    return { indicators, confidence };
  }

  /**
   * Check for geolocation inconsistencies
   */
  private async checkGeolocationConsistency(ip: string): Promise<{ suspicious: boolean; confidence: number }> {
    try {
      // Get timezone from browser
      const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Get timezone from IP geolocation
      const response = await fetch(`https://ipapi.co/${ip}/json/`, {
        signal: AbortSignal.timeout(3000),
      });

      if (response.ok) {
        const data = await response.json();
        const ipTimezone = data.timezone;

        if (browserTimezone && ipTimezone && browserTimezone !== ipTimezone) {
          // Check if timezones are in different regions
          const browserRegion = browserTimezone.split('/')[0];
          const ipRegion = ipTimezone.split('/')[0];
          
          if (browserRegion !== ipRegion) {
            return { suspicious: true, confidence: 25 };
          }
        }
      }
    } catch (error) {
      // Ignore errors
    }

    return { suspicious: false, confidence: 0 };
  }

  /**
   * Get comprehensive IP information
   */
  public async getComprehensiveIPInfo(): Promise<ComprehensiveIPInfo> {
    // Return cached result if still valid
    if (this.cachedIPInfo && Date.now() < this.cacheExpiry) {
      return this.cachedIPInfo;
    }

    try {
      // Get IPs from WebRTC
      const webrtcIPs = await this.getWebRTCIPs();
      
      // Get public IP from API
      const apiPublicIP = await this.getPublicIPFromAPI();
      
      // Combine and deduplicate IPs
      const allIPs = [...webrtcIPs];
      if (apiPublicIP) {
        const exists = allIPs.some(ipInfo => ipInfo.ip === apiPublicIP);
        if (!exists) {
          allIPs.push({
            ip: apiPublicIP,
            type: this.getIPType(apiPublicIP),
            source: 'api',
          });
        }
      }

      // Separate public and private IPs
      const publicIPs = allIPs.filter(ipInfo => ipInfo.type === 'public');
      const privateIPs = allIPs.filter(ipInfo => ipInfo.type === 'private').map(ipInfo => ipInfo.ip);
      
      // Use the most reliable public IP
      const primaryPublicIP = apiPublicIP || (publicIPs.length > 0 ? publicIPs[0].ip : '');

      // Detect VPN
      const vpnDetection = await this.detectVPN(primaryPublicIP, [...privateIPs, ...publicIPs.map(ip => ip.ip)]);

      // Get detailed info
      const detailedInfo = primaryPublicIP ? await this.getDetailedIPInfo(primaryPublicIP) : {};

      const result: ComprehensiveIPInfo = {
        publicIP: primaryPublicIP,
        privateIPs,
        realIP: vpnDetection.realIP,
        vpnDetection,
        geolocation: detailedInfo.geolocation,
        isp: detailedInfo.isp,
        timestamp: Date.now(),
      };

      // Cache the result
      this.cachedIPInfo = result;
      this.cacheExpiry = Date.now() + this.CACHE_DURATION;

      return result;

    } catch (error) {
      console.warn('Failed to get comprehensive IP info:', error);
      
      // Return minimal fallback info
      return {
        publicIP: '',
        privateIPs: [],
        vpnDetection: {
          isVPN: false,
          confidence: 0,
          indicators: ['detection_failed'],
        },
        timestamp: Date.now(),
      };
    }
  }

  /**
   * Clear cached IP information
   */
  public clearCache(): void {
    this.cachedIPInfo = null;
    this.cacheExpiry = 0;
  }

  /**
   * Get simple public IP (for quick access)
   */
  public async getPublicIP(): Promise<string> {
    const info = await this.getComprehensiveIPInfo();
    return info.publicIP;
  }

  /**
   * Check if user is likely using VPN
   */
  public async isUsingVPN(): Promise<boolean> {
    const info = await this.getComprehensiveIPInfo();
    return info.vpnDetection.isVPN;
  }
}

// Export convenience functions
export const getComprehensiveIPInfo = async (): Promise<ComprehensiveIPInfo> => {
  const detector = IPDetector.getInstance();
  return detector.getComprehensiveIPInfo();
};

export const getPublicIP = async (): Promise<string> => {
  const detector = IPDetector.getInstance();
  return detector.getPublicIP();
};

export const isUsingVPN = async (): Promise<boolean> => {
  const detector = IPDetector.getInstance();
  return detector.isUsingVPN();
};

export const clearIPCache = (): void => {
  const detector = IPDetector.getInstance();
  detector.clearCache();
};