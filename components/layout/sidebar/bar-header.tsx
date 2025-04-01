import Image from 'next/image';
import Link from 'next/link';

export default function BarHeader({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <div className="flex flex-shrink-0 items-center" style={{ minHeight: 'var(--height-navbar)' }}>
      <Link
        href="/"
        aria-current="page"
        className="nuxt-link-exact-active nuxt-link-active mt-1 flex w-full justify-center py-2 select-none"
      >
        {isCollapsed ? (
          <Image src="/icons/logo-small.svg" alt="logo" width={40} height={40} />
        ) : (
          <Image src="/icons/logo.svg" alt="logo" width={191} height={22} />
        )}
      </Link>
    </div>
  );
}
