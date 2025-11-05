import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint to retrieve Cloudflare country and geolocation information
 * Returns country, region, city and other geographic data from Cloudflare headers
 */
export async function GET(request: NextRequest) {
  try {
    const headers = request.headers;
    
    // Get country from Cloudflare header
    const country = headers.get('cf-ipcountry') || null;
    
    // Get client IP
    const clientIP = 
      headers.get('cf-connecting-ip') ||
      headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      headers.get('x-real-ip') ||
      'unknown';
    
    // Get additional geolocation headers if available
    const region = headers.get('cf-region') || headers.get('cf-region-code') || null;
    const city = headers.get('cf-city') || null;
    const timezone = headers.get('cf-timezone') || null;
    const latitude = headers.get('cf-latitude') || null;
    const longitude = headers.get('cf-longitude') || null;
    const postalCode = headers.get('cf-postal-code') || null;
    const metroCode = headers.get('cf-metro-code') || null;
    const asn = headers.get('cf-asn') || null;
    const asOrganization = headers.get('cf-as-organization') || null;
    
    // Get Cloudflare data center info
    const colo = headers.get('cf-colo') || null;
    const ray = headers.get('cf-ray') || null;
    
    // Try to get additional info from cf-visitor header
    let visitorScheme = null;
    const cfVisitor = headers.get('cf-visitor');
    if (cfVisitor) {
      try {
        const visitorData = JSON.parse(cfVisitor);
        visitorScheme = visitorData.scheme || null;
      } catch (error) {
        console.warn('Failed to parse cf-visitor header:', error);
      }
    }
    
    // Note: Browser timezone will be handled on the client side
    
    // Country code mapping for better display
    const countryNames: Record<string, string> = {
      'US': 'United States',
      'CN': 'China',
      'JP': 'Japan',
      'DE': 'Germany',
      'GB': 'United Kingdom',
      'FR': 'France',
      'CA': 'Canada',
      'AU': 'Australia',
      'BR': 'Brazil',
      'IN': 'India',
      'RU': 'Russia',
      'KR': 'South Korea',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'SE': 'Sweden',
      'CH': 'Switzerland',
      'SG': 'Singapore',
      'HK': 'Hong Kong',
      'TW': 'Taiwan',
      'MX': 'Mexico',
      'AR': 'Argentina',
      'CL': 'Chile',
      'CO': 'Colombia',
      'PE': 'Peru',
      'VE': 'Venezuela',
      'TH': 'Thailand',
      'MY': 'Malaysia',
      'ID': 'Indonesia',
      'PH': 'Philippines',
      'VN': 'Vietnam',
      'BD': 'Bangladesh',
      'PK': 'Pakistan',
      'NG': 'Nigeria',
      'EG': 'Egypt',
      'ZA': 'South Africa',
      'KE': 'Kenya',
      'GH': 'Ghana',
      'MA': 'Morocco',
      'TN': 'Tunisia',
      'DZ': 'Algeria',
      'LY': 'Libya',
      'SD': 'Sudan',
      'ET': 'Ethiopia',
      'UG': 'Uganda',
      'TZ': 'Tanzania',
      'ZW': 'Zimbabwe',
      'BW': 'Botswana',
      'NA': 'Namibia',
      'ZM': 'Zambia',
      'MW': 'Malawi',
      'MZ': 'Mozambique',
      'MG': 'Madagascar',
      'MU': 'Mauritius',
      'SC': 'Seychelles',
      'RE': 'Réunion',
      'YT': 'Mayotte',
    };
    
    const countryName = country ? countryNames[country] || country : null;
    
    // Prepare response data
    const responseData = {
      success: true,
      country,
      countryName,
      region,
      city,
      timezone,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      postalCode,
      metroCode,
      asn,
      asOrganization,
      clientIP,
      colo,
      ray,
      visitorScheme,
      timestamp: new Date().toISOString(),
      requestId: ray || `geo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
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
    console.error('Error in cf-country API:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve country information',
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
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}