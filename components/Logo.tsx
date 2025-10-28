'use client';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  variant?: 'default' | 'light';
}

const Logo = ({ size = 'md', showText = true, variant = 'default' }: LogoProps) => {
  const sizes = {
    sm: { width: 32, height: 32, text: 'text-lg', padding: 'p-1' },
    md: { width: 40, height: 40, text: 'text-xl', padding: 'p-1.5' },
    lg: { width: 48, height: 48, text: 'text-2xl', padding: 'p-2' },
  };

  const currentSize = sizes[size];

  // Text colors based on variant
  const textClasses = variant === 'light' 
    ? 'text-white' 
    : 'text-gray-900 dark:text-gray-100';
  
  const subtextClasses = variant === 'light'
    ? 'text-gray-300'
    : 'text-gray-500 dark:text-gray-400';

  return (
    <div className="flex items-center gap-3">
      {/* Logo SVG with background */}
      <div className={`${currentSize.padding} bg-white dark:bg-gray-100 rounded-lg flex-shrink-0`}>
        <svg
          width={currentSize.width}
          height={currentSize.height}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Circle - Primary Blue */}
          <circle cx="24" cy="24" r="23" fill="#1E3A8A" stroke="#3B82F6" strokeWidth="2" />
          
          {/* Inner Design - Trading Levels Pattern */}
          <g opacity="0.95">
            {/* Top Level Line */}
            <line x1="12" y1="14" x2="36" y2="14" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            
            {/* Middle Level Line (Initial Balance) */}
            <line x1="12" y1="24" x2="36" y2="24" stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" />
            
            {/* Bottom Level Line */}
            <line x1="12" y1="34" x2="36" y2="34" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
            
            {/* Candlestick Pattern */}
            <rect x="14" y="18" width="3" height="12" fill="#10B981" rx="1" />
            <line x1="15.5" y1="14" x2="15.5" y2="18" stroke="#10B981" strokeWidth="1.5" />
            <line x1="15.5" y1="30" x2="15.5" y2="34" stroke="#10B981" strokeWidth="1.5" />
            
            <rect x="22" y="20" width="3" height="8" fill="#EF4444" rx="1" />
            <line x1="23.5" y1="14" x2="23.5" y2="20" stroke="#EF4444" strokeWidth="1.5" />
            <line x1="23.5" y1="28" x2="23.5" y2="34" stroke="#EF4444" strokeWidth="1.5" />
            
            <rect x="30" y="16" width="3" height="14" fill="#10B981" rx="1" />
            <line x1="31.5" y1="14" x2="31.5" y2="16" stroke="#10B981" strokeWidth="1.5" />
            <line x1="31.5" y1="30" x2="31.5" y2="34" stroke="#10B981" strokeWidth="1.5" />
          </g>
          
          {/* Accent dots for detail */}
          <circle cx="10" cy="24" r="2" fill="#FBBF24" />
          <circle cx="38" cy="24" r="2" fill="#FBBF24" />
        </svg>
      </div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold ${textClasses} ${currentSize.text}`}>
            IB<span className="text-blue-600 dark:text-blue-400">Levels</span>
          </span>
          <span className={`text-xs font-medium ${subtextClasses}`}>Initial Balance</span>
        </div>
      )}
    </div>
  );
};

export default Logo;

