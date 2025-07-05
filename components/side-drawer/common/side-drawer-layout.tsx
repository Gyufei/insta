export function SideDrawerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-hover flex-grow overflow-x-hidden overflow-y-scroll">
      <div className="px-4 md:px-0 md:mx-auto md:max-w-[296px]">
        <div className="pt-2 pb-10 sm:pt-2">{children}</div>
      </div>
    </div>
  );
}
