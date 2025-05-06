export function BetweenCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="scrollbar-hover flex w-full flex-shrink-0 gap-4 overflow-x-auto overflow-y-hidden px-4 py-2 2xl:px-12 2xl:py-3">
      {children}
    </div>
  );
}
