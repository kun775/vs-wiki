import React from 'react';

type IconName =
  | 'sword'
  | 'shield'
  | 'crown'
  | 'flask'
  | 'search'
  | 'question'
  | 'close'
  | 'lightbulb'
  | 'chat'
  | 'chart'
  | 'mask'
  | 'key'
  | 'gun'
  | 'star'
  | 'gamepad'
  | 'crystal'
  | 'plus'
  | 'arrow'
  | 'cross'
  | 'check'
  | 'clock'
  | 'book'
  | 'user';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

const paths: Record<IconName, string> = {
  sword: 'M16 2l-2 4h-2l-1-1 1-5h-3l1 5-1 1H7l-2-4-1 2 2 6h12l2-6-1-2zm-6 10v3a2 2 0 002 2h0a2 2 0 002-2v-3M6 9l-3-3m12 0l3-3',
  shield: 'M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4zm0 2.5L5.5 7.3V11c0 4.3 2.9 8.5 6.5 9.8 3.6-1.3 6.5-5.5 6.5-9.8V7.3L12 4.5z',
  crown: 'M2 6l4 8h12l4-8-4.5 3.5L12 3 6.5 9.5 2 6zm0 12h20v2H2v-2z',
  flask: 'M9 3h6v4l4 8H5l4-8V3zm0 2v4.5L5.5 16h13L15 9.5V5H9zm-1 4v2h8V9H8z',
  search: 'M10 2a8 8 0 015.3 13.7l5.4 5.4-1.4 1.4-5.4-5.4A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z',
  question: 'M10 20v-2h4v2h-4zm0-4a4 4 0 114-4h-2a2 2 0 11-2-2c1.3 0 2.4.8 2.8 2H19a4 4 0 00-7-2.7A4 4 0 008 12h2zm2-14a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16z',
  close: 'M6 6l12 12M18 6L6 18',
  lightbulb: 'M10 17h4v2h-4v-2zm2-15a7 7 0 00-5 11.9V16a2 2 0 002 2h6a2 2 0 002-2v-2.1A7 7 0 0012 2zm0 2a5 5 0 013.5 8.6l-.5.5V16h-2v-3h-2v3h-2v-2.9l-.5-.5A5 5 0 0112 4z',
  chat: 'M4 4h16v12H8l-4 4V4zm2 2v8.6L7.6 13H18V6H6z',
  chart: 'M3 20h18v2H3v-2zm2-4v-6h4v6H5zm6 0V6h4v10h-4zm6-6v6h4v-6h-4z',
  mask: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 018 8c0 2.5-1.2 4.8-3 6.2-.2-2.5-2.2-4.3-4.7-4.2-1.1 0-2.1.3-3 1a7 7 0 00-1-1.2A4 4 0 0112 6a4 4 0 013.9 5c-.4 1-1.4 1.8-2.6 1.8-1.7 0-3-1.4-2.8-3.1a2 2 0 011.5-1.7zm0 4a1 1 0 011 1 1 1 0 01-2 0 1 1 0 011-1zm-3.7 4.5a7 7 0 005.5 3.5 8 8 0 01-4.2-2.3l-.5-.5z',
  key: 'M12.3 2a4 4 0 00-3.7 2.5A4 4 0 008.5 9H8v2H6v3H3v4h6l1-1v-1h2v-2h2.3a4 4 0 10-2-6zm0 2a2 2 0 110 4 2 2 0 010-4z',
  gun: 'M5 4h2l1 10h8l2-3h1l-1 5H9l-1 2H6l-1-14zm3 1l.8 8h5.8l1-2H12l1-4h2l-1-2H8z',
  star: 'M12 2l3.1 6.3L22 9.3l-5 4.9L18.2 22 12 18.7 5.8 22 7 14.2 2 9.3l6.9-1L12 2z',
  gamepad: 'M6 11h4v2H6v-2zm8 0h2v2h-2v-2zm4-2v2h2V9h-2zm-2 0v2h-2V9h2zm-12 0v2H6V9h2zm10-6a8 8 0 018 8v4a4 4 0 01-4 4H8a4 4 0 01-4-4v-4a8 8 0 018-8zm0 2a6 6 0 00-6 6v4a2 2 0 002 2h12a2 2 0 002-2v-4a6 6 0 00-6-6z',
  crystal: 'M12 2l3 8h8l-6.5 4.5L19 22l-7-5-7 5 2.5-7.5L1 10h8l3-8zm0 3.5L9.5 11H4.2l4.2 3-1.4 4.2L12 15l5 3.2-1.4-4.2 4.2-3H14.5L12 5.5z',
  plus: 'M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2h6z',
  arrow: 'M12 4l-6 6h4v8h4v-8h4l-6-6z',
  cross: 'M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v4h4v2h-4v4h-2v-4H7v-2h4V7z',
  check: 'M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z',
  clock: 'M12 2a10 10 0 100 20 10 10 0 000-20zm0 2a8 8 0 110 16 8 8 0 010-16zm-1 2h2v6.6l4 2.3-1 1.7-5-2.9V6z',
  book: 'M4 4h6c1.7 0 3 1.3 3 3 0 .9-.4 1.7-1 2.2.6.5 1 1.3 1 2.2 0 1.7-1.3 3-3 3H4V4zm2 2v4h4c.6 0 1-.4 1-1s-.4-1-1-1H6V6zm0 6v4h4c.6 0 1-.4 1-1s-.4-1-1-1H6z',
  user: 'M12 4a4 4 0 100 8 4 4 0 000-8zm0 2a2 2 0 110 4 2 2 0 010-4zm-6 12c0-2.7 2.5-5 6-5s6 2.3 6 5v1H6v-1zm2 0h8c0-1.3-1.8-3-4-3s-4 1.7-4 3z',
};

const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', style }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{
        flexShrink: 0,
        verticalAlign: 'middle',
        ...style,
      }}
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
};

export default Icon;
