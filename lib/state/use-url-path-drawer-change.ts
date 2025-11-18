import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { useSideDrawerStore } from './side-drawer';

// Allow checking multiple path prefixes so drawer doesn't auto-close
// when invoked from aggregated routes like `/dex`.
export function useUrlPathDrawerChange(checkPath: string | string[]) {
  const pathname = usePathname();
  const { currentComponent, setIsOpen } = useSideDrawerStore();

  useEffect(() => {
    if (currentComponent?.name === 'Balance') {
      return;
    }

    const paths = Array.isArray(checkPath) ? checkPath : [checkPath];
    const onAllowedPath = paths.some((p) => pathname.startsWith(p));
    if (!onAllowedPath) {
      setIsOpen(false);
    }
  }, [pathname, checkPath, currentComponent?.name, setIsOpen]);

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
