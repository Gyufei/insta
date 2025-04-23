'use client';

import { ChevronRight, X } from 'lucide-react';

import { useEffect, useState } from 'react';

import { TitleH2 } from '@/components/title-h2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { WithLoading } from '@/components/with-loading';

import { useNadNameCheckAvailability } from '@/lib/data/use-nadname-check-name-availability';
import { useSideDrawerStore } from '@/lib/state/side-drawer';
import { useDebounce } from '@/lib/utils/use-debounce';

export function SearchName() {
  const { setCurrentComponent } = useSideDrawerStore();
  const [inputTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // 使用防抖处理搜索词
  const debouncedSearchTerm = useDebounce(inputTerm, 500);

  // 只有当搜索词不为空时才检查可用性
  const { data: availabilityData, isLoading } = useNadNameCheckAvailability(
    debouncedSearchTerm.trim() ? debouncedSearchTerm : ''
  );

  // 当输入框获得焦点时显示结果
  const handleFocus = () => {
    if (inputTerm) {
      setShowResults(true);
    }
  };

  // 清除输入
  const handleClear = () => {
    setSearchTerm('');
    setShowResults(false);
    setIsTyping(false);
  };

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsTyping(true);

    if (value) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  function handleResister() {
    if (inputTerm && !isTyping && !isLoading && availabilityData?.available) {
      setCurrentComponent({ name: 'NadNameRegister', props: { registerName: inputTerm } });
    }
  }

  // 当防抖后的搜索词变化时，更新输入状态
  useEffect(() => {
    if (debouncedSearchTerm === inputTerm) {
      setIsTyping(false);
    }
  }, [debouncedSearchTerm, inputTerm]);

  return (
    <div className="container px-4 2xl:px-12">
      <TitleH2>Search name</TitleH2>
      <div className="relative mt-4">
        <div className="relative bg-gradient-78 from-[#5A00C8] bg-linear-78 to-[#FB0899] p-[2px] rounded-sm">
          <Input
            type="text"
            className="font-medium h-[60px] border-none bg-primary-foreground ring-0 focus-visible:ring-0 focus-visible:shadow-none text-xl w-full px-6 py-4 rounded-sm placeholder-gray-300 focus:outline-none"
            placeholder="Search a name"
            value={inputTerm}
            onChange={handleInputChange}
            onFocus={handleFocus}
          />
          {inputTerm && (
            <Button
              variant="ghost"
              className="absolute mx-1 right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              onClick={handleClear}
            >
              <X />
            </Button>
          )}
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${showResults && inputTerm ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}
        >
          <ul className="rounded-sm mt-2 border border-gray-300 bg-primary-foreground shadow-sm z-10">
            <li
              onClick={handleResister}
              className="rounded-sm font-semibold hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex space-x-4 items-center justify-between">
                <span className="text-lg p-4 overflow-y-auto scrollbar-none">{inputTerm}.nad</span>
                <div className="flex mr-2">
                  {isTyping || isLoading ? (
                    <WithLoading className="mr-2" isLoading={true} />
                  ) : availabilityData?.available ? (
                    <div className="flex items-center">
                      <div className="rounded-full font-medium me-2 px-2.5 py-1 text-sm block bg-green-200 text-green-800">
                        Available
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="rounded-full font-medium me-2 px-2.5 py-1 text-sm block bg-blue-200 text-blue-800">
                      Registered
                    </div>
                  )}
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
