import { Upload, X } from 'lucide-react';
import Image from 'next/image';

interface Outcome {
  id: number;
  name: string;
  photo: string | null;
  order: number;
}

interface MarketDetailsProps {
  marketType: 'binary' | 'multiple';
  staticLink: string;
  initialLiquidity: string;
  liquidityError: string | null;
  outcomes: Outcome[];
  onMarketTypeChange: (type: 'binary' | 'multiple') => void;
  onStaticLinkChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInitialLiquidityChange: (value: string) => void;
  onOutcomeChange: (id: number, name: string) => void;
  onPhotoChange: (id: number, file: File) => void;
  onAddOutcome: () => void;
  onRemoveOutcome: (id: number) => void;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, targetId: number) => void;
}

export function MarketDetails({
  marketType,
  staticLink,
  initialLiquidity,
  liquidityError,
  outcomes,
  onMarketTypeChange,
  onStaticLinkChange,
  onInitialLiquidityChange,
  onOutcomeChange,
  onPhotoChange,
  onAddOutcome,
  onRemoveOutcome,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragLeave,
  onDrop,
}: MarketDetailsProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-bold mb-4">Market Details</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Market Static Link</label>
          <div className="flex rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-[var(--color-odd-main-ring)]">
            <div className="px-4 py-3 bg-gray-50 text-gray-500 border-r select-none">
              /market/
            </div>
            <input
              type="text"
              value={staticLink}
              onChange={onStaticLinkChange}
              placeholder="e.g., bitcoin-100k-2025"
              className="flex-1 px-4 py-3 focus:outline-none"
            />
          </div>
          <div className="mt-1 text-sm text-gray-500">
            This will be used as your market&apos;s permanent URL
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Initial Liquidity</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              min="0"
              value={initialLiquidity}
              onChange={(e) => onInitialLiquidityChange(e.target.value)}
              placeholder="0.00"
              className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)] ${
                liquidityError ? 'border-red-500' : ''
              }`}
            />
          </div>
          {liquidityError && <div className="mt-2 text-red-500 text-sm">{liquidityError}</div>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Market Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => onMarketTypeChange('binary')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                marketType === 'binary'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-lg font-medium">Binary</div>
              <div className="text-sm text-gray-500">Yes/No outcomes</div>
            </button>
            <button
              type="button"
              onClick={() => onMarketTypeChange('multiple')}
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                marketType === 'multiple'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)]'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="text-lg font-medium">Multiple</div>
              <div className="text-sm text-gray-500">Multiple outcomes</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Outcome Entries</label>
          <div className="space-y-3">
            {outcomes
              .sort((a, b) => a.order - b.order)
              .map((outcome, index) => (
                <div
                  key={outcome.id}
                  className="flex items-center gap-3 border rounded-lg p-2 transition-colors"
                  draggable={marketType !== 'binary'}
                  onDragStart={(e) => onDragStart(e, outcome.id)}
                  onDragEnd={onDragEnd}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  onDrop={(e) => onDrop(e, outcome.id)}
                >
                  <div
                    className={`w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center ${
                      marketType === 'binary'
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-move hover:bg-gray-200'
                    }`}
                    title="Drag to reorder"
                  >
                    ⋮⋮
                  </div>
                  <div className="relative">
                    {outcome.photo ? (
                      <div className="relative">
                        <Image
                          src={outcome.photo}
                          alt={`Outcome ${index + 1}`}
                          className="w-12 h-12 rounded-lg object-cover"
                          width={48}
                          height={48}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            onOutcomeChange(outcome.id, outcome.name)
                          }
                          className="absolute -top-1 -right-1 p-0.5 bg-white rounded-full border shadow-sm hover:bg-gray-100"
                        >
                          <X className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                        <Upload className="w-5 h-5 text-gray-400" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) onPhotoChange(outcome.id, file);
                          }}
                        />
                      </label>
                    )}
                  </div>
                  <input
                    type="text"
                    value={outcome.name}
                    onChange={(e) => onOutcomeChange(outcome.id, e.target.value)}
                    placeholder={
                      marketType === 'binary'
                        ? index === 0
                          ? 'Yes'
                          : 'No'
                        : `Outcome ${index + 1} name`
                    }
                    className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)] ${
                      marketType === 'binary' ? 'bg-gray-50 cursor-not-allowed' : ''
                    }`}
                    disabled={marketType === 'binary'}
                  />
                  {outcomes.length > 2 && (
                    <button
                      type="button"
                      onClick={() => onRemoveOutcome(outcome.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2M10 11v6M14 11v6" />
                      </svg>
                    </button>
                  )}
                  {index === outcomes.length - 1 &&
                    outcomes.length < 10 &&
                    marketType === 'multiple' && (
                      <button
                        type="button"
                        onClick={onAddOutcome}
                        className="p-2 text-gray-400 hover:text-[var(--color-odd-main)] rounded-lg transition-colors"
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </button>
                    )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
} 