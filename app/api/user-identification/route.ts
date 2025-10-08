import { NextRequest, NextResponse } from 'next/server';

interface UserIdentificationData {
  // Wallet information
  walletAddress?: string;
  walletType?: string;
  
  // Browser fingerprint
  browserFingerprint: string;
  
  // IP information
  vpnIP?: string;
  realIP?: string;
  webrtcIPs?: string[];
  
  // Cloudflare information
  cloudflareVisitorId: string;
  cfConnectingIP?: string;
  cfCountry?: string;
  cfRay?: string;
  
  // Browser information
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  platform: string;
  
  // Session information
  sessionId: string;
  timestamp: number;
  
  // Additional metadata
  referrer?: string;
  pageUrl?: string;
  
  // Geolocation (if available)
  country?: string;
  region?: string;
  city?: string;
  
  // Device information
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  
  // Network information
  connectionType?: string;
  isVPN?: boolean;
  isTor?: boolean;
  isProxy?: boolean;
}

/**
 * API endpoint for collecting and storing user identification data
 * Handles comprehensive user tracking including wallet, fingerprint, IP, and Cloudflare data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as UserIdentificationData;
    
    // Validate required fields
    if (!body.browserFingerprint || !body.cloudflareVisitorId || !body.sessionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: browserFingerprint, cloudflareVisitorId, or sessionId',
        },
        { status: 400 }
      );
    }
    
    // Get additional data from request headers
    const headers = request.headers;
    const clientIP = 
      headers.get('cf-connecting-ip') ||
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      'unknown';
    
    const cfCountry = headers.get('cf-ipcountry') || body.cfCountry;
    const cfRay = headers.get('cf-ray') || body.cfRay;
    const userAgent = headers.get('user-agent') || body.userAgent;
    
    // Prepare the identification record
    const identificationRecord = {
      ...body,
      cfConnectingIP: clientIP,
      cfCountry,
      cfRay,
      userAgent,
      timestamp: Date.now(),
      requestId: cfRay || `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    
    // Here you would typically save to a database
    // For now, we'll just log the data and return success
    console.log('User identification data collected:', {
      sessionId: identificationRecord.sessionId,
      walletAddress: identificationRecord.walletAddress ? 
        `${identificationRecord.walletAddress.substring(0, 6)}...${identificationRecord.walletAddress.substring(identificationRecord.walletAddress.length - 4)}` : 
        'none',
      browserFingerprint: identificationRecord.browserFingerprint.substring(0, 16) + '...',
      cloudflareVisitorId: identificationRecord.cloudflareVisitorId.substring(0, 16) + '...',
      vpnIP: identificationRecord.vpnIP,
      realIP: identificationRecord.realIP,
      cfConnectingIP: identificationRecord.cfConnectingIP,
      country: identificationRecord.cfCountry || identificationRecord.country,
      timestamp: identificationRecord.createdAt,
    });
    
    // TODO: Implement actual database storage
    // Example database operations:
    // await saveUserIdentification(identificationRecord);
    // await updateUserSession(identificationRecord.sessionId, identificationRecord);
    // await trackUserActivity(identificationRecord);
    
    // Prepare response
    const responseData = {
      success: true,
      message: 'User identification data collected successfully',
      sessionId: identificationRecord.sessionId,
      requestId: identificationRecord.requestId,
      timestamp: identificationRecord.createdAt,
      // Return some non-sensitive data for confirmation
      collected: {
        hasWallet: !!identificationRecord.walletAddress,
        hasFingerprint: !!identificationRecord.browserFingerprint,
        hasCloudflareId: !!identificationRecord.cloudflareVisitorId,
        hasVPNIP: !!identificationRecord.vpnIP,
        hasRealIP: !!identificationRecord.realIP,
        country: identificationRecord.cfCountry || identificationRecord.country,
        platform: identificationRecord.platform,
        isMobile: identificationRecord.isMobile,
      },
    };
    
    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error in user-identification API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to collect user identification data',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

/**
 * GET endpoint to retrieve user identification data by session ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const walletAddress = searchParams.get('walletAddress');
    
    if (!sessionId && !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing sessionId or walletAddress parameter',
        },
        { status: 400 }
      );
    }
    
    // TODO: Implement actual database retrieval
    // Example database operations:
    // const userData = await getUserIdentificationBySession(sessionId);
    // const userData = await getUserIdentificationByWallet(walletAddress);
    
    // For now, return a mock response
    const mockData = {
      success: true,
      message: 'User identification data retrieved',
      data: {
        sessionId,
        walletAddress,
        hasData: false, // Would be true if data exists in database
        lastSeen: null,
        country: null,
        platform: null,
      },
      timestamp: new Date().toISOString(),
    };
    
    return NextResponse.json(mockData, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
    
  } catch (error) {
    console.error('Error retrieving user identification data:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve user identification data',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}