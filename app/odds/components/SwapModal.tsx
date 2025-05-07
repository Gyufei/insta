import React from 'react';
import { X } from 'lucide-react';

interface SwapModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SwapModal({ isOpen, onClose }: SwapModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[384px] bg-white rounded-2xl p-6 z-50">
        <div className="absolute right-4 top-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full font-medium">Swap</button>
            <button className="px-4 py-1.5 hover:bg-gray-50 rounded-full text-gray-600">Buy</button>
            <button className="px-4 py-1.5 hover:bg-gray-50 rounded-full text-gray-600">Stake</button>
          </div>
        </div>

        <div className="space-y-4">
          {/* First Input */}
          <div className="bg-gray-50 rounded-2xl p-4 border">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">1.55</div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border hover:bg-gray-50">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="font-medium">ETH</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>$5,499</span>
              <span>You have 4.32</span>
            </div>
          </div>

          {/* Swap Icon */}
          <div className="flex justify-center relative">
            <div className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white border rounded-full flex items-center justify-center shadow-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 10l5-5 5 5M7 14l5 5 5-5" />
              </svg>
            </div>
            <div className="h-8"></div>
          </div>

          {/* Second Input */}
          <div className="bg-gray-50 rounded-2xl p-4 border">
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl font-bold">6809.87</div>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border hover:bg-gray-50">
                <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
                <span className="font-medium">tldUSD</span>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between text-gray-500">
              <span>$1.38</span>
              <span>You have none</span>
            </div>
          </div>

          {/* Settings */}
          <div className="flex items-center justify-between mt-6">
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <span className="text-gray-600">1%</span>
              <span className="text-gray-400 text-sm">MAX SLIPPAGE</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <span className="text-gray-600">Fast</span>
              <span className="text-gray-400 text-sm">TRANSACTION FEE</span>
            </button>
          </div>

          {/* Swap Button */}
          <button className="w-full py-3 bg-pink-600 text-white text-base font-medium rounded-2xl hover:bg-pink-700 mt-6">
            Swap
          </button>
        </div>
      </div>
    </>
  );
}