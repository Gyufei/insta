'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { Balance } from './balance';
import { AccountSetting } from './account-setting';

const SideDrawer = () => {
  const { currentComponent } = useSideDrawerStore();

  const renderContent = () => {
    switch (currentComponent) {
      case 'Balance':
        return <Balance />;
      case 'AccountSetting':
        return (
          <>
            <AccountSetting />
          </>
        );
      default:
        return null;
    }
  };

  if (!currentComponent) {
    return null;
  }

  return (
    <div
      className="grid-sidebar-context absolute inset-y-0 right-0 z-10 flex w-full flex-col overflow-hidden ring-1 ring-black/5 duration-200 2xl:relative 2xl:transform-none dark:shadow-none"
      style={{ maxWidth: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%' }}
      data-v-ead27774=""
    >
      {/* <div
        className="bg-background dark:bg-dark-500 flex h-full flex-col"
        style={{
          width: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)',
        }}
      > */}
      <AnimatePresence mode="wait">
        <motion.div
          className="h-full"
          key={currentComponent}
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: 0 }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 300,
            mass: 0.5,
          }}
        >
          <div
            className="bg-background dark:bg-dark-500 flex h-full flex-col"
            style={{
              width: 'clamp(var(--min-width-app), var(--width-sidebar-context), 100%)',
            }}
          >
            {renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SideDrawer;
