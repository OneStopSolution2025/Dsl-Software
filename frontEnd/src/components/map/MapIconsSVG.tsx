// SVG Icon Components for Map Markers
// Enhanced vector/illustration style with gradients and details

export interface IconProps {
  color?: string;
  size?: number;
}

// ==================== VEHICLES ====================
export const CarIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 122.88 43.49" xml:space="preserve">
    <g>
      <path fill={color} fillRule="evenodd" className="st0" d="M103.94,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76c-5.39,0-9.76-4.37-9.76-9.76 C94.18,28.34,98.55,23.97,103.94,23.97L103.94,23.97z M23,29.07v3.51h3.51C26.09,30.86,24.73,29.49,23,29.07L23,29.07z M26.52,34.87H23v3.51C24.73,37.97,26.09,36.6,26.52,34.87L26.52,34.87z M20.71,38.39v-3.51H17.2 C17.62,36.6,18.99,37.96,20.71,38.39L20.71,38.39z M17.2,32.59h3.51v-3.51C18.99,29.49,17.62,30.86,17.2,32.59L17.2,32.59z M105.09,29.07v3.51h3.51C108.18,30.86,106.82,29.49,105.09,29.07L105.09,29.07z M108.6,34.87h-3.51v3.51 C106.82,37.97,108.18,36.6,108.6,34.87L108.6,34.87z M102.8,38.39v-3.51h-3.51C99.71,36.6,101.07,37.96,102.8,38.39L102.8,38.39z M99.28,32.59h3.51v-3.51C101.07,29.49,99.71,30.86,99.28,32.59L99.28,32.59z M49.29,12.79c-1.54-0.35-3.07-0.35-4.61-0.28 C56.73,6.18,61.46,2.07,75.57,2.9l-1.94,12.87L50.4,16.65c0.21-0.61,0.33-0.94,0.37-1.55C50.88,13.36,50.86,13.15,49.29,12.79 L49.29,12.79z M79.12,3.13L76.6,15.6l24.13-0.98c2.48-0.1,2.91-1.19,1.41-3.28c-0.68-0.95-1.44-1.89-2.31-2.82 C93.59,1.86,87.38,3.24,79.12,3.13L79.12,3.13z M0.46,27.28H1.2c0.46-2.04,1.37-3.88,2.71-5.53c2.94-3.66,4.28-3.2,8.65-3.99 l24.46-4.61c5.43-3.86,11.98-7.3,19.97-10.2C64.4,0.25,69.63-0.01,77.56,0c4.54,0.01,9.14,0.28,13.81,0.84 c2.37,0.15,4.69,0.47,6.97,0.93c2.73,0.55,5.41,1.31,8.04,2.21l9.8,5.66c2.89,1.67,3.51,3.62,3.88,6.81l1.38,11.78h1.43v6.51 c-0.2,2.19-1.06,2.52-2.88,2.52h-2.37c0.92-20.59-28.05-24.11-27.42,1.63H34.76c3.73-17.75-14.17-23.91-22.96-13.76 c-2.67,3.09-3.6,7.31-3.36,12.3H2.03c-0.51-0.24-0.91-0.57-1.21-0.98c-1.05-1.43-0.82-5.74-0.74-8.23 C0.09,27.55-0.12,27.28,0.46,27.28L0.46,27.28z M21.86,23.97c5.39,0,9.76,4.37,9.76,9.76c0,5.39-4.37,9.76-9.76,9.76 c-5.39,0-9.76-4.37-9.76-9.76C12.1,28.34,16.47,23.97,21.86,23.97L21.86,23.97z"/>
    </g>
  </svg>
);

export const BikeIcon = ({ color = '#000000', size = 24 }: IconProps) => (
<svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 512 512" viewBox="0 0 512 512" id="motorcycle">

  <path fill={color} d="M207.8,185.4c26.1-29.9,52.4-48.9,97.3-39.7c-2.3,1.9-4.4,3.9-6.3,6.3C267.2,189.9,256,190.5,207.8,185.4z M512,356.8c0,47.3-38.5,85.7-85.8,85.7c-47.3,0-85.7-38.5-85.7-85.7c0-26.7,12.2-50.5,31.4-66.3l-15.4-24.4c-13.7,11.7-24.2,27.3-29.3,45.4l-17.5,62.1c-3.9,13.7-16.6,23.3-30.8,23.3h-69.6c-19,0-33.9-16.5-31.8-35.5c2.1-19,2.2-48.6-11.4-74.1l-14.1,14.9c12.2,14.8,19.5,33.8,19.5,54.4c0,47.3-38.5,85.7-85.8,85.7C38.5,442.5,0,404.1,0,356.8c0-47.3,38.5-85.8,85.7-85.8c19,0,36.5,6.3,50.7,16.7l17-17.9c-4.6-4.9-9.8-9.5-16.1-13.5c-26.5-16.9-96.7-55.9-117.5-67.5c-8.2-4.5-13.2-13.1-13.2-22.5c0-15.6,13.8-27.5,29.1-25.4l40.1,5.3c26.8,3.6,52.1,16.4,73.2,37.1c12.7,12.5,30.1,20.1,51.5,22.6c56.2,6.4,75.9,6.2,114.8-40.4c8.3-9.9,22.6-12.1,33.3-5l15.7,10.3c2.1,1.4,4.8,1.1,6.5-0.7c1.8-1.9,1.9-4.9,0.1-6.9l-28.3-32.1c-7-7.8-8.7-18.9-5.4-27.5l-29.4-13.9c-5.3-2.5-7.6-8.9-5.1-14.2c2.5-5.3,8.9-7.6,14.2-5.1l35.5,16.7h0.1c11-4.9,24.3-2.1,32.4,7.6l89.7,107c6.5,7.7,7.8,18.1,3.6,27.3c-4.3,9.1-13.1,14.8-23.2,14.8c-28,1.6-50.9-5-80.6,10.4l15.7,25c11-5.2,23.3-8.2,36.3-8.2C473.5,271.1,512,309.5,512,356.8z M122.1,333.9l-15.7,16.6c0.6,2,1.1,4.1,1.1,6.3c0,12-9.7,21.7-21.7,21.7c-12,0-21.7-9.7-21.7-21.7c0-12,9.7-21.7,21.7-21.7c1.8,0,3.5,0.3,5.2,0.7l15.7-16.6c-6.2-3.5-13.3-5.5-20.9-5.5c-23.7,0-43.1,19.3-43.1,43.1c0,23.7,19.3,43.1,43.1,43.1c23.7,0,43.1-19.3,43.1-43.1C128.8,348.4,126.3,340.5,122.1,333.9z M469.3,356.8c0-23.7-19.3-43.1-43.1-43.1c-4.6,0-9,0.7-13.2,2.1l12.2,19.3c0.3,0,0.7-0.1,1-0.1c12,0,21.7,9.7,21.7,21.7c0,12-9.7,21.7-21.7,21.7c-12,0-21.7-9.7-21.7-21.7c0-3.7,1-7.2,2.7-10.2L395,327.3c-7.3,7.7-11.8,18.1-11.8,29.6c0,23.7,19.3,43.1,43.1,43.1C450,399.9,469.3,380.6,469.3,356.8z"></path>
</svg>
);

