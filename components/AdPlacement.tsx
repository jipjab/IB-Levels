'use client';

import { useEffect } from 'react';

interface AdPlacementProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  style?: React.CSSProperties;
}

const AdPlacement = ({ 
  slot, 
  format = 'auto',
  style = { display: 'block' }
}: AdPlacementProps) => {
  const adSenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;
  const adSlot = slot || process.env.NEXT_PUBLIC_ADSENSE_SLOT;

  useEffect(() => {
    // Only load ads if AdSense is configured
    if (adSenseId && adSlot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [adSenseId, adSlot]);

  // Show placeholder if AdSense is not configured
  if (!adSenseId || !adSlot) {
    return (
      <aside
        className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[250px] flex items-center justify-center transition-colors"
        aria-label="Advertisement placeholder"
      >
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="text-sm font-medium mb-2">Advertisement</div>
          <div className="text-xs text-gray-400 dark:text-gray-500">
            Configure NEXT_PUBLIC_ADSENSE_ID
            <br />
            in your environment variables
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-2 min-h-[250px] flex items-center justify-center transition-colors overflow-hidden"
      aria-label="Advertisement"
    >
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={adSenseId}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
};

export default AdPlacement;

