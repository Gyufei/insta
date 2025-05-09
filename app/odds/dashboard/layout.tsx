import DashboardNav from '../components/DashboardNav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <DashboardNav />

      <div className="flex-1 min-w-0 pb-24 lg:pb-8 overflow-auto">
        <div className="h-full p-8">{children}</div>
      </div>
    </div>
  );
}
