import { ERROR_MESSAGES } from '@/config/const-msg';

import { useEffect, useState } from 'react';

import { ErrorVO } from '@/lib/model/error-vo';
import { isValidNumberInput } from '@/lib/utils/input';

export function useTokenInput(balance: string) {
  const [inputValue, setInputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorData, setErrorData] = useState<ErrorVO>({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (!inputValue || Number(inputValue) === 0) {
      setBtnDisabled(true);
      setErrorData({
        showError: false,
        errorMessage: '',
      });
      return;
    }

    if (Number(inputValue) > parseFloat(balance)) {
      setBtnDisabled(true);
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.EXCEED_MAX_BALANCE,
      });
      return;
    }

    setBtnDisabled(false);
    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [inputValue, balance]);

  const handleInputChange = (value: string) => {
    setErrorData({
      showError: false,
      errorMessage: '',
    });

    if (!isValidNumberInput(value)) {
      return;
    }

    setInputValue(value);
  };

  return {
    inputValue,
    btnDisabled,
    errorData,
    setErrorData,
    handleInputChange,
  };
}