export const PickupTruckIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cargo bed - solid */}
    <rect x="2" y="6" width="10" height="6" rx="0.8" fill={color} />
    <rect x="2.5" y="6.5" width="9" height="2" fill="rgba(255,255,255,0.2)" />
    {/* Cab - solid */}
    <path d="M12 8H15L17.5 11V13H12V8Z" fill={color} />
    {/* Window */}
    <path d="M13 9L15 9L16.5 10.5V12H13V9Z" fill="rgba(255,255,255,0.3)" />
    {/* Wheels - solid */}
    <circle cx="5.5" cy="13" r="2" fill="#2C2C2C" />
    <circle cx="14.5" cy="13" r="2" fill="#2C2C2C" />
    <circle cx="5.5" cy="13" r="0.9" fill="#5C5C5C" />
    <circle cx="14.5" cy="13" r="0.9" fill="#5C5C5C" />
    {/* Headlight */}
    <circle cx="17" cy="10" r="0.5" fill="#FFE57F" opacity="0.8" />
  </svg>
);

export const LorryIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Container - solid */}
    <rect x="1.5" y="6" width="12" height="7" rx="0.8" fill={color} />
    {/* Container details */}
    <line x1="4" y1="6" x2="4" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="6.5" y1="6" x2="6.5" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="9" y1="6" x2="9" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    <line x1="11.5" y1="6" x2="11.5" y2="13" stroke="rgba(255,255,255,0.2)" strokeWidth="1"/>
    {/* Cab - solid */}
    <path d="M13.5 8H16L18 10.5V13.5H13.5V8Z" fill={color} />
    {/* Window */}
    <path d="M14.5 9H15.5L17 10.5V12H14.5V9Z" fill="rgba(255,255,255,0.3)" />
    {/* Wheels - solid */}
    <circle cx="5" cy="13.5" r="1.8" fill="#2C2C2C" />
    <circle cx="11" cy="13.5" r="1.8" fill="#2C2C2C" />
    <circle cx="16" cy="13.5" r="1.8" fill="#2C2C2C" />
    <circle cx="5" cy="13.5" r="0.8" fill="#5C5C5C" />
    <circle cx="11" cy="13.5" r="0.8" fill="#5C5C5C" />
    <circle cx="16" cy="13.5" r="0.8" fill="#5C5C5C" />
  </svg>
);

export const VanIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body - solid */}
    <rect x="2" y="6" width="14" height="7" rx="0.8" fill={color} />
    {/* Windows */}
    <rect x="3" y="7" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="6" y="7" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="9" y="7" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="12" y="7" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.3)" />
    {/* Side detail line */}
    <line x1="2" y1="10" x2="16" y2="10" stroke="rgba(0,0,0,0.2)" strokeWidth="0.5"/>
    {/* Cab extension */}
    <path d="M16 9L18 10.5V13H16V9Z" fill={color} />
    {/* Wheels - solid */}
    <circle cx="5.5" cy="13.5" r="2" fill="#2C2C2C" />
    <circle cx="14" cy="13.5" r="2" fill="#2C2C2C" />
    <circle cx="5.5" cy="13.5" r="0.9" fill="#5C5C5C" />
    <circle cx="14" cy="13.5" r="0.9" fill="#5C5C5C" />
    {/* Headlight */}
    <circle cx="17.5" cy="11" r="0.5" fill="#FFE57F" opacity="0.8" />
  </svg>
);

export const BusIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Body - solid */}
    <rect x="3" y="4" width="14" height="10" rx="1.5" fill={color} />
    {/* Windows - front row */}
    <rect x="4" y="5" width="2.8" height="2.5" rx="0.4" fill="rgba(255,255,255,0.4)" />
    <rect x="7.2" y="5" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.4)" />
    <rect x="10.3" y="5" width="2.5" height="2.5" rx="0.4" fill="rgba(255,255,255,0.4)" />
    <rect x="13.2" y="5" width="2.8" height="2.5" rx="0.4" fill="rgba(255,255,255,0.4)" />
    {/* Side windows */}
    <rect x="4" y="9" width="2" height="3" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="6.5" y="9" width="2" height="3" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="11" y="9" width="2" height="3" rx="0.4" fill="rgba(255,255,255,0.3)" />
    <rect x="13.5" y="9" width="2" height="3" rx="0.4" fill="rgba(255,255,255,0.3)" />
    {/* Wheels - solid */}
    <circle cx="6.5" cy="15" r="1.8" fill="#2C2C2C" />
    <circle cx="13.5" cy="15" r="1.8" fill="#2C2C2C" />
    <circle cx="6.5" cy="15" r="0.8" fill="#5C5C5C" />
    <circle cx="13.5" cy="15" r="0.8" fill="#5C5C5C" />
    {/* Headlights */}
    <circle cx="4.5" cy="12" r="0.5" fill="#FFE57F" opacity="0.8" />
    <circle cx="15.5" cy="12" r="0.5" fill="#FFE57F" opacity="0.8" />
  </svg>
);

