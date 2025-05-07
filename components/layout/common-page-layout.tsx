import { cn } from '@/lib/utils';

import { PageHeader } from './page-header';

export function CommonPageLayout({
  title,
  src,
  children,
  pageConClx,
}: {
  title: string;
  src: string | null;
  children: React.ReactNode;
  pageConClx?: string;
}) {
  return (
    <div
      className="grid-main dark:bg-primary-foreground relative flex flex-grow flex-col overflow-x-hidden 2xl:bg-primary-foreground"
      data-v-ead27774
    >
      <PageHeader title={title} src={src} />
      <div
        className={cn(
          'scrollbar-hover 2xl:py-12 flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll py-6',
          pageConClx
        )}
      >
        <div className="max-w-container-main flex w-full flex-col">{children}</div>
      </div>
    </div>
  );
}
