import { X } from 'lucide-react';

import { useRef } from 'react';

import { useRouter } from 'next/navigation';

interface SearchResult {
  id: string;
  title: string;
  image: string;
  volume: string;
  outcomes?: {
    yes?: string;
    no?: string;
  };
}

interface SearchSuggestionsProps {
  query: string;
  isLoading: boolean;
  results: SearchResult[];
  onClose: () => void;
  onNavigate: () => void;
}

export default function SearchSuggestions({
  query,
  isLoading,
  results,
  onClose,
  onNavigate,
}: SearchSuggestionsProps) {
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const handleMarketClick = (id: string) => {
    router.push(`/odds/market/${id}`);
    onNavigate();
  };

  if (!query) return null;

  return (
    <div
      ref={suggestionsRef}
      id="search-suggestions"
      className="absolute top-full left-0 right-0 bg-white rounded-lg shadow-lg border mt-2 z-50"
    >
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">RESULTS</span>
          <span className="text-sm text-gray-400">({results.length})</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>
      {isLoading ? (
        <div className="p-8 text-center">
          <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <div className="text-gray-500">Searching...</div>
        </div>
      ) : results.length > 0 ? (
        <div className="divide-y max-h-[400px] overflow-y-auto">
          {results.map((result) => (
            <div key={result.id} className="flex items-start gap-4 p-4 hover:bg-gray-50">
              <div className="flex-1 min-w-0">
                <div
                  className="font-medium text-gray-900 overflow-hidden mb-1 cursor-pointer hover:text-[var(--color-odd-main)]"
                  onClick={() => handleMarketClick(result.id)}
                >
                  <div className="whitespace-nowrap hover:animate-marquee">{result.title}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 flex items-center gap-1">
                    <span className="text-gray-400">📊</span>
                    {result.volume}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          No results found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
