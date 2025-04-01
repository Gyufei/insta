import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function BarItem({
  icon,
  name,
  href,
  isCollapsed,
}: {
  icon: React.ReactNode;
  name: string;
  href: string;
  isCollapsed: boolean;
}) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-current="page"
      className={cn(
        'dark:text-light flex flex-col',
        isCollapsed ? 'mt-4 mb-2' : '',
        pathname === href ? 'text-brand' : 'text-grey-pure'
      )}
    >
      <div
        data-v-7fd64a2e=""
        className={cn(
          'group flex cursor-pointer items-center transition-colors duration-300 select-none',
          isCollapsed
            ? 'bg-grey-pure/15 h-9 w-9 justify-center self-center rounded-sm'
            : 'py-4 pr-8 pl-11'
        )}
      >
        <div data-v-7fd64a2e="" className={cn(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')}>
          {icon}
        </div>
        {!isCollapsed && (
          <div
            data-v-7fd64a2e=""
            className="group-hover:text-brand dark:group-hover:text-light ml-4 flex-grow leading-none whitespace-nowrap transition-colors duration-150"
          >
            {name}
          </div>
        )}
      </div>
      <hr data-v-7fd64a2e="" className="border-grey-light/25 dark:border-grey-light/10 mx-8 my-0" />
    </Link>
  );
}

export function BarWithSubItem({
  icon,
  name,
  isCollapsed,
  children,
  openSub,
  setOpenSub,
}: {
  icon: React.ReactNode;
  name: string;
  isCollapsed: boolean;
  children: React.ReactNode;
  openSub: string | null;
  setOpenSub: (sub: string | null) => void;
}) {
  const isSubOpen = openSub === name;

  function toggleSub() {
    setOpenSub(isSubOpen ? null : name);
  }

  return (
    <div
      data-v-7fd64a2e=""
      className={cn(
        'flex flex-col overflow-hidden transition-all duration-300',
        isCollapsed && isSubOpen && 'shadow-inner'
      )}
    >
      {isCollapsed ? (
        <Popover>
          <PopoverTrigger asChild>
            <div
              data-v-7fd64a2e=""
              className="hover:bg-grey-pure/10 flex h-9 w-9 cursor-pointer items-center justify-center self-center rounded-sm"
            >
              {icon}
            </div>
          </PopoverTrigger>
          <PopoverContent side="right" align="start" sideOffset={13} className="w-48 p-2">
            {children}
          </PopoverContent>
        </Popover>
      ) : (
        <>
          <div
            data-v-7fd64a2e=""
            className={cn(
              'group relative flex cursor-pointer items-center py-4 pr-8 pl-11 select-none',
              isSubOpen ? 'bg-grey-light/35 text-brand dark:bg-dark-600/35 dark:text-light' : ''
            )}
            onClick={toggleSub}
          >
            {icon}
            <div
              data-v-7fd64a2e=""
              className="group-hover:text-brand dark:group-hover:text-light ml-4 flex-grow leading-none whitespace-nowrap transition-colors duration-150"
            >
              {name}
            </div>
            <div
              data-v-7fd64a2e=""
              className="group-hover:text-brand dark:group-hover:text-light h-2 w-2 transition-colors duration-150"
            >
              <ChevronDown
                className={`h-full w-full transition-transform duration-300 ${isSubOpen ? 'rotate-180' : 'rotate-0'}`}
              />
            </div>
          </div>
          <div
            data-v-7fd64a2e=""
            className={`bg-grey-light/35 dark:bg-dark-600/35 flex flex-col pr-8 pl-14 transition-all duration-300 select-none ${
              isSubOpen ? 'h-fit' : 'h-0'
            }`}
          >
            {children}
          </div>
        </>
      )}
      <hr data-v-7fd64a2e="" className="border-grey-light/50 dark:border-grey-light/10 mx-8 my-0" />
    </div>
  );
}
