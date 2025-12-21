/**
 * 可愛日式風格登山徽章圖標
 *
 * 特色：
 * - 圓形徽章設計（類似日本登山章）
 * - Q版山峰 + 小太陽
 * - 可愛簡約風格
 */

interface PeakBadgeIconProps {
  isCompleted: boolean;
  className?: string;
}

export default function PeakBadgeIcon({ isCompleted, className = '' }: PeakBadgeIconProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 外圈圓形徽章邊框 */}
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="none"
        stroke={isCompleted ? "url(#gradientStroke)" : "#9CA3AF"}
        strokeWidth="3"
      />

      {/* 內圈圓形背景 */}
      <circle
        cx="60"
        cy="60"
        r="50"
        fill={isCompleted ? "url(#gradientBg)" : "#F3F4F6"}
      />

      {/* 定義漸層色（已完成時使用） */}
      <defs>
        <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#14B8A6" />
        </linearGradient>
        <linearGradient id="gradientBg" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ECFDF5" />
          <stop offset="100%" stopColor="#D1FAE5" />
        </linearGradient>
        <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>
      </defs>

      {/* 小太陽（右上角，可愛風格） */}
      <g transform="translate(85, 25)">
        <circle
          cx="0"
          cy="0"
          r="8"
          fill={isCompleted ? "#FCD34D" : "#D1D5DB"}
        />
        {/* 太陽光芒（8條短線） */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const rad = (angle * Math.PI) / 180;
          const x1 = Math.cos(rad) * 10;
          const y1 = Math.sin(rad) * 10;
          const x2 = Math.cos(rad) * 14;
          const y2 = Math.sin(rad) * 14;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isCompleted ? "#FCD34D" : "#D1D5DB"}
              strokeWidth="2"
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* 主山峰（中間大的，可愛三角形） */}
      <path
        d="M 60 35 L 75 65 L 45 65 Z"
        fill={isCompleted ? "url(#mountainGradient)" : "#9CA3AF"}
      />

      {/* 左側小山峰 */}
      <path
        d="M 35 55 L 48 65 L 22 65 Z"
        fill={isCompleted ? "#10B981" : "#D1D5DB"}
      />

      {/* 右側小山峰 */}
      <path
        d="M 85 55 L 98 65 L 72 65 Z"
        fill={isCompleted ? "#10B981" : "#D1D5DB"}
      />

      {/* 山頂積雪（白色三角形，可愛細節） */}
      {isCompleted && (
        <>
          <path d="M 60 35 L 65 45 L 55 45 Z" fill="#FFFFFF" opacity="0.9" />
          <path d="M 35 55 L 38 60 L 32 60 Z" fill="#FFFFFF" opacity="0.8" />
          <path d="M 85 55 L 88 60 L 82 60 Z" fill="#FFFFFF" opacity="0.8" />
        </>
      )}

      {/* 可愛的雲朵（左下角） */}
      <g transform="translate(25, 75)">
        <ellipse
          cx="0"
          cy="0"
          rx="8"
          ry="5"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.8"
        />
        <ellipse
          cx="6"
          cy="-1"
          rx="6"
          ry="4"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.8"
        />
        <ellipse
          cx="-5"
          cy="-1"
          rx="5"
          ry="4"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.8"
        />
      </g>

      {/* 可愛的雲朵（右下角） */}
      <g transform="translate(90, 80)">
        <ellipse
          cx="0"
          cy="0"
          rx="6"
          ry="4"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.7"
        />
        <ellipse
          cx="5"
          cy="-1"
          rx="5"
          ry="3"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.7"
        />
        <ellipse
          cx="-4"
          cy="0"
          rx="4"
          ry="3"
          fill={isCompleted ? "#FFFFFF" : "#E5E7EB"}
          opacity="0.7"
        />
      </g>

      {/* 地平線（底部裝飾線） */}
      <line
        x1="20"
        y1="65"
        x2="100"
        y2="65"
        stroke={isCompleted ? "#059669" : "#9CA3AF"}
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* 完成打勾標記（右下角小圓圈內） */}
      {isCompleted && (
        <g transform="translate(95, 95)">
          {/* 背景圓圈 */}
          <circle cx="0" cy="0" r="10" fill="#10B981" />
          {/* 打勾符號 */}
          <path
            d="M -3 0 L -1 3 L 4 -3"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      )}
    </svg>
  );
}
