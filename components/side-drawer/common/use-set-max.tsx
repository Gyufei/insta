import { useState } from 'react';

export function useSetMax(
  inputValue: string,
  maxValue: string,
  forInputChange: (value: string) => void
) {
  const [isMax, setIsMax] = useState(false);
  const [prevValue, setPrevValue] = useState('');

  const handleSetMax = (checked: boolean) => {
    setIsMax(checked);
    if (checked) {
      setPrevValue(inputValue);
      forInputChange(maxValue);
    } else {
      forInputChange(prevValue);
    }
  };

  const handleInput = (value: string) => {
    forInputChange(value);
    setIsMax(false);
  };

  return { isMax, handleSetMax, handleInput };
}