// ==================== PEDESTRIANS ====================
export const ManIcon = ({ color = '#5AC1F2', size = 24 }: IconProps) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" clip-rule="evenodd" viewBox="0 0 197 513.12">
    <path fill={color} fill-rule="nonzero" d="M98.5 0c23.85 0 43.18 19.33 43.18 43.18 0 23.84-19.33 43.17-43.18 43.17S55.32 67.02 55.32 43.18C55.32 19.33 74.65 0 98.5 0zm54.56 162.57v326.67c0 13.13-10.74 23.88-23.87 23.88s-23.87-10.74-23.87-23.88V297.16H92.31v192.08c0 13.13-10.75 23.88-23.87 23.88-13.13 0-23.88-10.74-23.88-23.88V162.57h-8.34V282.6c0 23.95-36.22 23.95-36.22 0V153.42c-.04-21 7.07-35.73 19.94-45.42 22.12-16.68 134.96-16.69 157.1-.02 12.88 9.69 20 24.43 19.96 45.44V282.6c0 23.95-36.22 23.95-36.22 0V162.57h-7.72z"/>
  </svg>
);

export const WomanIcon = ({ color = '#F576AB', size = 24 }: IconProps) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" clip-rule="evenodd" viewBox="0 0 268 511.71">
    <path fill={color} d="M82.08 168.2L30.15 383.23h51.93v104.68c0 13.09 10.71 23.8 23.81 23.8 13.09 0 23.81-10.71 23.81-23.8V383.23h9.38v104.68c0 13.09 10.71 23.8 23.81 23.8 13.09 0 23.8-10.71 23.8-23.8V383.23h49l-49-209.44v-11.66h7.7l.54-.14 36.74 130.7c2.76 9.84 12.98 15.58 22.82 12.82s15.58-12.98 12.82-22.82l-37.23-132.43c-.22-.78-.48-1.54-.79-2.26-4.72-19.64-6.82-31.38-18.69-40.32-22.07-16.62-128.71-16.61-150.78.02C47 117.37 42.34 132.14 36.75 153l.37.09L.69 282.69c-2.76 9.84 2.98 20.06 12.82 22.82 9.84 2.76 20.06-2.98 22.82-12.82l36.75-130.73.68.17h8.32v6.07zM134.07 0c23.78 0 43.06 19.28 43.06 43.06s-19.28 43.05-43.06 43.05c-23.77 0-43.05-19.27-43.05-43.05C91.02 19.28 110.3 0 134.07 0z"/>
  </svg>
);

export const ChildIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 104.9 122.88">
    <g>
      <path fill={color} d="M52.5,0C64.3,0,73.86,9.46,73.86,21.14c0,11.67-9.56,21.14-21.36,21.14c-11.8,0-21.36-9.46-21.36-21.14 C31.14,9.46,40.7,0,52.5,0L52.5,0z M74.61,64.75l16.72,12.69c8.01,6.08,18.75-4.67,10.75-10.75L74.61,45.85v-0.1l-44.2,0v0.02 l-0.02-0.02L2.82,66.79c-7.99,6.1,2.76,16.85,10.75,10.75l16.84-12.85l0,28.69h2.29v21.91c0,4.18,3.42,7.6,7.6,7.6 c4.18,0,7.6-3.42,7.6-7.6V93.37h9.21v21.91c0,4.18,3.42,7.6,7.6,7.6c4.18,0,7.6-3.42,7.6-7.6V93.37h2.29V64.75L74.61,64.75 L74.61,64.75z"/>
    </g>
  </svg>
);

// ==================== DIRECTIONAL ARROWS ====================
export const StraightArrowIcon = ({ color = '#059669', size = 24 }: IconProps) => (
  <svg width={size} height={size} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
    <path fill="#d92d27" fillRule="evenodd" d="M118.22,38a61.53,61.53,0,1,1-13.34-20,61.29,61.29,0,0,1,13.34,20ZM61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path fill="#fff" fillRule="evenodd" d="M61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path d="M51.64,91.56V59.85H41.2a3.76,3.76,0,0,1-3.2-1.5c-1.67-2.51.63-5,2.2-6.74,4.49-4.94,16.14-16.28,18.36-18.89a3.66,3.66,0,0,1,5.76,0c2.3,2.68,14.5,14.55,18.78,19.36,1.49,1.67,3.32,4,1.78,6.27a3.76,3.76,0,0,1-3.2,1.5H71.24V91.56Z"/>
  </svg>
);

export const TurnArrowIcon = ({ color = '#DC2626', size = 24 }: IconProps) => (

  <svg width={size} height={size} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
    <path className="cls-1" fill="#d92d27" fillRule="evenodd" d="M118.22,38a61.53,61.53,0,1,1-13.34-20,61.29,61.29,0,0,1,13.34,20ZM61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path className="cls-2" fill="#fff" fillRule="evenodd" d="M61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path d="M69.46,65.54a3.06,3.06,0,0,0,1.24,2.59c2.06,1.38,4.1-.52,5.54-1.81,4.07-3.69,15.22-12.56,17.37-14.39a3,3,0,0,0,0-4.75C91.41,45.3,79.81,36,75.85,32.44,74.48,31.22,72.6,29.71,70.7,31a3,3,0,0,0-1.24,2.58v8.81c-11.08-.4-16.68,1.89-21.32,7.16s-6,12.55-6,22.57v19H55.34v-19c0-6.88.62-11.54,2.68-13.88,1.89-2.15,4.42-3,11.44-2.71v10Z"/>
  </svg>

);

export const UTurnArrowIcon = ({ color = '#2563EB', size = 24 }: IconProps) => (
  <svg width={size} height={size} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88">
    <path fill="#d92d27" fillRule="evenodd" d="M118.22,38a61.53,61.53,0,1,1-13.34-20,61.29,61.29,0,0,1,13.34,20ZM61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path fill="#fff" fillRule="evenodd" d="M61.44,12.08A49.36,49.36,0,1,1,12.08,61.44,49.36,49.36,0,0,1,61.44,12.08Z"/>
    <path d="M80,80.09V46.67a20,20,0,0,0-5.59-13.9,18.52,18.52,0,0,0-26.94,0,20,20,0,0,0-5.59,13.9V83.86H53.65V46.67A7.68,7.68,0,0,1,55.8,41.3a7.11,7.11,0,0,1,10.3,0,7.68,7.68,0,0,1,2.15,5.37V80.09H60L73.67,95.92,87.92,80.09Z"/>
  </svg>
)

