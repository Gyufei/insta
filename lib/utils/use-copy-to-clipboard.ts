import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export function useCopyToClipboard(
  text: string,
  successMessage = 'Copied!',
  errorMessage = 'Failed to copy',
  resetTime = 2000
) {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      if (successMessage) {
        toast.success(successMessage);
      }
    } catch (err) {
      if (errorMessage) {
        toast.error(errorMessage);
      }
    }
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setIsCopied(false);
      }, resetTime);
      return () => clearTimeout(timer);
    }
  }, [isCopied, resetTime]);

  return {
    isCopied,
    copyToClipboard
  };
} 