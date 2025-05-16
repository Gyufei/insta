import { BookOpen, Mail, MessageCircle, Settings, X } from 'lucide-react';

import { cn } from '@/lib/utils';

// 常量定义
const SOCIAL_LINKS = [
  { href: '', icon: Mail },
  { href: 'https://twitter.com/instadapp', icon: X },
  { href: 'https://discord.gg/instadapp', icon: MessageCircle },
  { href: 'https://docs.instadapp.io', icon: BookOpen },
  { href: '/', icon: Settings },
];

export default function BalanceFooterSocial({ className }: { className?: string }) {
  return (
    <div className={cn(`flex w-full items-center justify-center space-x-4 -z-10`, className)}>
      {SOCIAL_LINKS.map((link, index) => (
        <a
          key={index}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-pro-gray hover:text-primary dark:hover:text-primary-foreground flex h-4 w-4 items-center justify-center"
        >
          <link.icon className="h-full" />
        </a>
      ))}
    </div>
  );
}
