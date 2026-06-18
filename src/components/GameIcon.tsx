import React, { useState } from 'react';
import type { GameItem, Character } from '../data/vsData';

interface GameIconProps {
  item: GameItem | Character;
  size?: number;
  className?: string;
}

type ImgStage = 'local' | 'remote' | 'fallback';

export const GameIcon: React.FC<GameIconProps> = ({ item, size = 36, className = 'wiki-img' }) => {
  const [stage, setStage] = useState<ImgStage>('local');

  const localSrc = item.imgLocal;
  const remoteSrc = item.imgRemote;

  // 无任何图片源或已穷尽回退
  if (stage === 'fallback' || (!localSrc && !remoteSrc)) {
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

  const src = stage === 'local' ? localSrc : remoteSrc;
  if (!src) {
    // 当前阶段无源，切换到下一阶段
    if (stage === 'local' && remoteSrc) {
      setStage('remote');
    } else {
      setStage('fallback');
    }
    return null;
  }

  return (
    <img
      className={className}
      src={src}
      width={size}
      height={size}
      style={{
        imageRendering: 'pixelated',
        objectFit: 'contain',
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
      onError={() => {
        if (stage === 'local' && remoteSrc) {
          setStage('remote');
        } else {
          setStage('fallback');
        }
      }}
      alt={item.name}
    />
  );
};
export default GameIcon;
