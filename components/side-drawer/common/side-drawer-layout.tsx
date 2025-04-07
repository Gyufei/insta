export function SideDrawerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
      <div className="mx-auto" style={{ maxWidth: '296px' }}>
        <div className="pt-2 pb-10 sm:pt-4">{children}</div>
      </div>
    </div>
  );
}
