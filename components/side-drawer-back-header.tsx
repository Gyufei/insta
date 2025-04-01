import { ArrowLeft } from 'lucide-react';

interface HeaderProps {
  title: string;
}

export default function SideDrawerBackHeader({ title }: HeaderProps) {
  return (
    <div
      className="items h-navbar border-grey-light dark:border-dark-600 relative flex w-full flex-shrink-0 border-b 2xl:hidden"
      style={{ minHeight: 'var(--height-navbar)' }}
    >
      <div className="mx-auto flex w-full items-center">
        <button className="group text-grey-pure hover:text-brand focus:hover:text-brand dark:hover:text-light flex h-full w-20 items-center justify-center pl-3 focus:outline-none">
          <ArrowLeft className="h-4 w-4 transition-transform duration-75 ease-out group-hover:-translate-x-1" />
        </button>
        <div className="text-14 w-full leading-none font-semibold">{title}</div>
      </div>
      <div
        className="to-background dark:to-dark-500 pointer-events-none absolute inset-x-0 h-8 w-full bg-gradient-to-t from-transparent"
        style={{ bottom: '-33px' }}
      ></div>
    </div>
  );
}
