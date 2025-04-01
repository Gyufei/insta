import { Mail, X, MessageCircle, BookOpen, Sun } from 'lucide-react';

export default function BarFooter({ isCollapsed }: { isCollapsed: boolean }) {
  return (
    <>
      <div
        className={`mt-10 flex w-full items-center justify-center ${isCollapsed ? 'flex-col space-y-3' : 'space-x-4'}`}
      >
        <a
          href="mailto:info@instadapp.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand dark:hover:text-light flex h-5 w-5 items-center justify-center"
        >
          <Mail className="h-full" />
        </a>
        <a
          href="https://twitter.com/instadapp"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand dark:hover:text-light flex h-5 w-5 items-center justify-center"
        >
          <X className="h-full" />
        </a>
        <a
          href="https://discord.gg/instadapp"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand dark:hover:text-light flex h-5 w-5 items-center justify-center"
        >
          <MessageCircle className="h-full" />
        </a>
        <a
          href="https://docs.instadapp.io"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-brand dark:hover:text-light flex h-5 w-5 items-center justify-center"
        >
          <BookOpen className="h-full" />
        </a>
      </div>
      <hr className="border-grey-light/50 dark:border-grey-light/10 mx-8 my-4 w-9/12" />
      <div className="flex w-full items-center justify-center px-8">
        <div className="hover:text-brand dark:hover:text-light flex w-full cursor-pointer items-center justify-between px-6 leading-none transition-colors duration-150">
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
            className="border-ocean-blue-pure text-12 text-ocean-blue-pure hover:bg-light dark:border-light dark:text-light dark:hover:bg-light/15 flex w-full items-center justify-center rounded-sm border py-2"
          >
            <div className="leading-none">Stay in the loop</div>
          </a>
        </div>
      )}
      {!isCollapsed && (
        <div className="text-grey-pure mt-auto w-full justify-self-end py-4 text-center text-xs">
          v7.1.81
        </div>
      )}
    </>
  );
}
