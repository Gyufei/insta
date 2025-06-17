import { Share2 } from 'lucide-react';

export function BadgeTitle() {
  return (
    <div className="flex sm:items-center lg:items-start gap-x-4 gap-y-5 justify-between flex-col sm:flex-row">
      <div className="flex-1 min-w-0">
        <h1 className="h2 truncate">Tadle Badge Gallery</h1>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        <a
          target="_blank"
          rel="noopener"
          className="cursor-pointer inline-flex relative text-center justify-center items-center font-medium transition-all duration-300 select-none whitespace-nowrap line-clamp-1 disabled:text-elements-disabled disabled:bg-controls-secondary disabled:cursor-not-allowed px-4 h-10 gap-1.5 text-sm leading-5 flex-1 sm:flex-auto border border-[#EBEBEB] text-[#131E40] rounded-[6px] bg-white "
        >
          <Share2 className="h-4 w-4" />
          Share
        </a>
      </div>
    </div>
  );
}
