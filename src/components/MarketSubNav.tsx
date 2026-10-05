import React from 'react';
import { MarketCategory } from '../types/market';

interface MarketSubNavProps {
  activeCategory: MarketCategory;
  onSelectCategory: (category: MarketCategory) => void;
}

const CATEGORIES: { id: MarketCategory; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'indices', label: 'Indices' },
  { id: 'us_stocks', label: 'US stocks' },
  { id: 'world_stocks', label: 'World stocks' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'futures', label: 'Futures & commodities' },
  { id: 'forex', label: 'Forex & currencies' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'economy', label: 'Economy' },
];

export const MarketSubNav: React.FC<MarketSubNavProps> = ({
  activeCategory,
  onSelectCategory,
}) => {
  return (
    <section
      className="border-b border-[#E0E3EB] bg-white sticky top-16 z-40 select-none shadow-2xs"
      data-purpose="market-categories-bar"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2.5 text-sm font-medium text-gray-700">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-colors cursor-pointer text-sm ${
                  isActive
                    ? 'bg-gray-100 text-black font-semibold shadow-2xs'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black font-medium'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
