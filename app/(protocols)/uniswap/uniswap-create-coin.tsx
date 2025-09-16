'use client';

import { toast } from 'sonner';

import { useEffect, useState } from 'react';

import Image from 'next/image';

import { TitleH2 } from '@/components/common/title-h2';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { useImageUpload } from '@/lib/data/use-image-upload';
import { useUniswapCreateCoin } from '@/lib/data/use-uniswap-create-coin';
import { useAccountStore } from '@/lib/state/account';
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
  const { currentAccountType } = useAccountStore();
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrors, setShowErrors] = useState(false);

  // Popover 状态管理
  const [twitterPopoverOpen, setTwitterPopoverOpen] = useState(false);
  const [websitePopoverOpen, setWebsitePopoverOpen] = useState(false);
  const [twitterInput, setTwitterInput] = useState('');
  const [websiteInput, setWebsiteInput] = useState('');

  // 链接验证错误状态
  const [twitterInputError, setTwitterInputError] = useState('');
  const [websiteInputError, setWebsiteInputError] = useState('');

  const { uploadImage, isPending: isUploading } = useImageUpload((data) => {
    // 上传成功后，将返回的 URL 设置为表单的图片值
    setFormData((prev) => ({ ...prev, thumbnail: data.url }));
  });

  const {
    mutate: createCoin,
    isPending: isCreating,
    isSuccess: isCreated,
  } = useUniswapCreateCoin();

  // URL 验证函数
  const isValidUrl = (url: string): boolean => {
    if (!url.trim()) return true; // 空值允许通过

    try {
      // 检查是否包含协议，如果没有则添加 https://
      let urlToCheck = url;
      if (!urlToCheck.match(/^https?:\/\//)) {
        urlToCheck = 'https://' + urlToCheck;
      }

      const urlObj = new URL(urlToCheck);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // 处理 Twitter 链接确认
  const handleTwitterConfirm = () => {
    if (!isValidUrl(twitterInput)) {
      setTwitterInputError('请输入有效的网址链接');
      return;
    }

    setTwitterInputError('');
    setFormData((prev) => ({ ...prev, xLink: twitterInput }));
    setTwitterPopoverOpen(false);
    setTwitterInput('');
  };

  // 处理 Website 链接确认
  const handleWebsiteConfirm = () => {
    if (!isValidUrl(websiteInput)) {
      setWebsiteInputError('请输入有效的网址链接');
      return;
    }

    setWebsiteInputError('');
    setFormData((prev) => ({ ...prev, websiteLink: websiteInput }));
    setWebsitePopoverOpen(false);
    setWebsiteInput('');
  };

  // 打开 Twitter Popover 时初始化输入值
  const handleTwitterPopoverOpen = (open: boolean) => {
    setTwitterPopoverOpen(open);
    if (open) {
      setTwitterInput(formData.xLink || '');
      setTwitterInputError(''); // 清除之前的错误
    }
  };

  // 打开 Website Popover 时初始化输入值
  const handleWebsitePopoverOpen = (open: boolean) => {
    setWebsitePopoverOpen(open);
    if (open) {
      setWebsiteInput(formData.websiteLink || '');
      setWebsiteInputError(''); // 清除之前的错误
    }
  };

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

          // 验证通过，上传图片到服务器
          uploadImage(file);
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

    createCoin({
      wallet_type: currentAccountType,
      token_name: formData.tokenName,
      token_symbol: formData.tickerName,
      token_url: formData.thumbnail || '',
      token_description: formData.description,
      x_link: formData.xLink || '',
      telegram_link: formData.tgLink || '',
      website: formData.websiteLink || '',
      initial_supply: formData.totalSupply,
    });
  };

  const hasErrors =
    showErrors && Object.keys(errors).some((key) => errors[key as keyof FormErrors]);

  function resetForm() {
    setFormData({
      thumbnail: null,
      tokenName: '',
      tickerName: '',
      totalSupply: '',
      description: '',
      xLink: '',
      tgLink: '',
      websiteLink: '',
    });
    setErrors({});
    setShowErrors(false);
  }

  useEffect(() => {
    if (isCreated) {
      resetForm();
    }
  }, [isCreated]);

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
      </div>

      <div className="flex justify-between gap-4">
        <div className="flex-col">
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
                disabled={isUploading}
              />
              {isUploading ? (
                <div className="flex flex-col items-center justify-center w-full h-full">
                  <div className="flex items-center justify-center w-[72px] h-[72px] rounded-full bg-muted mb-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                  <p className="text-sm font-medium leading-[140%] text-center text-[#131E40]">
                    Uploading...
                  </p>
                </div>
              ) : formData.thumbnail ? (
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

          <div className="flex items-center gap-2 mt-4">
            <Popover open={twitterPopoverOpen} onOpenChange={handleTwitterPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'relative flex items-center flex-1 h-10 border-[#EBEBEB]',
                    formData.xLink && 'border-[#6E75F9]'
                  )}
                >
                  <Image
                    src={formData.xLink ? '/icons/twitter-main.svg' : '/icons/twitter.svg'}
                    alt="Upload"
                    width={20}
                    height={20}
                  />
                  {formData.xLink && (
                    <Image
                      alt="check"
                      src="/icons/check.svg"
                      width="16"
                      height="16"
                      className="absolute -top-[6px] -right-[6px]"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">X Link</Label>
                    <Input
                      placeholder="Enter X link"
                      value={twitterInput}
                      onChange={(e) => {
                        setTwitterInput(e.target.value);
                        if (twitterInputError) {
                          setTwitterInputError('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleTwitterConfirm();
                        }
                      }}
                      className={cn('mt-1', twitterInputError && 'border-red-500')}
                    />
                    {twitterInputError && (
                      <p className="text-red-500 text-xs mt-1">{twitterInputError}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleTwitterConfirm}
                      className="flex-1 bg-[#6E75F9] hover:bg-[#6E75F9]/90"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setTwitterPopoverOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <Popover open={websitePopoverOpen} onOpenChange={handleWebsitePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'relative flex items-center flex-1 h-10 border-[#EBEBEB]',
                    formData.websiteLink && 'border-[#6E75F9]'
                  )}
                >
                  <Image
                    src={formData.websiteLink ? '/icons/website-main.svg' : '/icons/website.svg'}
                    alt="website"
                    width={20}
                    height={20}
                  />
                  {formData.websiteLink && (
                    <Image
                      alt="check"
                      src="/icons/check.svg"
                      width="16"
                      height="16"
                      className="absolute -top-[6px] -right-[6px]"
                    />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-foreground">Website Link</Label>
                    <Input
                      placeholder="Enter website link"
                      value={websiteInput}
                      onChange={(e) => {
                        setWebsiteInput(e.target.value);
                        if (websiteInputError) {
                          setWebsiteInputError('');
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleWebsiteConfirm();
                        }
                      }}
                      className={cn('mt-1', websiteInputError && 'border-red-500')}
                    />
                    {websiteInputError && (
                      <p className="text-red-500 text-xs mt-1">{websiteInputError}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleWebsiteConfirm}
                      className="flex-1 bg-[#6E75F9] hover:bg-[#6E75F9]/90"
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setWebsitePopoverOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex-1">
          <div className="flex justify-between gap-4">
            {/* Ticker Name */}
            <div className="flex-1">
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
            <div className="flex-1">
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

          <div>
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
                  'w-full px-3 py-2 border border-input rounded-md bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-0 focus:ring-ring focus:ring-offset-2 resize-none',
                  showErrors && errors.description && 'border-red-500'
                )}
              />
              {showErrors && errors.description && (
                <p className="text-red-500 text-xs mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-5 flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCreate}
                disabled={isCreating}
                variant="ghost"
                className="bg-[#6E75F9] flex items-center text-[#fff] hover:bg-[#6E75F9]/90 hover:text-[#fff] px-8 h-10 text-base font-medium"
              >
                {isCreating ? 'Creating...' : 'Create'}
              </Button>
            </div>
            {hasErrors && (
              <div className="text-red-500 text-sm">Please fill in all required fields</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RedStart() {
  return <span className="text-[#FC4E08]">*</span>;
}
