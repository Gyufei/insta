import { cn } from '@/lib/utils';

import { PageHeader } from './page-header';

export function CommonPageLayout({
  title,
  iconSrc,
  children,
  pageConClx,
}: {
  title: string;
  iconSrc: string | null;
  children: React.ReactNode;
  pageConClx?: string;
}) {
  return (
    <>
      <PageHeader title={title} src={iconSrc} />
      <div className="grid-main dark:bg-primary-foreground bg-bg-gray relative flex flex-grow flex-col overflow-x-hidden">
        <div
          className={cn(
            'scrollbar-hover sm:py-8 flex h-full flex-col bg-white rounded-t-md items-center overflow-x-hidden overflow-y-scroll py-6',
            pageConClx
          )}
        >
          <div className="max-w-container-main flex w-full flex-col">{children}</div>
        </div>
      </div>
    </>
  );
}
