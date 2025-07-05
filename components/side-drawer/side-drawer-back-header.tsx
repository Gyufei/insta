import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onClick: () => void;
}

export function SideDrawerBackHeader({ title, onClick }: HeaderProps) {
  return (
    <div className="items h-16 md:h-10 border-[#ebebeb] relative flex w-full flex-shrink-0">
      <div className="mx-auto flex w-full items-center md:justify-start justify-center relative">
        <button
          onClick={onClick}
          className="cursor-pointer md:static absolute left-0 group text-gray-300 hover:text-primary focus:hover:text-primary dark:hover:text-primary-foreground flex h-full w-auto md:w-20 items-center justify-center pl-4 md:pl-3 focus:outline-none"
        >
          <ArrowLeft className="md:h-4 md:w-4 h-6 w-6 transition-transform text-[#a5adc6] duration-75 ease-out group-hover:-translate-x-1" />
        </button>
        <div className="text-sm text-primary md:text-left text-center w-full leading-none font-semibold whitespace-nowrap truncate">
          {title}
        </div>
      </div>
    </div>
  );
}