export const RailwayCrossingIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 105.59">
    {/* <defs><style>.cls-1{fill:#fff;}.cls-2{fill:#d92d27;}.cls-3{fill-rule:evenodd;}</style></defs> */}
    <title>railway-crossing-sign</title>
    <polygon fill="#fff" fillRule="evenodd" points="12.82 96.3 110.06 96.3 60.48 13.85 12.82 96.3 12.82 96.3"/>
    <path fill="#d92d27" fillRule="evenodd" d="M12.73,96.26H110L60.39,13.81,12.73,96.26Zm105.48,9.33H4.66A4.71,4.71,0,0,1,2.32,105,4.67,4.67,0,0,1,.63,98.59L56.28,2.32A4.74,4.74,0,0,1,57.92.66a4.65,4.65,0,0,1,6.38,1.6L122,98.21a4.66,4.66,0,0,1-3.79,7.38Z"/>
    <path fill="#000" fillRule="evenodd" d="M41.32,80V75.6h3.25V66.5H41.32V62.09h3.25V57.53c0-.07,3.77-6.63,4.16-7.33.39.69,4.16,7.25,4.16,7.33v4.56h4V57.53c0-.07,3.78-6.63,4.17-7.33.39.69,4.16,7.25,4.16,7.33v4.56h4V57.53c0-.07,3.77-6.63,4.16-7.33.39.69,4.16,7.25,4.16,7.33v4.56h4V66.5h-4v9.1h4V80h-4v7.44a.1.1,0,0,1-.09.1H69.29a.1.1,0,0,1-.1-.1V80h-4v7.44a.1.1,0,0,1-.1.1H57a.1.1,0,0,1-.1-.1V80h-4v7.44a.1.1,0,0,1-.1.1H44.67a.09.09,0,0,1-.1-.1V80ZM52.89,66.5v9.1h4V66.5Zm12.31,0v9.1h4V66.5Z"/>
  </svg>
)

export const ImpactBlastIcon = ({ color = '#FF0000', size = 24 }: IconProps) => (
  <svg width={size} height={size} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 122.88 109.14">
    <defs>
        <linearGradient id="grad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="yellow" />
          <stop offset="100%" stop-color="red" />
        </linearGradient>
      </defs>
    <g>
    <polygon fill="url(#grad3)" points="0,70.16 21.75,84.72 6.56,42.05 29.34,64.41 26.46,12.31 54.57,53.75 57.23,27.28 65.44,50.26 79.8,0 80.83,56.62 93.54,42.05 91.9,61.95 122.88,32.21 102.16,93.54 122.47,86.57 109.14,109.14 86.87,109.14 91.29,84.9 74.91,100.7 72.4,83.16 69.3,92.87 63.49,82.1 62.32,93.57 48.72,76.59 48.97,102.36 37.13,92.65 38.56,109.14 18.5,109.14 0,70.16"/>
        
    </g>
  </svg>
);

// ==================== ENVIRONMENT ====================
export const TreeIcon = ({ color = '#16A34A', size = 24 }: IconProps) => (

  <svg width={size} height={size} id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 121.38">
    <path fill="#8c5d0f" d="M81.53,72.75l5,3.46c-.81,1.9-1.53,3.57-2.19,5.11-6.13,14.24-7.83,18.19-8.21,38l0,2.06H49.42v-2.09c0-19.82-.54-20.63-8-31.87-1.4-2.11-3.7-5.71-5.68-8.81,1.66-14.28,34.36-12.79,45.81-5.86Z"/>
    <polygon fill="#af7311" points="67.62 95.31 67.62 106.38 67.62 108.47 65.53 108.47 62.21 108.47 62.21 104.29 63.44 104.29 63.44 95.32 67.62 95.32 67.62 95.31 67.62 95.31"/>
    <polygon fill="#af7311" points="52.94 79.11 61.41 93.13 57.83 95.28 49.35 81.27 52.94 79.11 52.94 79.11 52.94 79.11"/>
    <path fill="#56b320" d="M31.47,80.06l4.19-1.55h0a37.64,37.64,0,0,0,10.18-7,43.48,43.48,0,0,0,3.22,3.17c4.29,3.73,8.73,5.74,13.24,5.9s9.07-1.52,13.5-5.19a34.8,34.8,0,0,0,2.87-2.66l5.2,3.61a20.55,20.55,0,0,0,3.44,1.47,14.8,14.8,0,0,0,11-.49,18.36,18.36,0,0,0,8.06-7.81A36.16,36.16,0,0,0,110.55,55c6.31-4.34,10-9.18,11.51-13.89A15.46,15.46,0,0,0,122,30.93a17.3,17.3,0,0,0-6.23-8c-4.39-3.21-10.65-5.13-18.12-4.95-1.23-1.81-2.5-3.49-3.78-5C87.56,5.36,80.88,1.34,74.08.29S60.37,1.16,53.75,5.5C52.6,6.24,51.46,7.08,50.3,8,39.23,3,28.58,2.59,20,5.17A30.22,30.22,0,0,0,6.57,13.22,23.65,23.65,0,0,0,.19,26.45c-.76,5.93.73,12.48,5.15,19C2.45,55,3,63.05,5.74,69.07a20.41,20.41,0,0,0,8.14,9.17A21,21,0,0,0,25.78,81a25.79,25.79,0,0,0,5.69-1Zm0,0Z"/>
    <path fill="#4da11d" d="M86.17,17.68c-3.54-5.07-7.55-8-11.83-9.18-4.53-1.23-9.28-.44-14.06,2-.81.41-1.64.88-2.47,1.41l2.49,3.27.16.09c.84-.53,1.68-1,2.5-1.42,4.78-2.42,9.53-3.22,14.06-2a19.46,19.46,0,0,1,9.15,5.84ZM9.43,51.21C8,57.72,8.73,63.08,10.86,67a13.93,13.93,0,0,0,4.89,5.22,14.23,14.23,0,0,1-1.65-2.41c-2.15-3.93-2.89-9.33-1.4-15.91l-.09-.11L9.43,51.21ZM19.56,12a20.38,20.38,0,0,0-9.08,5.45,16,16,0,0,0-4.32,9c-.52,4,.49,8.45,3.49,12.87l0,.13,3,2.79A18.53,18.53,0,0,1,9.19,29.38a16.05,16.05,0,0,1,4.32-8.95A20.38,20.38,0,0,1,22.59,15c5.77-1.73,12.91-1.45,20.35,1.84-5.82-6-15.48-7.24-23.38-4.87Z"/>
  </svg>
);

