import { ERROR_MESSAGES } from '@/config/const-msg';
import { useAccount } from 'wagmi';

import { useEffect, useState } from 'react';

import { useSelectedAccount } from '@/lib/data/use-account';
import { isValidNumberInput } from '@/lib/utils/input';

export function useTokenInput(balance: string) {
  const { address } = useAccount();
  const { data: accountInfo } = useSelectedAccount();
  const [inputValue, setInputValue] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(true);
  const [errorData, setErrorData] = useState({
    showError: false,
    errorMessage: '',
  });

  useEffect(() => {
    if (!address) {
      setBtnDisabled(true);
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.WALLET_NOT_CONNECTED,
      });
      return;
    }

    if (!accountInfo) {
      setBtnDisabled(true);
      setErrorData({
        showError: true,
        errorMessage: ERROR_MESSAGES.ACCOUNT_NOT_CREATED,
      });
      return;
    }

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
        errorMessage: 'Your amount exceeds maximum limit.',
      });
      return;
    }

    setBtnDisabled(false);
    setErrorData({
      showError: false,
      errorMessage: '',
    });
  }, [inputValue, address, balance]);

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
