import { PageHeader } from './page-header';

export function CommonPageLayout({
  title,
  src,
  children,
}: {
  title: string;
  src: string | null;
  children: React.ReactNode;
}) {
  return (
    <div
      className="grid-main dark:bg-slate-500 relative flex flex-grow flex-col overflow-x-hidden 2xl:bg-white"
      data-v-ead27774
    >
      <PageHeader title={title} src={src} />
      <div className="scrollbar-hover 2xl:py-12 flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6">
        <div className="max-w-container-main flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
