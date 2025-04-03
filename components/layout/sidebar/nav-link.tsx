import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  isActive: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function NavLink({ href, isActive, icon, children }: NavLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'hover:text-brand dark:hover:text-light hover:bg-grey-light/35 dark:hover:bg-dark-600/35 relative flex items-center rounded-sm px-3 py-2',
        isActive && 'text-brand'
      )}
    >
      {icon}
      <div className="leading-none">{children}</div>
    </a>
  );
}
