import SideDrawer from '../side-drawer';
import MbHeader from './mb-header';
import SideBar from './sidebar';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="app"
      className="min-w-app text-navi-pure dark:text-light relative grid w-full flex-1 overflow-hidden text-sm font-semibold"
      data-v-ead27774=""
    >
      <MbHeader />
      <div
        className="grid-main dark:bg-dark-600 relative flex flex-grow flex-col overflow-x-hidden 2xl:bg-white"
        data-v-ead27774=""
      >
        {children}
      </div>

      <SideDrawer />
      <SideBar />
    </div>
  );
}
