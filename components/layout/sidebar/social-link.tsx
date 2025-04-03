import { LucideIcon } from 'lucide-react';

interface SocialLinkProps {
  href: string;
  icon: LucideIcon;
}

export function SocialLink({ href, icon: Icon }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hover:text-brand dark:hover:text-light flex h-5 w-5 items-center justify-center"
    >
      <Icon className="h-full" />
    </a>
  );
} 