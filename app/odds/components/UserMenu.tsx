import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, Copy } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ImageWithFallback from "./ImageWithFallback";
import ColorAvatar from "./ColorAvatar";
import { show } from "../utils/message";

const formatAddress = (address: string) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-6)}`;
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    show({
      type: "Success",
      message: "Address copied to clipboard",
      delay: 3000,
    });
  } catch (err) {
    show({
      type: "Error",
      message: "Failed to copy address",
      delay: 3000,
    });
  }
};

export default function UserMenu() {
  const { user, logout, balanceBundle } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showMonadMenu, setShowMonadMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const monadButtonRef = useRef<HTMLButtonElement>(null);
  const monadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setIsOpen(false);
      }
      if (
        monadMenuRef.current &&
        !monadMenuRef.current.contains(target) &&
        monadButtonRef.current &&
        !monadButtonRef.current.contains(target)
      ) {
        setShowMonadMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex items-center gap-2">
      {/* User Menu */}
      {user ? (
        <>
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-lg"
            >
              {user.avatar ? (
                <ImageWithFallback
                  src={user.avatar}
                  alt={user.username}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <ColorAvatar name={user.username} className="w-8 h-8" />
              )}
              <span className="w-4">
                <svg
                  viewBox="0 0 24 24"
                  className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  <path
                    fill="currentColor"
                    d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
                  />
                </svg>
              </span>
            </button>

            {isOpen && (
              <div className="absolute right-0 top-full mt-1 w-[210px] bg-white rounded-lg shadow-lg border overflow-hidden z-50">
                <div className="p-4 border-b">
                  <div className="flex items-center">
                    <div>
                      <div className="font-medium mb-1">{user.username}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        {formatAddress(user.address)}
                        <button
                          onClick={() => copyToClipboard(user.address)}
                          className="hover:text-gray-900"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8 mt-2 pt-2">
                    <div>
                      <div className="text-xl font-bold text-green-600">
                        ${balanceBundle.tradingBalance}
                      </div>
                      <div className="text-sm text-gray-500">Balance</div>
                    </div>
                  </div>
                </div>

                <div className="py-2">
                  {/* <Link
                to="/profile"
                className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link> */}
                  <Link
                    to="/dashboard"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Settings
                  </Link>
                  <Link
                    to="/docs"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-2 hover:bg-[var(--color-odd-main-light)] hover:text-[var(--color-odd-main)]"
                    onClick={() => setIsOpen(false)}
                  >
                    Documentation
                  </Link>
                </div>

                <div className="border-t">
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
