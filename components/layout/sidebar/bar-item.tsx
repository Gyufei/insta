import Link from 'next/link';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function BarItem({ icon, name, href, isCollapsed }: { icon: React.ReactNode; name: string; href: string; isCollapsed: boolean }) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-current="page"
      className={cn(
        'flex flex-col dark:text-light',
        isCollapsed ? 'mb-2 mt-4' : '',
        pathname === href ? 'text-brand' : 'text-grey-pure',
      )}
    >
      <div
        data-v-7fd64a2e=""
        className={cn(
          'flex items-center transition-colors duration-300 cursor-pointer select-none group',
          isCollapsed ? 'h-9 w-9 justify-center self-center rounded-xs bg-grey-pure/15' : 'py-4 pr-8 pl-11',
        )}
      >
        <div data-v-7fd64a2e="" className={cn(isCollapsed ? 'h-6 w-6' : 'h-5 w-5')}>
          {icon}
        </div>
        {!isCollapsed && (
          <div
            data-v-7fd64a2e=""
            className="flex-grow ml-4 leading-none transition-colors duration-150 whitespace-nowrap group-hover:text-brand dark:group-hover:text-light"
          >
            {name}
          </div>
        )}
      </div>
      <hr data-v-7fd64a2e="" className="mx-8 my-0 border-opacity-25 border-grey-light dark:border-grey-light/10" />
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
      className={cn('flex flex-col overflow-hidden transition-all duration-300', isCollapsed && isSubOpen && 'shadow-inner')}
    >
      {isCollapsed ? (
        <Popover>
          <PopoverTrigger asChild>
            <div
              data-v-7fd64a2e=""
              className="flex h-9 w-9 justify-center items-center self-center rounded-xs hover:bg-grey-pure hover:bg-opacity-10 cursor-pointer"
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
            className={cn('relative flex items-center py-4 pr-8 cursor-pointer select-none group pl-11', isSubOpen && 'bg-grey-light')}
            onClick={toggleSub}
          >
            {icon}
            <div
              data-v-7fd64a2e=""
              className="flex-grow ml-4 leading-none transition-colors duration-150 whitespace-nowrap group-hover:text-brand dark:group-hover:text-light"
            >
              {name}
            </div>
            <div data-v-7fd64a2e="" className="w-2 h-2 transition-colors duration-150 group-hover:text-brand dark:group-hover:text-light">
              <ChevronDown className={`w-full h-full transition-transform duration-300 ${isSubOpen ? 'rotate-180' : 'rotate-0'}`} />
            </div>
          </div>
          <div
            data-v-7fd64a2e=""
            className={`flex flex-col pr-8 transition-all duration-300 select-none bg-grey-light bg-opacity-38 pl-14 dark:bg-dark-600 ${
              isSubOpen ? 'h-fit' : 'h-0'
            }`}
          >
            {children}
          </div>
        </>
      )}
      <hr data-v-7fd64a2e="" className="my-0 border-grey-light mx-8 border-opacity-50 dark:border-opacity-10" />
    </div>
  );
}
