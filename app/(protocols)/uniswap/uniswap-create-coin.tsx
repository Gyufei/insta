'use client';

import { toast } from 'sonner';

import { useState } from 'react';

import Image from 'next/image';

import { TitleH2 } from '@/components/common/title-h2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

import { cn } from '@/lib/utils';

interface CreateCoinFormData {
  thumbnail: string | null;
  tokenName: string;
  tickerName: string;
  totalSupply: string;
  description: string;
  xLink?: string;
  tgLink?: string;
  websiteLink?: string;
}

interface FormErrors {
  thumbnail?: string;
  tokenName?: string;
  tickerName?: string;
  totalSupply?: string;
  description?: string;
}

export function UniswapCreateCoin() {
  const [formData, setFormData] = useState<CreateCoinFormData>({
    thumbnail: null,
    tokenName: '',
    tickerName: '',
    totalSupply: '',
    description: '',
    xLink: '',
    tgLink: '',
    websiteLink: '',
  });
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // 检查文件类型
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (PNG, JPEG, JPG, GIF, WEBP)');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new window.Image();
        img.onload = () => {
          // 检查图片尺寸
          if (img.width < 130 || img.height < 130) {
            toast.error('Image must be at least 130x130 pixels');
            return;
          }

          // 检查宽高比是否为 1:1
          if (img.width !== img.height) {
            toast.error('Image must have a 1:1 aspect ratio (square)');
            return;
          }

          // 验证通过，设置图片
          setFormData((prev) => ({ ...prev, thumbnail: reader.result as string }));
          // 清除该字段的错误
          setErrors((prev) => ({ ...prev, thumbnail: undefined }));
        };
        img.onerror = () => {
          toast.error('Failed to load image. Please try again.');
        };
        img.src = reader.result as string;
      };

      reader.onerror = () => {
        toast.error('Failed to read file. Please try again.');
      };

      reader.readAsDataURL(file);
    } else {
      // 如果没有选择文件，清除图片并设置错误
      setFormData((prev) => ({ ...prev, thumbnail: null }));
      setErrors((prev) => ({ ...prev, thumbnail: 'Please upload the token icon' }));
    }
  };

  const handleInputChange =
    (field: keyof CreateCoinFormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      // 清除该字段的错误
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 验证必填字段
    if (!formData.thumbnail) {
      newErrors.thumbnail = 'Please upload the token icon';
    }

    if (!formData.tokenName.trim()) {
      newErrors.tokenName = 'Please enter the token name';
    }

    if (!formData.tickerName.trim()) {
      newErrors.tickerName = 'Please enter the ticker name';
    }

    if (!formData.totalSupply.trim()) {
      newErrors.totalSupply = 'Please enter the total supply';
    } else if (isNaN(Number(formData.totalSupply)) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Please enter a valid total supply';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Please enter the token description';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = () => {
    setShowErrors(true);

    if (!validateForm()) {
      return;
    }

    // TODO: 实现创建代币的逻辑
    console.log('Creating coin with data:', formData);
  };

  const hasErrors =
    showErrors && Object.keys(errors).some((key) => errors[key as keyof FormErrors]);

  return (
    <div className="flex w-full flex-grow flex-col px-4 2xl:px-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-end gap-3">
          <TitleH2>Create Coin</TitleH2>
          <span className="text-[#A5ADC6] text-sm leading-[140%] font-normal">
            Data cannot be changed after creation
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Label
            htmlFor="show-more-options"
            className="text-sm leading-[140%] text-[#A5ADC6] font-normal"
          >
            Show more options
          </Label>
          <Switch
            id="show-more-options"
            checked={showMoreOptions}
            onCheckedChange={setShowMoreOptions}
          />
        </div>
      </div>

      <div className="flex justify-between gap-4">
        <div>
          <Label className="text-sm font-medium text-[#131E40]">
            Thumbnail Image <RedStart />
          </Label>
          <div className="mt-3">
            <div
              className={cn(
                'group w-[216px] relative h-[216px] overflow-hidden rounded-lg border-2 border-dashed bg-primary-foreground hover:border-primary/50 transition-colors',
                showErrors && errors.thumbnail ? 'border-red-500' : 'border-[#ebebeb]'
              )}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                className="absolute inset-0 z-10 w-full h-full cursor-pointer opacity-0 p-[14px]"
                onChange={handleImageUpload}
              />
              {formData.thumbnail ? (
                <div className="relative h-full w-full p-2">
                  <Image
                    src={formData.thumbnail}
                    alt="Token thumbnail preview"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-muted mb-3">
                    <Image src="/icons/upload.svg" alt="Upload" width={72} height={72} />
                  </div>
                  <p className="text-sm font-medium leading-[140%] text-center text-[#131E40]">
                    Drag file here or choose file
                  </p>
                  <p className="text-xs text-[#A5ADC6] font-medium leading-[140%] mt-2">
                    1:1 ratio • Min 130x130px • Max 5MB
                  </p>
                </div>
              )}
            </div>
            {showErrors && errors.thumbnail && (
              <p className="text-red-500 text-xs mt-1">{errors.thumbnail}</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex-1">
          {/* Token Name */}
          <div>
            <Label className="text-sm font-medium text-[#131E40]">
              Token Name <RedStart />
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the token name"
                value={formData.tokenName}
                onChange={handleInputChange('tokenName')}
                className={cn('w-full', showErrors && errors.tokenName && 'border-red-500')}
              />
              {showErrors && errors.tokenName && (
                <p className="text-red-500 text-xs mt-1">{errors.tokenName}</p>
              )}
            </div>
          </div>

          {/* Ticker Name */}
          <div>
            <Label className="text-sm font-medium text-[#131E40]">
              Ticker Name <RedStart />
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the ticker name"
                value={formData.tickerName}
                onChange={handleInputChange('tickerName')}
                className={cn('w-full', showErrors && errors.tickerName && 'border-red-500')}
              />
              {showErrors && errors.tickerName && (
                <p className="text-red-500 text-xs mt-1">{errors.tickerName}</p>
              )}
            </div>
          </div>

          {/* Total Supply */}
          <div>
            <Label className="text-sm font-medium text-[#131E40]">
              Total Supply <RedStart />
            </Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the total supply"
                value={formData.totalSupply}
                onChange={handleInputChange('totalSupply')}
                className={cn('w-full', showErrors && errors.totalSupply && 'border-red-500')}
              />
              {showErrors && errors.totalSupply && (
                <p className="text-red-500 text-xs mt-1">{errors.totalSupply}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={cn(
          'flex flex-col gap-4 mt-4 transition-all duration-300',
          showMoreOptions ? 'flex' : 'hidden'
        )}
      >
        <div className="flex justify-between gap-2">
          <div className="flex-1">
            <Label className="text-sm font-medium text-foreground">X Link</Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the X link"
                value={formData.xLink}
                onChange={handleInputChange('xLink')}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex-1">
            <Label className="text-sm font-medium text-foreground">Telegram Link</Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the Telegram link"
                value={formData.tgLink}
                onChange={handleInputChange('tgLink')}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between gap-2">
          <div className="flex-1">
            <Label className="text-sm font-medium text-foreground">Website Link</Label>
            <div className="mt-2">
              <Input
                type="text"
                placeholder="Enter the website link"
                value={formData.websiteLink}
                onChange={handleInputChange('websiteLink')}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex-1" />
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-sm font-medium text-[#131E40]">
          Token Description <RedStart />
        </Label>
        <div className="mt-2">
          <textarea
            placeholder="Enter the description"
            value={formData.description}
            onChange={handleInputChange('description')}
            rows={4}
            className={cn(
              'w-full px-3 py-2 border border-input rounded-md bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none',
              showErrors && errors.description && 'border-red-500'
            )}
          />
          {showErrors && errors.description && (
            <p className="text-red-500 text-xs mt-1">{errors.description}</p>
          )}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 flex items-center gap-4">
        <Button
          onClick={handleCreate}
          variant="ghost"
          className="bg-[#6E75F9] flex items-center text-[#fff] hover:bg-[#6E75F9]/90 hover:text-[#fff] px-8 h-10 text-base font-medium"
        >
          Create
          <span className="text-xs text-[#ffffff50] mt-1">Cost to deploy: ~0.02 MON</span>
        </Button>
        {hasErrors && (
          <div className="text-red-500 text-sm">Please fill in all required fields</div>
        )}
      </div>
    </div>
  );
}

function RedStart() {
  return <span className="text-[#FC4E08]">*</span>;
}
