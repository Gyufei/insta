import { Upload } from 'lucide-react';

import Image from 'next/image';
import { toast } from 'sonner';

// 上传组件
interface ImageUploadProps {
  value: string | null;
  onChange: (value: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 检查文件大小 (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB');
        return;
      }

      // 检查文件类型
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/bmp', 'image/tiff', 'image/heic', 'image/heif', 'image/avif'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload a valid image file');
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
          onChange(reader.result as string);
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
    }
  };

  return (
    <div className="group relative mt-[9px] size-[200px] overflow-hidden rounded-[8px] border border-dashed border-[#ebebeb] bg-primary-foreground">
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp,image/bmp,image/tiff,image/heic,image/heif,image/avif"
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
        onChange={handleFileChange}
      />
      {value ? (
        <div className="relative h-full w-full px-2">
          <Image src={value} alt="Token logo preview" fill className="object-contain" />
        </div>
      ) : (
        <div className="pt-[60px]">
          <div className="flex items-center justify-center mx-auto size-[48px] rounded-full bg-muted">
            <Upload className="size-5" />
          </div>
          <p className="mt-[12px] text-center text-[14px] leading-[150%] tracking-[-0.02em] text-muted-foreground">
            Drag file here
            <br />
            or choose file
          </p>
          <p className="mt-1 text-center text-xs text-gray-500">
            1:1 ratio • Min 130x130px • Max 5MB
          </p>
        </div>
      )}
    </div>
  );
}
