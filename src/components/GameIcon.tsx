import React, { useState } from 'react';
import type { GameItem, Character } from '../data/vsData';

interface GameIconProps {
  item: GameItem | Character;
  size?: number;
  className?: string;
}

export const GameIcon: React.FC<GameIconProps> = ({ item, size = 36, className = 'wiki-img' }) => {
  const [isError, setIsError] = useState(false);

  const hasImg = 'img' in item && (item as any).img;
  if (!hasImg || isError) {
    return (
      <span 
        className="fallback-emoji" 
        style={{ 
          fontSize: `${size * 0.65}px`, 
          lineHeight: 1,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size
        }}
      >
        {item.icon}
      </span>
    );
  }

  const imgSrc = (item as any).img;
  return (
    <img
      className={className}
      src={imgSrc}
      width={size}
      height={size}
      style={{ 
        imageRendering: 'pixelated', 
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      onError={() => setIsError(true)}
      alt={item.name}
    />
  );
};
export default GameIcon;
