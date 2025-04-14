import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
  onClick: () => void;
}

export default function SideDrawerBackHeader({ title, onClick }: HeaderProps) {
  return (
    <div
      className="items h-navbar border-gray-200 dark:border-slate-500 relative flex w-full flex-shrink-0 border-b"
      style={{ minHeight: 'var(--height-navbar)' }}
    >
      <div className="mx-auto flex w-full items-center">
        <button onClick={onClick} className="cursor-pointer group text-gray-300 hover:text-primary focus:hover:text-primary dark:hover:text-primary-foreground flex h-full w-20 items-center justify-center pl-3 focus:outline-none">
          <ArrowLeft className="h-4 w-4 transition-transform duration-75 ease-out group-hover:-translate-x-1" />
        </button>
        <div className="text-sm w-full leading-none font-semibold">{title}</div>
      </div>
      <div
        className="to-background dark:to-slate-600 pointer-events-none absolute inset-x-0 h-8 w-full bg-gradient-to-t from-transparent"
        style={{ bottom: '-33px' }}
      ></div>
    </div>
  );
}
