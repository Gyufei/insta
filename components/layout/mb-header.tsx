import Image from 'next/image';
import Link from 'next/link';

import SidebarToggle from './sidebar-toggle';

export default function MbHeader() {
  return (
    <header
      className="h-navbar grid-navbar flex flex-shrink-0 items-center justify-between bg-primary-foreground px-4 2xl:hidden"
      data-v-ead27774=""
    >
      <Link href="/">
        <Image src="/icons/logo.svg" alt="logo" width={160} height={24} />
      </Link>
      <SidebarToggle />
    </header>
  );
}
