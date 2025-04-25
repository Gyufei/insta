'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';

import { useState } from 'react';

import { cn } from '@/lib/utils';

interface FeeTier {
  value: string;
  description: string;
}

interface FeeTierSelectorProps {
  selectedTier: string;
  onChange: (tier: string) => void;
}

export default function FeeTierSelector({ selectedTier = '0.3', onChange }: FeeTierSelectorProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
  };

  const feeTiers: FeeTier[] = [
    {
      value: '0.01',
      description: 'Best for very stable pairs.',
    },
    {
      value: '0.05',
      description: 'Best for stable pairs.',
    },
    {
      value: '0.3',
      description: 'Best for most pairs.',
    },
    {
      value: '1',
      description: 'Best for exotic pairs.',
    },
  ];

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      <div className="text-lg font-medium text-primary">Fee tier</div>
      <div className="border border-border rounded-xl">
        <div className="flex flex-row justify-between items-center px-4 py-2">
          <div className="flex-grow flex-shrink min-w-0 flex flex-col gap-1">
            <span className="text-sm text-primary">{selectedTier}% fee tier</span>
            <span className="text-xs font-semibold text-gray-500">The % you will earn in fees</span>
          </div>
          <button
            onClick={handleToggleExpand}
            className="flex flex-row-reverse items-center justify-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-xl max-w-fit border border-transparent"
          >
            <span className="text-xs font-medium text-gray-800 whitespace-nowrap overflow-hidden text-ellipsis">
              {isExpanded ? 'Less' : 'More'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-gray-900 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden w-full"
          >
            <div className="grid grid-cols-2 gap-2">
              {feeTiers.map((tier) => (
                <motion.button
                  key={tier.value}
                  onClick={() => onChange(tier.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'flex flex-col flex-grow w-full p-2 gap-1 rounded-xl border border-border cursor-pointer justify-between transition-colors bg-primary-foreground hover:bg-primary-foreground/80'
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-row justify-between">
                      <span className="text-sm font-medium text-primary">{tier.value}%</span>
                      {selectedTier === tier.value && (
                        <motion.div
                          initial={{ scale: 0.5 }}
                          animate={{ scale: 1 }}
                          className="flex scale-50 -translate-y-[2px] bg-primary rounded-full p-1 text-primary-foreground flex-row justify-between"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>
                    <div className="text-xs text-left font-semibold text-gray-300">
                      {tier.description}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
