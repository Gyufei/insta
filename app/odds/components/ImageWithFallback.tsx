import React from 'react';
import { Img } from 'react-image';

interface ImageErrorEvent extends Event {
  target: HTMLImageElement;
}

interface ImageWithFallbackProps {
  src: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  onError?: (error: ImageErrorEvent) => void;
}

const PlaceholderImage = ({ className }: { className?: string }) => (
  <div className={`bg-[#F6F6F6] flex items-center justify-center ${className}`}>
    <img 
      src="/image/img_placeholder.png" 
      alt="Placeholder"
      className="w-auto h-auto object-contain"
    />
  </div>
);

export default function ImageWithFallback({ src, alt = '', className = '', style, onError }: ImageWithFallbackProps) {
  return (
    <Img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loader={<PlaceholderImage className={className} />}
      unloader={<PlaceholderImage className={className} />}
      onError={onError}
    />
  );
}