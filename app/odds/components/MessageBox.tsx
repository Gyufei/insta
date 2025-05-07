import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type MessageType = 'Error' | 'Warn' | 'Success';

interface MessageProps {
  type: MessageType;
  title?: string;
  message: string;
  onClose: () => void;
  delay: number;
}

export default function MessageBox({ type, title, message, onClose, delay }: MessageProps) {
  const [progress, setProgress] = useState(100);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + delay;

    const updateProgress = () => {
      const now = Date.now();
      const remaining = Math.max(0, endTime - now);
      const newProgress = (remaining / delay) * 100;
      
      if (newProgress <= 0) {
        handleClose();
      } else {
        setProgress(newProgress);
        requestAnimationFrame(updateProgress);
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);
    return () => cancelAnimationFrame(animationFrame);
  }, [delay]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 150); // Wait for fade out animation
  };

  const getThemeColors = () => {
    switch (type) {
      case 'Error':
        return 'bg-red-50 border-red-200';
      case 'Warn':
        return 'bg-yellow-50 border-yellow-200';
      case 'Success':
        return 'bg-green-50 border-green-200';
    }
  };

  const getProgressColor = () => {
    switch (type) {
      case 'Error':
        return 'bg-red-500';
      case 'Warn':
        return 'bg-yellow-500';
      case 'Success':
        return 'bg-green-500';
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case 'Error':
        return 'text-red-800';
      case 'Warn':
        return 'text-yellow-800';
      case 'Success':
        return 'text-green-800';
    }
  };

  const getMessageColor = () => {
    switch (type) {
      case 'Error':
        return 'text-red-600';
      case 'Warn':
        return 'text-yellow-600';
      case 'Success':
        return 'text-green-600';
    }
  };

  return (
    <div 
      className={`fixed z-50 transition-opacity duration-150 ${isClosing ? 'opacity-0' : 'opacity-100'}
        left-4 right-4 bottom-4 md:left-auto md:right-4 md:bottom-4 md:w-[400px]`}
    >
      <div className={`relative overflow-hidden rounded-lg border p-4 ${getThemeColors()}`}>
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            {title && <div className={`font-medium mb-1 ${getTitleColor()}`}>{title}</div>}
            <div className={`text-sm ${getMessageColor()}`}>{message}</div>
          </div>
          <button 
            onClick={handleClose}
            className="flex-none p-1 rounded-lg hover:bg-black/5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div 
            className={`h-full ${getProgressColor()} transition-[width] ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}