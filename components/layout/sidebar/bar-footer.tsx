import { Mail, X, MessageCircle, BookOpen, Sun } from 'lucide-react';

export default function BarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <div className={`mt-10 flex w-full items-center justify-center ${isCollapsed ? 'flex-col space-y-3' : 'space-x-4'}`}>
        <a
          href="mailto:info@instadapp.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-5 w-5 items-center justify-center hover:text-brand dark:hover:text-light"
        >
          <Mail className="h-full" />
        </a>
        <a
          href="https://twitter.com/instadapp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-5 w-5 items-center justify-center hover:text-brand dark:hover:text-light"
        >
          <X className="h-full" />
        </a>
        <a
          href="https://discord.gg/instadapp"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-5 w-5 items-center justify-center hover:text-brand dark:hover:text-light"
        >
          <MessageCircle className="h-full" />
        </a>
        <a
          href="https://docs.instadapp.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-5 w-5 items-center justify-center hover:text-brand dark:hover:text-light"
        >
          <BookOpen className="h-full" />
        </a>
      </div>
      <hr className="my-4 border-grey-light border-opacity-50 dark:border-opacity-10 mx-8 w-9/12" />
      <div className="flex w-full items-center justify-center px-8">
        <div className="flex w-full cursor-pointer items-center leading-none transition-colors duration-150 hover:text-brand dark:hover:text-light justify-between px-6">
          <Sun className="h-5" />
          {!isCollapsed && <div className="ml-4 whitespace-nowrap">Switch to dark</div>}
        </div>
      </div>
      {!isCollapsed && (
        <div className="mt-12 w-full px-8">
          <a
            href="https://instadapp.io/newsletter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center rounded-sm border border-ocean-blue-pure py-2 text-12 text-ocean-blue-pure hover:bg-light dark:border-light dark:text-light dark:hover:bg-opacity-17"
          >
            <div className="leading-none">Stay in the loop</div>
          </a>
        </div>
      )}
      {!isCollapsed && <div className="mt-auto w-full justify-self-end py-4 text-center text-xs text-grey-pure">v7.1.81</div>}
    </>
  );
}
