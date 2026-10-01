import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'mark' | 'light' | 'dark';
  showTagline?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  variant = 'dark',
  showTagline = true,
}) => {
  const sizeMap = {
    sm: { width: 140, height: 48, scale: 0.65 },
    md: { width: 190, height: 64, scale: 0.85 },
    lg: { width: 240, height: 82, scale: 1 },
    xl: { width: 320, height: 110, scale: 1.35 },
  };

  const { width, height } = sizeMap[size];
  const isDarkBg = variant === 'dark' || variant === 'full';

  if (variant === 'mark') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 170 190"
          className="w-auto"
          style={{ height: height * 0.9 }}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="capGradMark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B3C96" />
              <stop offset="50%" stopColor="#0066FF" />
              <stop offset="100%" stopColor="#00C4FF" />
            </linearGradient>
            <linearGradient id="hLeftGradMark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#061B48" />
              <stop offset="60%" stopColor="#084EBA" />
              <stop offset="100%" stopColor="#00B8FF" />
            </linearGradient>
            <linearGradient id="hRightGradMark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052CC" />
              <stop offset="65%" stopColor="#0099FF" />
              <stop offset="100%" stopColor="#00D2FF" />
            </linearGradient>
            <linearGradient id="swooshGradMark" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FF4500" />
              <stop offset="40%" stopColor="#FF7A00" />
              <stop offset="75%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FFD700" />
            </linearGradient>
            <filter id="starGlowMark" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Graduation Cap */}
          <path
            d="M80 18 L155 42 L80 66 L12 44 Z"
            fill="url(#capGradMark)"
            stroke="#00E5FF"
            strokeWidth="1.2"
          />
          {/* Cap Skull Base */}
          <path
            d="M42 54 L42 70 C42 84 118 84 118 70 L118 54 Z"
            fill="#06225E"
          />
          {/* Tassel */}
          <path
            d="M26 47 Q18 58 19 86"
            stroke="#0A4CBF"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="19" cy="88" r="4.5" fill="#063282" />
          <path d="M16 91 L22 91 L21 106 L17 106 Z" fill="#0A4CBF" />

          {/* Button on Cap */}
          <ellipse cx="80" cy="42" rx="4.5" ry="2.5" fill="#FFC72C" />

          {/* Stylized Monogram H */}
          {/* Left Vertical Pillar */}
          <path
            d="M38 78 C38 74 41 71 45 71 L68 71 C72 71 75 74 75 78 L75 160 C75 174 58 185 44 180 C39 178 38 171 38 166 Z"
            fill="url(#hLeftGradMark)"
          />

          {/* Right Curve Pillar / Arch */}
          <path
            d="M82 104 C92 90 106 82 122 84 C132 85 137 92 137 104 L137 166 C137 172 132 176 126 176 L108 176 C103 176 100 172 100 166 L100 128 C100 119 92 114 84 118 Z"
            fill="url(#hRightGradMark)"
          />

          {/* Golden Orange Swoosh Wrapping the H */}
          <path
            d="M16 148 C12 165 24 172 35 162 C50 148 70 120 86 112 C108 102 128 88 148 50 C134 76 110 94 88 102 C66 110 40 130 26 142 C20 147 17 151 16 148 Z"
            fill="url(#swooshGradMark)"
          />
          <path
            d="M24 152 C36 136 60 115 88 106 C112 98 132 82 148 50 C138 70 120 88 94 98 C72 106 46 126 30 144 Z"
            fill="#FFF176"
            opacity="0.8"
          />

          {/* Sparkling 4-point Star at Swoosh Apex */}
          <g filter="url(#starGlowMark)">
            <path
              d="M148 50 Q152 46 156 36 Q160 46 164 50 Q160 54 156 64 Q152 54 148 50 Z"
              fill="#FF9E0D"
            />
            <path
              d="M152 50 Q154 48 156 42 Q158 48 160 50 Q158 52 156 58 Q154 52 152 50 Z"
              fill="#FFFFFF"
            />
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 540 175"
        className="h-auto"
        style={{ width, height: 'auto' }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cap Gradient */}
          <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0B3C96" />
            <stop offset="50%" stopColor="#0066FF" />
            <stop offset="100%" stopColor="#00C4FF" />
          </linearGradient>

          {/* H Left Pillar */}
          <linearGradient id="hLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#061B48" />
            <stop offset="55%" stopColor="#084EBA" />
            <stop offset="100%" stopColor="#00B8FF" />
          </linearGradient>

          {/* H Right Pillar */}
          <linearGradient id="hRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0052CC" />
            <stop offset="60%" stopColor="#0099FF" />
            <stop offset="100%" stopColor="#00D2FF" />
          </linearGradient>

          {/* Swoosh Gradient */}
          <linearGradient id="swooshGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3D00" />
            <stop offset="35%" stopColor="#FF7A00" />
            <stop offset="70%" stopColor="#FFA000" />
            <stop offset="100%" stopColor="#FFD000" />
          </linearGradient>

          {/* HKSURYA Text Gradient */}
          <linearGradient id="hkSuryaTextGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#083896" />
            <stop offset="28%" stopColor="#0D53C7" />
            <stop offset="42%" stopColor="#1E6BDE" />
            <stop offset="52%" stopColor="#FF7A00" />
            <stop offset="75%" stopColor="#FF5500" />
            <stop offset="100%" stopColor="#E63900" />
          </linearGradient>

          {/* Star Glow */}
          <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ================= EMBLEM ICON ================= */}
        <g id="Emblem" transform="translate(0, 0)">
          {/* Graduation Cap */}
          <path
            d="M74 15 L144 38 L74 61 L10 39 Z"
            fill="url(#capGrad)"
            stroke="#00E5FF"
            strokeWidth="1.2"
          />
          {/* Cap Skull Base */}
          <path
            d="M38 48 L38 64 C38 78 110 78 110 64 L110 48 Z"
            fill="#06225E"
          />
          {/* Tassel */}
          <path
            d="M23 42 Q16 53 17 80"
            stroke="#0A4CBF"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <circle cx="17" cy="82" r="4.2" fill="#063282" />
          <path d="M14 85 L20 85 L19 99 L15 99 Z" fill="#0A4CBF" />

          {/* Center Button */}
          <ellipse cx="74" cy="38" rx="4.5" ry="2.5" fill="#FFC72C" />

          {/* Stylized Monogram H */}
          {/* Left Vertical Pillar */}
          <path
            d="M34 72 C34 68 37 65 41 65 L64 65 C68 65 71 68 71 72 L71 148 C71 162 55 171 42 167 C36 165 34 159 34 154 Z"
            fill="url(#hLeftGrad)"
          />

          {/* Right Curve Pillar / Arch */}
          <path
            d="M76 96 C86 83 99 76 114 78 C124 79 128 85 128 96 L128 154 C128 160 124 164 118 164 L102 164 C97 164 94 160 94 154 L94 119 C94 110 86 106 78 110 Z"
            fill="url(#hRightGrad)"
          />

          {/* Golden Orange Swoosh Wrapping the H */}
          <path
            d="M13 138 C10 153 21 160 31 151 C45 137 64 111 79 104 C99 94 118 81 138 45 C124 70 101 87 80 94 C60 102 36 121 23 132 C17 137 14 141 13 138 Z"
            fill="url(#swooshGrad)"
          />
          <path
            d="M21 142 C32 127 54 107 80 98 C102 91 121 76 138 45 C128 64 110 81 86 91 C65 98 41 117 26 134 Z"
            fill="#FFF59D"
            opacity="0.85"
          />

          {/* Sparkling 4-point Star */}
          <g filter="url(#starGlow)">
            <path
              d="M138 45 Q142 41 146 31 Q150 41 154 45 Q150 49 146 59 Q142 49 138 45 Z"
              fill="#FF9E0D"
            />
            <path
              d="M142 45 Q144 43 146 38 Q148 43 150 45 Q148 47 146 52 Q144 47 142 45 Z"
              fill="#FFFFFF"
            />
          </g>
        </g>

        {/* ================= TYPOGRAPHY ================= */}
        <g id="Typography" transform="translate(162, 0)">
          {/* Main Title: HKSURYA */}
          <text
            x="0"
            y="96"
            fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="900"
            fontSize="78"
            letterSpacing="-1.5"
            fill="url(#hkSuryaTextGrad)"
          >
            HKSURYA
          </text>

          {/* Subtitle: LEARNING */}
          <text
            x="6"
            y="128"
            fontFamily="'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif"
            fontWeight="800"
            fontSize="28"
            letterSpacing="8"
            fill={isDarkBg ? '#FFFFFF' : '#0B1E4A'}
          >
            LEARNING
          </text>

          {/* Tagline: LEARN • SKILL • GROW • SUCCEED */}
          {showTagline && (
            <g transform="translate(6, 156)">
              <text
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="700"
                fontSize="12.5"
                letterSpacing="4"
                fill={isDarkBg ? '#94A3B8' : '#334155'}
              >
                LEARN
              </text>
              <circle cx="70" cy="-4" r="3" fill="#FF7A00" />
              <text
                x="84"
                y="0"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="700"
                fontSize="12.5"
                letterSpacing="4"
                fill={isDarkBg ? '#94A3B8' : '#334155'}
              >
                SKILL
              </text>
              <circle cx="150" cy="-4" r="3" fill="#FF7A00" />
              <text
                x="164"
                y="0"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="700"
                fontSize="12.5"
                letterSpacing="4"
                fill={isDarkBg ? '#94A3B8' : '#334155'}
              >
                GROW
              </text>
              <circle cx="230" cy="-4" r="3" fill="#FF7A00" />
              <text
                x="244"
                y="0"
                fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
                fontWeight="700"
                fontSize="12.5"
                letterSpacing="4"
                fill={isDarkBg ? '#94A3B8' : '#334155'}
              >
                SUCCEED
              </text>
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
