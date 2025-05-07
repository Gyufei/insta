import React from "react";
import {
  Layers,
  Star,
  SwatchBook,
  CandlestickChart as ChartCandlestick,
  Settings,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface DashboardNavProps {
  activeView:
    | "portfolio"
    | "watchlist"
    | "settings"
    | "trade"
    | "create-market";
  onViewChange: (
    view: "portfolio" | "watchlist" | "settings" | "trade" | "create-market",
  ) => void;
}

export default function DashboardNav({
  activeView,
  onViewChange,
}: DashboardNavProps) {
  const { isLoggedIn, anonymousFuncs } = useAuth();

  // Define all possible views and their icons
  const allViews = [
    { id: "trade", label: "Trade", icon: Layers },
    { id: "portfolio", label: "Portfolio", icon: SwatchBook },
    { id: "watchlist", label: "Watchlist", icon: Star },
  ];

  // Filter views based on authentication status
  const visibleViews = allViews.filter(
    (view) => isLoggedIn || anonymousFuncs.includes(view.id),
  );

  return (
    <>
      {/* Mobile Navigation */}
      <div className="lg:hidden flex items-center w-full pt-2">
        <div className="flex items-center gap-2 h-16 px-4">
          {visibleViews.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => onViewChange(view.id as any)}
                className={`flex flex-col items-center gap-1 px-4 py-2 ${
                  activeView === view.id
                    ? "bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]"
                    : "text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{view.label}</span>
              </button>
            );
          })}
          {isLoggedIn && (
            <button
              onClick={() => onViewChange("settings")}
              className={`flex flex-col items-center gap-1 px-4 py-2 ${
                activeView === "settings"
                  ? "bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]"
                  : "text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </button>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-64">
        <div className="p-6">
          <h1 className="text-sm font-medium text-gray-500 uppercase">
            Dashboard
          </h1>
          <nav className="mt-6 space-y-1">
            {visibleViews.map((view) => {
              const Icon = view.icon;
              return (
                <button
                  key={view.id}
                  onClick={() => onViewChange(view.id as any)}
                  className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left ${
                    activeView === view.id
                      ? "bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]"
                      : "text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
                  } rounded-lg`}
                >
                  <Icon className="h-5 w-5" />
                  {view.label}
                </button>
              );
            })}
            {isLoggedIn && (
              <button
                onClick={() => onViewChange("settings")}
                className={`flex items-center gap-3 px-4 py-2 text-sm w-full text-left ${
                  activeView === "settings"
                    ? "bg-[var(--color-odd-main-light)] text-[var(--color-odd-main)]"
                    : "text-[var(--color-nav-text)] hover:text-[var(--color-nav-text-hover)]"
                } rounded-lg`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </button>
            )}
          </nav>
        </div>
      </div>
    </>
  );
}
