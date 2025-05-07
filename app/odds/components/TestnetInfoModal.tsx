import React from 'react';
import { X, Copy } from 'lucide-react';

interface TestnetInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestnetInfoModal({ isOpen, onClose }: TestnetInfoModalProps) {
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`${isOpen ? 'block' : 'hidden'}`}>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[384px] bg-white rounded-2xl p-8 z-50">
        <div className="absolute right-4 top-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Monad Testnet Info</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Network Name</label>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
                <span className="font-medium">Monad Testnet</span>
                <button 
                  onClick={() => handleCopy('Monad Testnet')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Chain ID</label>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
                <span className="font-medium">10143</span>
                <button 
                  onClick={() => handleCopy('10143')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">RPC URL</label>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
                <span className="font-medium">https://testnet-rpc.monad.xyz/</span>
                <button 
                  onClick={() => handleCopy('https://testnet-rpc.monad.xyz/')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Block Explorer URL</label>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
                <span className="font-medium">http://testnet.monadexplorer.com/</span>
                <button 
                  onClick={() => handleCopy('http://testnet.monadexplorer.com/')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency Symbol</label>
              <div className="flex items-center justify-between px-4 py-3 border rounded-lg bg-gray-50">
                <span className="font-medium">MON</span>
                <button 
                  onClick={() => handleCopy('MON')}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}