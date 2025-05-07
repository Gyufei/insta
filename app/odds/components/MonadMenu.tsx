import React from "react";
import { useModalStore } from "../stores/modalStore";

interface MonadMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MonadMenu({ isOpen, onClose }: MonadMenuProps) {
  const { showTestnetInfo } = useModalStore();

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute right-0 top-full mt-1 w-[220px] bg-white rounded-lg shadow-lg border overflow-hidden z-50">
        <div className="px-4 py-3 font-medium border-b">Monad Testnet</div>
        <div className="py-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              showTestnetInfo();
              onClose();
            }}
            className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
          >
            Add Testnet to wallet
          </a>
          <a
            href="https://testnet.monad.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
            >
              <path
                d="M11.2611 11.6548C10.9917 12.3192 10.5607 12.9477 10.2375 13.4864C10.0041 13.8635 9.82449 14.097 9.82449 14.5639C9.82449 15.354 10.471 16.0004 11.2611 16.0004C12.0512 16.0004 12.6977 15.354 12.6977 14.5639C12.6977 14.097 12.5181 13.8635 12.2847 13.4864C11.9614 12.9477 11.5304 12.3192 11.2611 11.6548Z"
                fill="#5E49C0"
              ></path>
              <path
                d="M12.967 9.67897H12.6976V7.84733C12.6976 5.9259 11.1354 4.34566 9.19597 4.34566H6.93334V4.14813C6.93334 3.64533 6.62806 3.21435 6.19709 3.01682V1.81368C6.34075 1.7239 6.46645 1.5982 6.55623 1.45454H7.34636C7.61572 1.45454 7.83121 1.23905 7.83121 0.969693C7.83121 0.700334 7.61572 0.484846 7.34636 0.484846H6.57419C6.39462 0.19753 6.08934 0 5.71224 0C5.33514 0 5.02986 0.19753 4.85029 0.484846H4.07812C3.80876 0.484846 3.59327 0.700334 3.59327 0.969693C3.59327 1.23905 3.80876 1.45454 4.07812 1.45454H4.85029C4.94007 1.5982 5.06577 1.7239 5.20943 1.81368V3.01682C4.77846 3.21435 4.47318 3.64533 4.47318 4.14813V4.34566H1.60001V7.21882H4.47318V7.41635C4.47318 8.09873 5.02986 8.65541 5.71224 8.65541C6.39462 8.65541 6.9513 8.09873 6.9513 7.41635V7.21882H9.21392C9.55511 7.21882 9.82447 7.48818 9.82447 7.82937V9.66101H9.55511C9.28575 9.66101 9.07026 9.8765 9.07026 10.1459C9.07026 10.4152 9.28575 10.6307 9.55511 10.6307H12.967C13.2364 10.6307 13.4519 10.4152 13.4519 10.1459C13.4519 9.8765 13.2364 9.67897 12.967 9.67897Z"
                fill="#5E49C0"
              ></path>
            </svg>
            $MON Faucet
          </a>
        </div>
      </div>
    </>
  );
}
