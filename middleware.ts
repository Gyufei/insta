import { NextResponse } from 'next/server';

// 为特定域名设置全站 noindex/nofollow，防止被搜索引擎收录
export function middleware() {
  const isProduction = process.env.NODE_ENV === 'production';
  const isPreview = process.env.NEXT_PUBLIC_IS_PREVIEW === '1';
  const isProd = isProduction && !isPreview;

  if (!isProd) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

// 排除静态资源等不需要中间件处理的路径
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icons/|images/|font/|version.json).*)'],
};
