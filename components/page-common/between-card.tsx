export function BetweenCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-hover mt-2 flex w-full flex-shrink-0 gap-4 overflow-x-auto overflow-y-hidden px-4 py-2 2xl:mt-3 2xl:gap-6 2xl:px-12 2xl:py-3">
      {children}
    </div>
  );
}
