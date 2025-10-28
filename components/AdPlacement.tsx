'use client';

const AdPlacement = () => {
  return (
    <aside
      className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 min-h-[250px] flex items-center justify-center transition-colors"
      aria-label="Advertisement"
    >
      <div className="text-center text-gray-500 dark:text-gray-400">
        <div className="text-sm font-medium mb-2">Advertisement</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          Your ad content here
          <br />
          (300 x 250)
        </div>
      </div>
    </aside>
  );
};

export default AdPlacement;

