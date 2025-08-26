import { useEffect } from 'react';

import { usePathname } from 'next/navigation';

import { useSideDrawerStore } from './side-drawer';

export function useUrlPathDrawerChange(checkPath: string) {
  const pathname = usePathname();
  const { currentComponent, setIsOpen } = useSideDrawerStore();

  useEffect(() => {
    if (currentComponent?.name === 'Balance') {
      return;
    }

    if (!pathname.startsWith(checkPath)) {
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
