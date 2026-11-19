import React from 'react';
import './IrisCuteBotAvatar.css';

/**
 * IrisCuteBotAvatar
 * Ultra-cute 3D Chibi Anime Robot Avatar for IRIS AI assistant.
 * Exactly matches the 3D porcelain companion bot:
 * - Floating cyber halo (cyan)
 * - Mecha cat ears (porcelain white with electric cyan inner facets & navy contour)
 * - Royal blue side headphone hubs
 * - Glossy porcelain white 3D head dome
 * - Cute expressive anime eyebrows
 * - Winged anime eyelashes (papri)
 * - Big sparkling cyan anime eyes with double catchlight sparkles & organic blinking
 * - Rosy pink blushing cheeks
 * - Cute anime smile (‿)
 * - Floating paws & diamond core
 */
export default function IrisCuteBotAvatar({
  className = '',
  size = 64,
  showPaws = true,
  isHappy = false,
}) {
  return (
    <div
      className={`iris-cute-bot ${isHappy ? 'iris-cute-bot--happy' : ''} ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 120 120"
        className="iris-cute-bot-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Porcelain Head Gradient */}
          <radialGradient id="irisPorcelainGrad" cx="45%" cy="38%" r="60%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="65%" stopColor="#f8fafc" />
            <stop offset="88%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Torso Gradient */}
          <radialGradient id="irisTorsoGrad" cx="48%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#f1f5f9" />
            <stop offset="100%" stopColor="#cbd5e1" />
          </radialGradient>

          {/* Royal Blue Headphone Hub Gradient */}
          <linearGradient id="irisEarHubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="45%" stopColor="#1d4ed8" />
            <stop offset="100%" stopColor="#172554" />
          </linearGradient>

          {/* Sparkling Cyan Iris Gradient */}
          <linearGradient id="irisEyeIrisGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#00b4d8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Soft Shadow Filter */}
          <filter id="irisSoftShadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.25" floodColor="#0f172a" />
          </filter>

          {/* Cyan Glow Filter for Halo & Core */}
          <filter id="irisCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="#00e5ff" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* ── 1. Floating Cyan Cyber Halo ── */}
        <g className="iris-bot-halo">
          <ellipse
            cx="60"
            cy="15"
            rx="23"
            ry="5.5"
            fill="none"
            stroke="#00e5ff"
            strokeWidth="2.8"
            filter="url(#irisCyanGlow)"
          />
        </g>

        {/* ── 2. Mecha-Kitty Ears ── */}
        {/* Left Ear */}
        <g className="iris-bot-ear iris-bot-ear--left">
          {/* Outer porcelain white ear with navy edge */}
          <polygon
            points="34,35 18,10 44,22"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Inner electric cyan facet */}
          <polygon
            points="33,32 24,15 39,24"
            fill="#00b4d8"
          />
        </g>

        {/* Right Ear */}
        <g className="iris-bot-ear iris-bot-ear--right">
          {/* Outer porcelain white ear with navy edge */}
          <polygon
            points="86,35 102,10 76,22"
            fill="#ffffff"
            stroke="#0f172a"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          {/* Inner electric cyan facet */}
          <polygon
            points="87,32 96,15 81,24"
            fill="#00b4d8"
          />
        </g>

        {/* ── 3. Headphone Ear Hubs (Royal Blue) ── */}
        {/* Left Hub */}
        <g className="iris-bot-hub-left">
          <rect
            x="7"
            y="52"
            width="9"
            height="18"
            rx="4.5"
            fill="url(#irisEarHubGrad)"
            stroke="#0f172a"
            strokeWidth="1"
          />
          <rect x="14" y="55" width="4" height="12" rx="2" fill="#0f172a" />
        </g>
        {/* Right Hub */}
        <g className="iris-bot-hub-right">
          <rect
            x="104"
            y="52"
            width="9"
            height="18"
            rx="4.5"
            fill="url(#irisEarHubGrad)"
            stroke="#0f172a"
            strokeWidth="1"
          />
          <rect x="102" y="55" width="4" height="12" rx="2" fill="#0f172a" />
        </g>

        {/* ── 4. Torso & Diamond Gem (visible if showPaws) ── */}
        {showPaws && (
          <g className="iris-bot-torso-group">
            {/* Chubby Torso */}
            <ellipse
              cx="60"
              cy="98"
              rx="20"
              ry="16"
              fill="url(#irisTorsoGrad)"
              filter="url(#irisSoftShadow)"
            />
            {/* Cyan Diamond Core */}
            <polygon
              points="60,90 66,97 60,105 54,97"
              fill="#00e5ff"
              filter="url(#irisCyanGlow)"
            />
            {/* Left Floating Paw */}
            <g className="iris-bot-paw iris-bot-paw--left">
              <ellipse cx="24" cy="95" rx="9" ry="8" fill="url(#irisPorcelainGrad)" filter="url(#irisSoftShadow)" />
              <circle cx="24" cy="96" r="3.5" fill="#00b4d8" />
            </g>
            {/* Right Floating Paw */}
            <g className="iris-bot-paw iris-bot-paw--right">
              <ellipse cx="96" cy="95" rx="9" ry="8" fill="url(#irisPorcelainGrad)" filter="url(#irisSoftShadow)" />
              <circle cx="96" cy="96" r="3.5" fill="#00b4d8" />
            </g>
          </g>
        )}

        {/* ── 5. Porcelain Head Dome ── */}
        <ellipse
          cx="60"
          cy="61"
          rx="47"
          ry="42"
          fill="url(#irisPorcelainGrad)"
          stroke="#f1f5f9"
          strokeWidth="1.2"
          filter="url(#irisSoftShadow)"
        />

        {/* Head 3D Specular Highlight */}
        <ellipse
          cx="56"
          cy="36"
          rx="22"
          ry="9"
          fill="#ffffff"
          opacity="0.65"
        />

        {/* ── 6. Anime Eyebrows ── */}
        <g className="iris-bot-eyebrows">
          <path
            d="M 33,42 Q 44,36 53,41"
            stroke="#0f172a"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 87,42 Q 76,36 67,41"
            stroke="#0f172a"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
        </g>

        {/* ── 7. Soft Rosy Blush Cheeks ── */}
        <g className="iris-bot-cheeks">
          <ellipse
            cx="29"
            cy="73"
            rx="11"
            ry="5.2"
            fill="#ff6b8b"
            className="iris-blush-oval"
          />
          <line x1="25" y1="71" x2="29" y2="75" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="30" y1="71" x2="34" y2="75" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />

          <ellipse
            cx="91"
            cy="73"
            rx="11"
            ry="5.2"
            fill="#ff6b8b"
            className="iris-blush-oval"
          />
          <line x1="87" y1="71" x2="91" y2="75" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
          <line x1="92" y1="71" x2="96" y2="75" stroke="#fb7185" strokeWidth="1.3" strokeLinecap="round" />
        </g>

        {/* ── 8. Cute Anime Smile (‿) ── */}
        <path
          d="M 53,72 Q 60,78 67,72"
          stroke="#00b4d8"
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
          className="iris-bot-mouth"
        />

        {/* ── 9. Sparkling Anime Eyes (With Organic Blinking) ── */}
        <g className="iris-bot-eyes-assembly">
          {/* LEFT EYE */}
          <g className="iris-bot-eye iris-bot-eye--left">
            {/* Cyan Iris */}
            <ellipse
              cx="41"
              cy="62"
              rx="11.5"
              ry="16"
              fill="url(#irisEyeIrisGrad)"
            />
            {/* Deep Pupil */}
            <ellipse
              cx="41"
              cy="63"
              rx="7"
              ry="11"
              fill="#031127"
            />
            {/* Giant Catchlight Sparkle (Top) */}
            <circle cx="44.5" cy="56" r="4.2" fill="#ffffff" />
            {/* Small Catchlight Sparkle (Bottom-Left) */}
            <circle cx="37" cy="69" r="2.2" fill="#ffffff" />
            {/* Bottom Cyan Iris Glow Arc */}
            <path
              d="M 35,71 Q 41,75 47,71"
              stroke="#7dd3fc"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Winged Anime Papri (Eyelashes) */}
            <path
              d="M 28,54 Q 41,45 54,54"
              stroke="#0f172a"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wing flare 1 */}
            <path
              d="M 31,48 L 22,43"
              stroke="#0f172a"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Wing flare 2 */}
            <path
              d="M 29,52 L 20,51"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>

          {/* RIGHT EYE */}
          <g className="iris-bot-eye iris-bot-eye--right">
            {/* Cyan Iris */}
            <ellipse
              cx="79"
              cy="62"
              rx="11.5"
              ry="16"
              fill="url(#irisEyeIrisGrad)"
            />
            {/* Deep Pupil */}
            <ellipse
              cx="79"
              cy="63"
              rx="7"
              ry="11"
              fill="#031127"
            />
            {/* Giant Catchlight Sparkle (Top) */}
            <circle cx="82.5" cy="56" r="4.2" fill="#ffffff" />
            {/* Small Catchlight Sparkle (Bottom-Left) */}
            <circle cx="75" cy="69" r="2.2" fill="#ffffff" />
            {/* Bottom Cyan Iris Glow Arc */}
            <path
              d="M 73,71 Q 79,75 85,71"
              stroke="#7dd3fc"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Winged Anime Papri (Eyelashes) */}
            <path
              d="M 66,54 Q 79,45 92,54"
              stroke="#0f172a"
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
            {/* Wing flare 1 */}
            <path
              d="M 89,48 L 98,43"
              stroke="#0f172a"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
            {/* Wing flare 2 */}
            <path
              d="M 91,52 L 100,51"
              stroke="#0f172a"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </g>
        </g>
      </svg>
    </div>
  );
}
