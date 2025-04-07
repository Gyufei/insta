export function OverviewTitle({ title = 'Overview' }: { title?: string }) {
  return (
    <div className="mt-4 flex w-full flex-shrink-0 justify-between px-4 2xl:mt-0 2xl:px-12">
      <h2 className="hidden text-xl font-medium 2xl:block">{title}</h2>
      <div className="flex-grow"></div>
    </div>
  );
}
