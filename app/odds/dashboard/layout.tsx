import DashboardNav from '../components/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNav />

      <div className="pb-24 lg:pb-8 overflow-auto">
        <div className="h-full pt-12 pb-8">{children}</div>
      </div>
    </div>
  );
}
