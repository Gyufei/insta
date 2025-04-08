import { Mail, X, MessageCircle, BookOpen } from 'lucide-react';
import { ToggleTheme } from './toggle-theme';
import { SocialLink } from './social-link';
import { Version } from './version';

const SOCIAL_LINKS = [
  { href: '', icon: Mail },
  { href: 'https://twitter.com/instadapp', icon: X },
  { href: 'https://discord.gg/instadapp', icon: MessageCircle },
  { href: 'https://docs.instadapp.io', icon: BookOpen },
];

export default function BarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <div
        className={`mt-10 flex w-full items-center justify-center ${isCollapsed ? 'flex-col space-y-3' : 'space-x-4'}`}
      >
        {SOCIAL_LINKS.map((link, index) => (
          <SocialLink key={index} href={link.href} icon={link.icon} />
        ))}
      </div>
      <hr className="border-grey-light/50 dark:border-grey-light/10 mx-8 my-4 w-9/12" />
      <ToggleTheme isCollapsed={isCollapsed} />
      {!isCollapsed && (
        <div className="mt-12 w-full px-8">
          <a
            href="https://instadapp.io/newsletter"
            target="_blank"
            rel="noopener noreferrer"
            className="border-ocean-blue-pure text-xs text-ocean-blue-pure hover:bg-light dark:border-light dark:text-light dark:hover:bg-light/15 flex w-full items-center justify-center rounded-sm border py-2"
          >
            <div className="leading-none">Stay in the loop</div>
          </a>
        </div>
      )}
      {!isCollapsed && <Version version="v7.1.81" />}
    </>
  );
}
