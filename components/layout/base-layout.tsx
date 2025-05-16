import { SidebarProvider } from '@/components/ui/sidebar';

import SideDrawer from '../side-drawer';
import AppSidebar from './app-sidebar';
import MbHeader from './mb-header';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div
        id="app"
        className="min-w-app text-primary dark:text-primary-foreground relative grid grid-home w-full flex-1 overflow-hidden text-sm font-semibold"
      >
        <MbHeader />
        {children}
        <SideDrawer />
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
}
