import MbHeader from './mb-header';
import SideBar from './sidebar/sidebar';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="app"
      className="relative grid w-full min-w-app flex-1 overflow-hidden text-sm font-semibold text-navi-pure dark:text-light"
      data-v-ead27774=""
    >
      <MbHeader />
      
      {children}
      <SideBar />
    </div>
  );
}
