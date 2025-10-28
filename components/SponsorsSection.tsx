'use client';

import AffiliateLinks from './AffiliateLinks';

const SponsorsSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 text-center">
        Professional Trading Tools
      </h3>
      <div className="grid grid-cols-1 gap-4">
        <AffiliateLinks platform="tradingview" variant="banner" />
      </div>
      <p className="text-xs text-gray-500 text-center mt-4">
        We may earn a commission from purchases made through these links
      </p>
    </div>
  );
};

export default SponsorsSection;

