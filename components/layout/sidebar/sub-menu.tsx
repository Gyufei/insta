import NavLink from './nav-link';
import { cn } from '@/lib/utils';

interface SubMenuItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}

interface SubMenuProps {
  items: SubMenuItem[];
  currentPath: string;
  indent?: boolean;
}

export default function SubMenu({ items, currentPath, indent = false }: SubMenuProps) {
  return (
    <div className={cn('flex flex-col space-y-1', indent && 'mt-1')}>
      {items.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          isActive={currentPath === item.href}
          icon={item.icon}
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}
