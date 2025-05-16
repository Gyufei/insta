import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onClick: () => void;
}

export function SideDrawerBackHeader({ title, onClick }: HeaderProps) {
  return (
    <div className="items h-10 border-border relative flex w-full flex-shrink-0">
      <div className="mx-auto flex w-full items-center">
        <button
          onClick={onClick}
          className="cursor-pointer group text-gray-300 hover:text-primary focus:hover:text-primary dark:hover:text-primary-foreground flex h-full w-20 items-center justify-center pl-3 focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-75 ease-out group-hover:-translate-x-1" />
        </button>
        <div className="text-sm text-primary w-full leading-none font-semibold whitespace-nowrap truncate">
          {title}
        </div>
      </div>
    </div>
  );
}
