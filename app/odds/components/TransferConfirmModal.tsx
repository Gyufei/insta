import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

type TransferDirection = "F2T" | "T2F";

interface TransferConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: string) => void;
  maxAmount: string;
  direction: TransferDirection;
  needsApproval?: boolean;
  isAwaitingConfirm?: boolean;
}

export default function TransferConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  maxAmount,
  direction,
  needsApproval = false,
  isAwaitingConfirm = false,
}: TransferConfirmModalProps) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setAmount("");
      setError(null);
    }
  }, [isOpen]);

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, "");

    // Handle multiple decimal points
    const parts = cleanValue.split(".");
    let processedValue = parts[0];
    if (parts.length > 1) {
      processedValue += "." + parts[1].slice(0, 6); // Allow 6 decimal places
    }

    setAmount(processedValue);

    // Validate amount
    const numAmount = parseFloat(processedValue || "0");
    const numMaxAmount = parseFloat(maxAmount);

    if (numAmount > numMaxAmount) {
      setError("Amount exceed the available balance");
    } else {
      setError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
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
            <div
              className={`mt-2 text-sm ${error ? "text-red-500" : "text-gray-600"}`}
            >
              {error ||
                `${amount || "0"} monUSD will be transferred to ${direction === "F2T" ? "Trading" : "Funding"} Balance`}
            </div>
          </div>

          <button
            onClick={() => onConfirm(amount)}
            disabled={!amount || !!error || isAwaitingConfirm}
            className={`w-full py-4 text-white text-lg font-medium rounded-lg ${
              !amount || !!error
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[var(--color-odd-main)] hover:bg-[var(--color-odd-main-hover)]"
            }`}
          >
            {isAwaitingConfirm
              ? `Awaiting ${needsApproval ? "Approve" : "Confirm"}...`
              : needsApproval
                ? "Approve"
                : "Confirm"}
          </button>
        </div>
      </div>
    </>
  );
}
