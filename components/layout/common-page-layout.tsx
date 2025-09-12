import { cn } from '@/lib/utils';

import { PageHeader } from './page-header';
import PageTitle from './page-header/page-title';

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
      <PageHeader />
      <div className="grid-main dark:bg-primary-foreground bg-bg-gray relative flex flex-grow flex-col overflow-hidden">
        <div
          className={cn(
            'scrollbar-hover flex h-full flex-col items-center overflow-x-hidden overflow-y-scroll pt-6',
            pageConClx
          )}
        >
          <div className="w-full h-full rounded-t-xl bg-white overflow-x-auto">
            <div className="md:min-w-[700px] h-full">
              <PageTitle title={title} src={iconSrc} />
              <div className="flex w-full flex-col rounded-t-md bg-white flex-1 pb-4">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
