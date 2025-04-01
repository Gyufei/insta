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
      {children}
      <SideBar />
    </div>
  );
}