export const GrassVergeIcon = ({ color = '#84CC16', size = 24 }: IconProps) => (

  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" id="grass">
    <path fill="#67bc46" d="m93.83 475.43 30.484-19.523a512.78 512.78 0 0 1-16.631-43.706 511.714 511.714 0 0 1-25.503-147.16 310.12 310.12 0 0 0-10.901 121.685l.055.52a323.485 323.485 0 0 0 13.048 62.097 329.61 329.61 0 0 0 9.449 26.088Z"></path>
    <path fill="#5dae47" d="M94.19 504.515h36.327a513.86 513.86 0 0 1-2.178-81.406c.086-1.667.185-3.333.284-4.986a512.012 512.012 0 0 1 29.242-141.421 310.168 310.168 0 0 0-54.228 109.477 320.47 320.47 0 0 0-7.78 37.675 328.93 328.93 0 0 0-1.667 80.661Z"></path>
    <path fill="#74bf4b" d="M111.467 504.515h-36.2a512.778 512.778 0 0 0-9.567-45.774A511.714 511.714 0 0 0 7.805 321.064a310.12 310.12 0 0 1 74.81 96.591l.234.468a323.485 323.485 0 0 1 22.504 59.327 329.602 329.602 0 0 1 6.114 27.065Z"></path>
    <path fill="#5dae47" d="M288.577 505.015h-41.034a270.066 270.066 0 0 0-10.845-51.887c-17.253-54.858-48.532-92.575-70.045-114.113 40.487 17.308 76.28 39.531 95.69 80.524 6.42 13.557 11.173 27.817 15.524 42.149 1.182 3.893 10.666 43.327 10.71 43.327Z"></path>
    <path fill="#67bc46" d="M389.338 429.302h-51.22a724.527 724.527 0 0 0 3.07-114.78c-.12-2.35-.26-4.7-.4-7.03a721.922 721.922 0 0 0-41.23-199.4 437.328 437.328 0 0 1 76.46 154.36 451.85 451.85 0 0 1 10.97 53.12 463.782 463.782 0 0 1 2.35 113.73Z"></path>
    <path fill="#5dae47" d="M354.465 504.515h51.04a723.01 723.01 0 0 1 13.49-64.54 721.5 721.5 0 0 1 81.63-194.12 437.259 437.259 0 0 0-105.48 136.19l-.33.66a456.104 456.104 0 0 0-31.73 83.65 464.74 464.74 0 0 0-8.62 38.16Z"></path>
    <path fill="#5dae47" d="M188.385 110.985a848.733 848.733 0 0 1 110.35 255.62 862.28 862.28 0 0 1 22.49 137.91h51.41a605.16 605.16 0 0 0-3.62-38.16 603.562 603.562 0 0 0-14.47-75.57 594.658 594.658 0 0 0-18.3-58.15 578.83 578.83 0 0 0-147.86-221.65Z"></path>
    <path fill="#74bf4b" d="M504.635 110.985a848.734 848.734 0 0 0-110.35 255.62 862.283 862.283 0 0 0-22.49 137.91h-51.41c.74-11.81 1.9-24.58 3.62-38.16a603.564 603.564 0 0 1 14.47-75.57 594.636 594.636 0 0 1 18.3-58.15 578.83 578.83 0 0 1 147.86-221.65Z"></path>
    <path fill="#67bc46" d="M332.625 504.515h-51.04a722.988 722.988 0 0 0-13.49-64.54 721.5 721.5 0 0 0-81.63-194.12 437.259 437.259 0 0 1 105.48 136.19l.33.66a456.103 456.103 0 0 1 31.73 83.65 464.72 464.72 0 0 1 8.62 38.16Z"></path>
    <path fill="#b28966" d="M504.365 512.015h-497a7.5 7.5 0 1 1 0-15h497a7.5 7.5 0 0 1 0 15Z"></path>
  </svg>
);

