import { Loader2, X } from 'lucide-react';

import React, { useEffect, useMemo, useState } from 'react';

import { MonUSD } from '@/config/tokens';

import { useCheckMonadAllowance } from '@/lib/data/use-monad-allowance';
import { useAccountStore } from '@/lib/state/account';

type TransferDirection = 'F2T' | 'T2F';

const TransferApproveAddress = '0x734D5aB96eEAFE1F8BA36186627FAd08E7fF7026';

interface TransferConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  maxAmount: string;
  direction: TransferDirection;
  isAwaitingConfirm?: boolean;
}

export default function TransferConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  maxAmount,
  direction,
  isAwaitingConfirm = false,
}: TransferConfirmModalProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { currentAccountType } = useAccountStore();

  const {
    allowance: mUsdAllowance,
    isLoading: isMUsdAllowanceLoading,
    handleApprove: handleApprove,
    isApproving: isMUsdApproving,
  } = useCheckMonadAllowance(MonUSD.address || '', TransferApproveAddress);

  const shouldApprove = useMemo(() => {
    if (currentAccountType === 'DSA') {
      return false;
    }

    if (direction === 'T2F') {
      return false;
    }

    if (!mUsdAllowance) return true;

    return Number(mUsdAllowance) < Number(amount);
  }, [mUsdAllowance, amount, currentAccountType]);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError(null);
    }
  }, [isOpen]);

  function handleConfirm() {
    if (shouldApprove) {
      handleApprove();
    } else {
      onConfirm(amount);
    }
  }

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');

    // Handle multiple decimal points
    const parts = cleanValue.split('.');
    let processedValue = parts[0];
    if (parts.length > 1) {
      processedValue += '.' + parts[1].slice(0, 6); // Allow 6 decimal places
    }

    setAmount(processedValue);

    // Validate amount
    const numAmount = parseFloat(processedValue || '0');
    const numMaxAmount = parseFloat(maxAmount);

    if (numAmount > numMaxAmount) {
      setError('Amount exceed the available balance');
    } else {
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[384px] bg-white rounded-2xl p-8 z-50">
        <div className="absolute right-4 top-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-bold">Enter amount</h2>
          </div>

          <div>
            <input
              type="text"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 text-lg border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className={`mt-2 text-sm ${error ? 'text-red-500' : 'text-gray-600'}`}>
              {error ||
                `${amount || '0'} monUSD will be transferred to ${direction === 'F2T' ? 'Trading' : 'Funding'} Balance`}
            </div>
          </div>

          <button
            onClick={handleConfirm}
            disabled={!amount || !!error || isAwaitingConfirm}
            className={`w-full py-4 text-white text-lg font-medium rounded-lg ${
              !amount || !!error
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-pro-blue hover:bg-[var(--color-odd-main-hover)]'
            }`}
          >
            {isMUsdAllowanceLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : isMUsdApproving ? (
              'Awaiting Approve...'
            ) : shouldApprove ? (
              'Approve'
            ) : isAwaitingConfirm ? (
              `Awaiting Confirm...`
            ) : (
              'Confirm'
            )}
          </button>
        </div>
      </div>
    </>
  );
}
