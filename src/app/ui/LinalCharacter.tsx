import { useId } from 'react';

export interface LinalCharacterProps {
  size?: number;
  className?: string;
}

/**
 * Linal — nhân vật robot gia sư của Linal Lab.
 * Đầu bo tròn nền tím gradient, mặt là màn hình đen (2 mắt trắng + miệng cười),
 * antenna trên đỉnh, thân blouse trắng, một tay giơ vẫy chào.
 * Hex nằm TRONG SVG minh hoạ được phép (NFR-01) — không dùng ngoài file này.
 */
export default function LinalCharacter({ size = 96, className = '' }: LinalCharacterProps) {
  // useId() có dấu ':' — bỏ đi để id hợp lệ khi tham chiếu url(#id) trong SVG.
  const uid = useId().replace(/:/g, '');
  const head = `linal-head-${uid}`;
  const blouse = `linal-blouse-${uid}`;
  const headUrl = `url(#${head})`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="Linal — trợ giảng AI"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={head} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7B5CFF" />
          <stop offset="1" stopColor="#5B37E8" />
        </linearGradient>
        <linearGradient id={blouse} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#EEE9FF" />
        </linearGradient>
      </defs>

      {/* Tay phải giơ vẫy chào (vẽ trước → nằm sau thân) */}
      <path d="M86 92 L104 72" stroke={headUrl} strokeWidth="7" strokeLinecap="round" />
      <circle cx="107" cy="67" r="8" fill={headUrl} />
      {/* Tay trái */}
      <path d="M34 92 L21 81" stroke={headUrl} strokeWidth="7" strokeLinecap="round" />
      <circle cx="18" cy="78" r="7" fill={headUrl} />

      {/* Cổ robot (nằm sau đầu & thân) */}
      <rect x="53" y="74" width="14" height="12" rx="4" fill={headUrl} />

      {/* Antenna */}
      <line x1="60" y1="26" x2="60" y2="14" stroke={headUrl} strokeWidth="4" strokeLinecap="round" />
      <circle cx="60" cy="10" r="5" fill="#6C4CF6" />

      {/* Đầu + tai */}
      <rect x="26" y="26" width="68" height="54" rx="20" fill={headUrl} />
      <rect x="19" y="44" width="9" height="18" rx="4" fill={headUrl} />
      <rect x="92" y="44" width="9" height="18" rx="4" fill={headUrl} />

      {/* Thân blouse trắng + cổ áo tím */}
      <path
        d="M32 110 Q32 84 60 84 Q88 84 88 110 Z"
        fill={`url(#${blouse})`}
        stroke="#E7E9F2"
        strokeWidth="1.5"
      />
      <path
        d="M53 85 L60 96 L67 85"
        fill="none"
        stroke="#6C4CF6"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Màn hình mặt */}
      <rect x="34" y="38" width="52" height="34" rx="12" fill="#12182B" />
      {/* Mắt */}
      <circle cx="50" cy="53" r="5" fill="#FFFFFF" />
      <circle cx="70" cy="53" r="5" fill="#FFFFFF" />
      {/* Miệng cười */}
      <path d="M50 62 Q60 70 70 62" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}
