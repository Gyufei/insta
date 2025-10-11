'use client';

import Link from 'next/link';

/**
 * NotFound page: render 404 content centered in the main grid area and ensure the right side drawer is hidden.
 * On mount, it clears any side drawer content and closes the drawer to avoid visual conflicts on this special page.
 */
export default function NotFound() {
  return (
    <div className="grid-main dark:bg-primary-foreground bg-bg-gray relative flex flex-grow flex-col overflow-hidden">
      <div className="flex h-full flex-col items-center">
        <div className="md:min-w-[700px] h-full text-center flex flex-col items-center justify-center bg-white rounded-t-xl">
          <div className="mb-6 text-[80px] font-semibold leading-none text-pro-blue sm:text-[120px]">
            404
          </div>
          <h1 className="mb-4 text-2xl font-semibold text-[#131e40] sm:text-[32px]">
            Page Not Found
          </h1>
          <p className="mb-8 text-sm leading-relaxed text-pro-gray sm:text-base">
            The page you are looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block rounded-lg bg-pro-blue px-8 py-3 text-base font-medium text-white transition-colors hover:bg-[#5a62f7] active:translate-y-px"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
