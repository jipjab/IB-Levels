'use client';

interface AffiliateLinkProps {
  platform: 'tradingview';
  variant?: 'card' | 'banner' | 'button' | 'text';
}

const AffiliateLinks = ({ platform, variant = 'card' }: AffiliateLinkProps) => {
  const platforms = {
    tradingview: {
      name: 'TradingView',
      description: 'Advanced charting & technical analysis',
      url: 'https://www.tradingview.com/?aff_id=158404',
      cta: 'Get TradingView Pro',
    },
  };

  const config = platforms[platform];

  // Text variant - for footer links with social-style button
  if (variant === 'text') {
    return (
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="p-2 rounded-full flex items-center justify-center transition-colors duration-200 text-white bg-[#2962FF] hover:bg-[#1E4FCC]"
        aria-label={`Visit ${config.name}`}
        title={config.cta}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor"/>
          <path d="M12 8V16M8 10H16M8 14H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </a>
    );
  }

  if (variant === 'button') {
    return (
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2962FF] hover:bg-[#1E4FCC] border border-[#2962FF] dark:border-[#1E4FCC] rounded transition-colors shadow-sm hover:shadow-md"
        aria-label={`Visit ${config.name}`}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="currentColor"/>
          <path d="M12 8V16M8 10H16M8 14H16" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span>{config.cta}</span>
      </a>
    );
  }

  if (variant === 'banner') {
    return (
      <a
        href={config.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 hover:shadow-md dark:hover:shadow-blue-900/50 transition-shadow"
        aria-label={`Visit ${config.name}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
              {config.name}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">{config.description}</p>
          </div>
          <div className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded transition-colors whitespace-nowrap">
            Learn More →
          </div>
        </div>
      </a>
    );
  }

  // Default: card variant
  return (
    <a
      href={config.url}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5 hover:shadow-lg dark:hover:shadow-blue-900/50 transition-all duration-200"
      aria-label={`Visit ${config.name}`}
    >
      <div className="text-center">
        <h3 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-1">
          {config.name}
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{config.description}</p>
        <div className="inline-block px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-white dark:hover:bg-blue-900/50 border border-blue-300 dark:border-blue-600 rounded transition-colors">
          {config.cta}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Partner Link</p>
      </div>
    </a>
  );
};

export default AffiliateLinks;