export const DrainIcon = ({ color = '#6B7280', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`drain-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.7" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </linearGradient>
      <pattern id={`drain-pattern-${color}`} x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect width="2" height="4" fill={color} fillOpacity="0.3"/>
      </pattern>
    </defs>
    {/* Drain grate */}
    <rect x="4" y="9" width="16" height="10" rx="1.5" fill={`url(#drain-grad-${color})`} stroke={color} strokeWidth="1.5"/>
    {/* Grate bars */}
    <line x1="7" y1="9" x2="7" y2="19" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="10" y1="9" x2="10" y2="19" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="13" y1="9" x2="13" y2="19" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4"/>
    <line x1="16" y1="9" x2="16" y2="19" stroke="#fff" strokeWidth="1.5" strokeOpacity="0.4"/>
    {/* Cross bars */}
    <line x1="4" y1="12" x2="20" y2="12" stroke="#fff" strokeWidth="1" strokeOpacity="0.3"/>
    <line x1="4" y1="16" x2="20" y2="16" stroke="#fff" strokeWidth="1" strokeOpacity="0.3"/>
    {/* Depth indicator */}
    <circle cx="12" cy="14" r="1.5" fill="#000" fillOpacity="0.3"/>
  </svg>
);

// ==================== TRAFFIC ====================
export const TrafficLightIcon = ({ color: _color = '#EAB308', size = 24 }: IconProps) => (
//   <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
//     <defs>
//       <linearGradient id={`traffic-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
//         <stop offset="0%" stopColor={color} stopOpacity="0.8" />
//         <stop offset="100%" stopColor={color} stopOpacity="1" />
//       </linearGradient>
//     </defs>
//     {/* Housing */}
//     <rect x="8" y="4" width="8" height="17" rx="2" fill={`url(#traffic-grad-${color})`} stroke={color} strokeWidth="1.5"/>
//     {/* Lights with glow effect */}
//     <circle cx="12" cy="8" r="2.2" fill="#FF0000" stroke={color} strokeWidth="0.8"/>
//     <circle cx="12" cy="8" r="1.5" fill="#FF0000" opacity="0.6"/>
//     <circle cx="12" cy="13" r="2.2" fill="#FFA500" stroke={color} strokeWidth="0.8"/>
//     <circle cx="12" cy="13" r="1.5" fill="#FFA500" opacity="0.6"/>
//     <circle cx="12" cy="18" r="2.2" fill="#00FF00" stroke={color} strokeWidth="0.8"/>
//     <circle cx="12" cy="18" r="1.5" fill="#00FF00" opacity="0.6"/>
//     {/* Pole */}
//     <rect x="11" y="21" width="2" height="2" fill={color}/>
//   </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 128 128">
    <path fill="#424242" d="M83.05 124h-38.1c-5.26 0-9.53-4.27-9.53-9.53V13.53c0-5.26 4.27-9.53 9.53-9.53h38.11c5.26 0 9.53 4.27 9.53 9.53v100.94c-.01 5.26-4.27 9.53-9.54 9.53z"/>
        <circle cx="64" cy="102.92" r="13.41" fill="#4CAF50"/>
        <path fill="#6FD86F" d="M54.64 104.09c-1.14-.36-1.45-4.36 1.22-7.57c3.98-4.79 9.71-4.67 10.32-2.12c.85 3.57-3.67 2.16-7.11 5.04c-2.15 1.8-2.62 5.22-4.43 4.65z"/>
        <circle cx="64" cy="66.21" r="13.41" fill="#FFCA28"/>
        <path fill="#FFF59D" d="M54.64 67.39c-1.14-.36-1.45-4.36 1.22-7.57c3.98-4.79 9.71-4.67 10.32-2.12c.85 3.57-3.67 2.16-7.11 5.04c-2.15 1.8-2.62 5.22-4.43 4.65z"/>
        <circle cx="64" cy="29.5" r="13.41" fill="#F44336"/>
        <path fill="#FF8155" d="M54.64 30.68c-1.14-.36-1.45-4.36 1.22-7.57c3.98-4.79 9.71-4.67 10.32-2.12c.85 3.57-3.67 2.16-7.11 5.04c-2.15 1.8-2.62 5.22-4.43 4.65z"/>
        <path fill="#757575" d="M49.48 23.12c-.47.92-1.89.88-1.76-.52c.32-3.41 2.26-6.09 3.85-7.73c3.16-3.32 7.8-5.21 12.43-5.2c4.63-.02 9.27 1.88 12.44 5.19c1.59 1.64 3.85 5.3 3.86 7.85c0 1.11-1.26 1.41-1.72.51c-1.15-2.24-4.71-9.55-14.57-9.55c-9.88 0-13.39 7.23-14.53 9.45zm0 73.5c-.47.92-1.89.88-1.76-.52c.32-3.41 2.26-6.09 3.85-7.73c3.16-3.32 7.8-5.21 12.43-5.2c4.63-.02 9.27 1.88 12.44 5.19c1.59 1.64 3.85 5.3 3.86 7.85c0 1.11-1.26 1.41-1.72.51c-1.15-2.24-4.71-9.55-14.57-9.55c-9.88 0-13.39 7.24-14.53 9.45zm0-36.75c-.47.92-1.89.88-1.76-.52c.32-3.41 2.26-6.09 3.85-7.73c3.16-3.32 7.8-5.21 12.43-5.2c4.63-.02 9.27 1.88 12.44 5.19c1.59 1.64 3.85 5.3 3.86 7.85c0 1.11-1.26 1.41-1.72.51c-1.15-2.24-4.71-9.55-14.57-9.55s-13.39 7.23-14.53 9.45z"/>
    </svg>
);

export const CCTVIcon = ({ color = '#475569', size = 24 }: IconProps) => (

  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" id="cctv">
    <path fill="#7c7d7d" d="M9 35c0 8.23.2 8.71-.54 10C7 47.47 4.77 47 1 47V31h4a4 4 0 0 1 4 4Z"></path>
    <path fill="#919191" d="M9 35c0 8.23.2 8.71-.54 10H7a4 4 0 0 1-4-4V31h2a4 4 0 0 1 4 4Z"></path>
    <path fill="#374f68" d="M19.54 41H9v-4h10.54a4 4 0 0 0 0 4Z"></path>
    <circle cx="23" cy="39" r="4" fill="#7c7d7d"></circle>
    <path fill="#2c435e" d="M19.36 37a4 4 0 0 0-1.23 4h1.41a4 4 0 0 1 0-4Z"></path>
    <path fill="#919191" d="M26.28 41.28a4 4 0 0 1-5.56-5.56 4 4 0 0 1 5.56 5.56Z"></path>
    <path fill="#374f68" d="M25 23.53v12a4 4 0 0 0-4 0V22.46Z"></path>
    <path fill="#2c435e" d="M21 22.46v2l4 1.07v-2l-4-1.07z"></path>
    <path fill="#7c7d7d" d="M29.47 20.59 29 22.52a2 2 0 0 1-2.45 1.42l-5.8-1.56a2 2 0 0 1-1.41-2.45l.48-1.93Z"></path>
    <path fill="#747575" d="m19.82 18-.32 1.18 9 2.41a16.3 16.3 0 0 1-.62 2.23c1-.48 1.08-1.19 1.62-3.23Z"></path>
    <path fill="#dad7e5" d="m40 16-1.83 6.92-25.12-6.73c2.68-10 1.48-5.48 2.3-8.56L28 11l1 2Z"></path>
    <path fill="#edebf2" d="M40 16c-1.23 4.66-1 3.7-1.32 5L19 15.71a2 2 0 0 1-1.41-2.45c1.24-4.62 1-3.71 1.26-4.7L28 11l1 2Z"></path>
    <path fill="#374f68" d="m44.36 15.26-1.55 5.8-3.87-1.04L40 16l1.51-1.51 2.85.77z"></path>
    <path fill="#2c435e" d="M44.36 15.26 43.9 17 40 16c0-.1-.06 0 1.52-1.54Z"></path>
    <path fill="#7c7d7d" d="m47 9-7 7-11-3-1-2-15-4 2-6c6.81 1.69-1.06-.27 32 8Z"></path>
    <path fill="#c6c3d8" d="m15.152 8.379.2-.754 3.48.928-.202.753z"></path>
    <path fill="#dad7e5" d="M37.64 15.36 37 16l-11-3-1-2-6.37-1.69.2-.75L28 11l1 2 8.64 2.36z"></path>
    <path fill="#919191" d="m47 9-7 7-11-3-1-2-9.11-2.43 1.66-6.19Z"></path>
    <path fill="#231f20" d="M48 8.73c-.24-.86 1.49-.15-32.72-8.7a1 1 0 0 0-1.19.65l-2 6A1 1 0 0 0 12.74 8l1.38.36-.6 2.24A8.28 8.28 0 0 0 4 18.77V30H1a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a5 5 0 0 0 5-5v-1h9a5 5 0 1 0 7-7c0-11.72-.1-10.22.25-10.13a3 3 0 0 0 3.67-2.12l.26-1c9.72 2.61 8.5 3.07 9.47-.56a23.16 23.16 0 0 0 3.16.81 1 1 0 0 0 1-.75l1.56-5.79a1 1 0 0 0-.71-1.23L43.44 14c4.61-4.64 4.73-4.52 4.56-5.27Zm-35 3.8-.92 3.4a1 1 0 0 0 .71 1.23l5.8 1.55-.26 1A3 3 0 0 0 20 23.18V35a4.46 4.46 0 0 0-1 1h-9v-1a5 5 0 0 0-4-4.9V18.77a6.27 6.27 0 0 1 7-6.24ZM8 43a3 3 0 0 1-3 3H2V32h3a3 3 0 0 1 3 3Zm2-3v-2h8.1a5 5 0 0 0 0 2Zm13 2a3 3 0 1 1 3-3 3 3 0 0 1-3 3Zm1-7.9a5 5 0 0 0-2 0V23.76l2 .54Zm4-11.84a1 1 0 0 1-1.22.71L21 21.42a1 1 0 0 1-.71-1.23l.26-1 7.73 2.07Zm9.47-.57-23.2-6.21 1.79-6.63 11.25 3 .8 1.6c.28.57-.08.32 10.69 3.26ZM43.14 16l-1 3.86-1.93-.52c.91-3.39.53-2.6 1.63-3.7Zm-3.44-1.12-10-2.73-.8-1.6c-.28-.57.44-.23-14.6-4.24l1.37-4.12L45 9.54Z"></path>
    <path fill="#231f20" d="M23 38a1 1 0 0 0 0 2 1 1 0 0 0 0-2Z"></path>
</svg>
);

export const PedestrianCrossingIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`crossing-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* Zebra crossing stripes */}
    <rect x="5" y="7" width="2.5" height="10" fill={`url(#crossing-grad-${color})`} rx="0.5"/>
    <rect x="8.5" y="7" width="2.5" height="10" fill={`url(#crossing-grad-${color})`} rx="0.5"/>
    <rect x="12" y="7" width="2.5" height="10" fill={`url(#crossing-grad-${color})`} rx="0.5"/>
    <rect x="15.5" y="7" width="2.5" height="10" fill={`url(#crossing-grad-${color})`} rx="0.5"/>
    {/* Road lines */}
    <line x1="3" y1="7" x2="21" y2="7" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="3" y1="17" x2="21" y2="17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Pedestrian figure (small) */}
    <circle cx="10" cy="4" r="0.8" fill={color}/>
    <path d="M10 4.8V6M10 6L9.2 7.5M10 6L10.8 7.5M9.5 5.5H10.5" stroke={color} strokeWidth="0.6" strokeLinecap="round"/>
  </svg>
);

export const YellowBoxIcon = ({ color = '#FCD34D', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`yellowbox-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
        <stop offset="100%" stopColor={color} stopOpacity="0.1" />
      </linearGradient>
    </defs>
    {/* Box outline */}
    <rect x="4" y="8" width="16" height="8" stroke={color} strokeWidth="2.5" fill={`url(#yellowbox-grad-${color})`} rx="1"/>
    {/* Diagonal hatching */}
    <line x1="4" y1="8" x2="20" y2="16" stroke={color} strokeWidth="2" strokeOpacity="0.8"/>
    <line x1="20" y1="8" x2="4" y2="16" stroke={color} strokeWidth="2" strokeOpacity="0.8"/>
    {/* Additional warning lines */}
    <line x1="12" y1="8" x2="12" y2="16" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
    <line x1="4" y1="12" x2="20" y2="12" stroke={color} strokeWidth="1.5" strokeOpacity="0.5"/>
  </svg>
);

export const NoEntryIcon = ({ color = '#DC2626', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <radialGradient id={`noentry-grad-${color}`}>
        <stop offset="0%" stopColor="#fff" stopOpacity="0.3" />
        <stop offset="70%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </radialGradient>
    </defs>
    {/* Circle background */}
    <circle cx="12" cy="12" r="9" fill={`url(#noentry-grad-${color})`} stroke={color} strokeWidth="2.5"/>
    {/* Horizontal bar */}
    <rect x="4" y="10.5" width="16" height="3" fill="#fff" rx="0.5"/>
    <rect x="4" y="10.5" width="16" height="3" fill={color} fillOpacity="0.3" rx="0.5"/>
    {/* Border on bar */}
    <rect x="4" y="10.5" width="16" height="3" stroke={color} strokeWidth="1.5" fill="none" rx="0.5"/>
  </svg>
);

export const OneWayIcon = ({ color = '#1E40AF', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`oneway-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.6" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Arrow shaft */}
    <path d="M3 12H19" stroke={`url(#oneway-grad-${color})`} strokeWidth="3.5" strokeLinecap="round"/>
    {/* Arrow head */}
    <path d="M20 12L15 7L19 12L15 17L20 12Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    {/* Shadow effect */}
    <path d="M3 12H19" stroke={color} strokeWidth="1" strokeOpacity="0.2" strokeLinecap="round" transform="translate(1, 1)"/>
  </svg>
);

// ==================== BUILDINGS ====================
export const SchoolIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`school-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.6" />
      </linearGradient>
    </defs>
    {/* Main building */}
    <path d="M12 3L4 7V20H20V7L12 3Z" fill={`url(#school-grad-${color})`} stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    {/* Roof accent */}
    <path d="M12 3L4 7H20L12 3Z" fill={color} fillOpacity="0.4"/>
    {/* Door */}
    <rect x="9.5" y="14" width="5" height="6" fill={color} stroke={color} strokeWidth="1.5" rx="0.5"/>
    {/* Windows */}
    <rect x="6" y="10" width="3" height="3" fill="#fff" fillOpacity="0.7" stroke={color} strokeWidth="1.2" rx="0.3"/>
    <rect x="15" y="10" width="3" height="3" fill="#fff" fillOpacity="0.7" stroke={color} strokeWidth="1.2" rx="0.3"/>
    {/* Bell tower */}
    <rect x="10.5" y="1" width="3" height="2" fill={color} stroke={color} strokeWidth="1" rx="0.5"/>
    <circle cx="12" cy="1.5" r="0.8" fill="#FFD700"/>
  </svg>
);

export const ShopsIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`shops-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="1" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* Building */}
    <rect x="4" y="8" width="16" height="12" fill={`url(#shops-grad-${color})`} stroke={color} strokeWidth="1.8"/>
    {/* Awning */}
    <path d="M4 8L6 4H18L20 8H4Z" fill={color} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M6 4V8M10 4V8M14 4V8M18 4V8" stroke={color} strokeWidth="1" strokeOpacity="0.4"/>
    {/* Door */}
    <rect x="10" y="13" width="4" height="7" fill={color} stroke={color} strokeWidth="1.5" rx="0.5"/>
    <circle cx="13" cy="16" r="0.5" fill="#FFD700"/>
    {/* Windows */}
    <rect x="5.5" y="10" width="2.5" height="3" fill="#fff" fillOpacity="0.6" stroke={color} strokeWidth="1" rx="0.2"/>
    <rect x="16" y="10" width="2.5" height="3" fill="#fff" fillOpacity="0.6" stroke={color} strokeWidth="1" rx="0.2"/>
  </svg>
);

export const FactoryIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`factory-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.8" />
        <stop offset="100%" stopColor={color} stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Main building */}
    <rect x="4" y="10" width="16" height="10" fill={`url(#factory-grad-${color})`} stroke={color} strokeWidth="1.8"/>
    {/* Smokestacks */}
    <rect x="7" y="4" width="2" height="6" fill={color} stroke={color} strokeWidth="1.2"/>
    <rect x="11" y="6" width="2" height="4" fill={color} stroke={color} strokeWidth="1.2"/>
    <rect x="15" y="4" width="2" height="6" fill={color} stroke={color} strokeWidth="1.2"/>
    {/* Smoke */}
    <circle cx="8" cy="2" r="1.2" fill="#999" fillOpacity="0.6"/>
    <circle cx="12" cy="4" r="1.2" fill="#999" fillOpacity="0.5"/>
    <circle cx="16" cy="2" r="1.2" fill="#999" fillOpacity="0.6"/>
    {/* Windows */}
    <rect x="6" y="13" width="2" height="2.5" fill="#FFD700" fillOpacity="0.8" stroke={color} strokeWidth="0.8"/>
    <rect x="11" y="13" width="2" height="2.5" fill="#FFD700" fillOpacity="0.8" stroke={color} strokeWidth="0.8"/>
    <rect x="16" y="13" width="2" height="2.5" fill="#FFD700" fillOpacity="0.8" stroke={color} strokeWidth="0.8"/>
  </svg>
);

export const BusStopIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`busstop-grad-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* Pole */}
    <rect x="11" y="3" width="2" height="17" fill={color} rx="1"/>
    {/* Sign board */}
    <rect x="6" y="8" width="12" height="10" rx="1.5" fill={`url(#busstop-grad-${color})`} stroke={color} strokeWidth="1.8"/>
    {/* Top ornament */}
    <circle cx="12" cy="2" r="1.5" fill={color}/>
    {/* Bus symbol */}
    <rect x="8" y="10" width="8" height="4" rx="0.8" fill="#fff" fillOpacity="0.7" stroke={color} strokeWidth="1"/>
    <rect x="9" y="11" width="2" height="1.5" rx="0.2" fill={color} fillOpacity="0.5"/>
    <rect x="13" y="11" width="2" height="1.5" rx="0.2" fill={color} fillOpacity="0.5"/>
    {/* Text lines */}
    <line x1="8" y1="15.5" x2="16" y2="15.5" stroke="#fff" strokeWidth="1" strokeOpacity="0.8" strokeLinecap="round"/>
    <line x1="8" y1="16.8" x2="13" y2="16.8" stroke="#fff" strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round"/>
  </svg>
);

export const OfficeBuildingIcon = ({ color = '#000000', size = 24 }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id={`office-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor={color} stopOpacity="0.7" />
        <stop offset="50%" stopColor={color} stopOpacity="0.9" />
        <stop offset="100%" stopColor={color} stopOpacity="0.7" />
      </linearGradient>
    </defs>
    {/* Main building */}
    <rect x="6" y="3" width="12" height="19" fill={`url(#office-grad-${color})`} stroke={color} strokeWidth="1.8" rx="0.5"/>
    {/* Windows - left column */}
    <rect x="8" y="5" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="8" y="8" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="8" y="11" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="8" y="14" width="2" height="2" fill="#FFD700" fillOpacity="0.7" stroke={color} strokeWidth="0.5" rx="0.2"/>
    {/* Windows - right column */}
    <rect x="14" y="5" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="14" y="8" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="14" y="11" width="2" height="2" fill="#FFD700" fillOpacity="0.7" stroke={color} strokeWidth="0.5" rx="0.2"/>
    <rect x="14" y="14" width="2" height="2" fill="#4A9EFF" fillOpacity="0.6" stroke={color} strokeWidth="0.5" rx="0.2"/>
    {/* Entrance */}
    <rect x="10" y="17" width="4" height="5" fill={color} stroke={color} strokeWidth="1.5" rx="0.5"/>
    <circle cx="13" cy="19" r="0.4" fill="#FFD700"/>
  </svg>
);
