import SideDrawer from '../side-drawer';
import MbHeader from './mb-header';
import AppSidebar from './app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div
        id="app"
        className="min-w-app text-primary dark:text-primary-foreground relative grid w-full flex-1 overflow-hidden text-sm font-semibold"
        data-v-ead27774=""
      >
        <MbHeader />
        <div
          className="grid-main dark:bg-slate-500 relative flex flex-grow flex-col overflow-x-hidden 2xl:bg-white"
          data-v-ead27774=""
        >
          {children}
        </div>

        <SideDrawer />
        <AppSidebar />
      </div>
    </SidebarProvider>
  );
}
