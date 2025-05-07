import React from 'react';

// Define color mapping for 36 characters (0-9 and a-z)
const ColorDefs: Record<string, string> = {
  '0': '#FF3B30', '1': '#FF9500', '2': '#FFCC00', '3': '#34C759', '4': '#5856D6',
  '5': '#FF962A', '6': '#5AC8FA', '7': '#FF2D55', '8': '#AF52DE', '9': '#FF3869',
  'a': '#FF8C37', 'b': '#FF522A', 'c': '#32D74B', 'd': '#0A84FF', 'e': '#64D2FF',
  'f': '#BF5AF2', 'g': '#FF375F', 'h': '#FF9F0A', 'i': '#FFD60A', 'j': '#30D158',
  'k': '#5E5CE6', 'l': '#0088FF', 'm': '#66D4CF', 'n': '#FF2D55', 'o': '#BF5AF2',
  'p': '#FF3B30', 'q': '#FF9500', 'r': '#FFCC00', 's': '#34C759', 't': '#5856D6',
  'u': '#007AFF', 'v': '#5AC8FA', 'w': '#FF2D55', 'x': '#AF52DE', 'y': '#FF3869',
  'z': '#64D2FF'
};

interface ColorAvatarProps {
  name: string;
  className?: string;
}

export default function ColorAvatar({ name, className = '' }: ColorAvatarProps) {
  // Convert name to base64
  const base64Name = btoa(name);
  
  // Get first and last characters from base64 string
  const firstChar = base64Name.charAt(0).toLowerCase();
  const lastChar = base64Name.charAt(base64Name.length - 1).toLowerCase();
  
  // Get colors from ColorDefs, fallback to first color if not found
  const startColor = ColorDefs[firstChar] || ColorDefs['0'];
  const endColor = ColorDefs[lastChar] || ColorDefs['0'];

  return (
    <div 
      className={`rounded-full ${className}`}
      style={{
        background: `radial-gradient(79.05% 79.05% at 21.62% 20.95%, ${startColor} 0%, ${endColor} 100%)`
      }}
    />
  );
}