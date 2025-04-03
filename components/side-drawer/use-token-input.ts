import { useState } from 'react';
import { isValidNumberInput } from '@/lib/utils/input';

export function useTokenInput(balance: string) {
  const [inputValue, setInputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [showError, setShowError] = useState(false);

  const handleInputChange = (value: string) => {
    if (!isValidNumberInput(value)) {
      return;
    }

    setInputValue(value);

    if (!value || Number(value) === 0) {
      setBtnDisabled(true);
      setShowError(false);
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setBtnDisabled(true);
      setShowError(false);
      return;
    }

    if (numValue > parseFloat(balance)) {
      setBtnDisabled(true);
      setShowError(true);
    } else {
      setBtnDisabled(false);
      setShowError(false);
    }
  };

  return {
    inputValue,
    btnDisabled,
    showError,
    handleInputChange,
  };
}
