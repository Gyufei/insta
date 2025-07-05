export function BetweenCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-shrink-0 gap-3 md:gap-4 overflow-x-auto overflow-y-hidden px-4 md:py-2 pb-3 md:pb-0 2xl:px-12 md:flex-row flex-col">
      {children}
    </div>
  );
}
