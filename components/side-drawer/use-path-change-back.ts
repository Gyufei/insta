import { useEffect, useState } from 'react';

import { usePathname } from 'next/navigation';

import { useSideDrawerStore } from '@/lib/state/side-drawer';

export function usePathChangeBack() {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const { currentComponent, setIsOpen } = useSideDrawerStore();

  useEffect(() => {
    // const firstSegment = pathname.split('/')[1];
    // const prevFirstSegment = prevPathname.split('/')[1];
    const firstSegment = pathname;
    const prevFirstSegment = prevPathname;

    if (prevFirstSegment && firstSegment !== prevFirstSegment) {
      setPrevPathname(pathname);
      handleBack();
    }
  }, [pathname, prevPathname]);

  function handleBack() {
    if (currentComponent?.name === 'Balance') {
      return;
    }

    setIsOpen(false);
  }

  return {
    handleBack,
  };
}
