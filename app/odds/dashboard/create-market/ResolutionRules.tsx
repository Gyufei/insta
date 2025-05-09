import Image from 'next/image';

interface ResolutionRulesProps {
  resolutionType: 'date' | 'event';
  resolutionDate: string;
  resolutionEventName: string;
  resolutionSource: 'chainlink' | 'uma';
  resolutionDescription: string;
  onResolutionTypeChange: (type: 'date' | 'event') => void;
  onResolutionDateChange: (date: string) => void;
  onResolutionEventNameChange: (name: string) => void;
  onResolutionSourceChange: (source: 'chainlink' | 'uma') => void;
  onResolutionDescriptionChange: (description: string) => void;
}

export function ResolutionRules({
  resolutionType,
  resolutionDate,
  resolutionEventName,
  resolutionSource,
  resolutionDescription,
  onResolutionTypeChange,
  onResolutionDateChange,
  onResolutionEventNameChange,
  onResolutionSourceChange,
  onResolutionDescriptionChange,
}: ResolutionRulesProps) {
  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-lg font-bold mb-4">Resolution Rules</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Resolution Type</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                resolutionType === 'date'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onResolutionTypeChange('date')}
            >
              <div className="text-lg font-medium">Date Expiration</div>
              <div className="text-sm text-gray-500">Resolve at specific time</div>
            </button>
            <button
              type="button"
              className={`flex flex-col items-center gap-2 p-4 border rounded-lg transition-colors ${
                resolutionType === 'event'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onResolutionTypeChange('event')}
            >
              <div className="text-lg font-medium">Event Driven</div>
              <div className="text-sm text-gray-500">Resolve after event</div>
            </button>
          </div>
        </div>

        {resolutionType === 'date' && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2">Resolution Date</label>
            <input
              type="datetime-local"
              value={resolutionDate}
              onChange={(e) => onResolutionDateChange(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)]"
            />
          </div>
        )}

        {resolutionType === 'event' && (
          <div className="animate-fade-in">
            <label className="block text-sm font-medium mb-2">Resolution Event Name</label>
            <input
              type="text"
              value={resolutionEventName}
              onChange={(e) => onResolutionEventNameChange(e.target.value)}
              placeholder="e.g., Bitcoin ETF Approval"
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)]"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">Resolution Source</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                resolutionSource === 'chainlink'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)] hover:bg-[var(--color-odd-main-light)]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onResolutionSourceChange('chainlink')}
            >
              <Image src="/icons/chainlink_logo.svg" alt="Chainlink" width={16} height={16} />
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-lg transition-colors ${
                resolutionSource === 'uma'
                  ? 'bg-[var(--color-odd-main-light)] border-[var(--color-odd-main)] text-[var(--color-odd-main)] hover:bg-[var(--color-odd-main-light)]'
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onResolutionSourceChange('uma')}
            >
              <Image src="/icons/uma_logo.svg" alt="UMA" width={16} height={16} />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Resolution Description</label>
          <textarea
            value={resolutionDescription}
            onChange={(e) => onResolutionDescriptionChange(e.target.value)}
            placeholder="Explain how the market will be resolved / resolver contract address etc."
            rows={4}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-odd-main-ring)] resize-none"
          />
        </div>
      </div>
    </div>
  );
} 