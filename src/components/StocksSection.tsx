import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MarketAsset, StockFilter } from '../types/market';
import { Sparkline } from './Sparkline';

interface StocksSectionProps {
  stocks: MarketAsset[];
  activeFilter: StockFilter;
  onChangeFilter: (filter: StockFilter) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  onNavigateStocksTab: () => void;
}

const FILTER_TABS: { id: StockFilter; label: string }[] = [
  { id: 'most_active', label: 'Most Active' },
  { id: 'gainers', label: 'Gainers' },
  { id: 'losers', label: 'Losers' },
  { id: 'volatility', label: 'High Volatility' },
];

export const StocksSection: React.FC<StocksSectionProps> = ({
  stocks,
  activeFilter,
  onChangeFilter,
  onSelectAsset,
  onNavigateStocksTab,
}) => {
  return (
    <section className="space-y-6" data-purpose="us-stocks-movers">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={onNavigateStocksTab}
            className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight hover:text-[#2962FF] group transition-colors cursor-pointer text-left"
          >
            <span>US Stocks &amp; Market Leaders</span>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2962FF] group-hover:translate-x-1 transition-all" />
          </button>
          <p className="text-sm text-[#787B86] mt-0.5">
            Top-volume assets traded across US exchanges today
          </p>
        </div>

        {/* Filter Sub-Tabs */}
        <div className="flex items-center bg-[#f0f3fa] p-1 rounded-xl text-xs font-semibold self-start sm:self-auto">
          {FILTER_TABS.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white shadow-xs text-black font-bold'
                    : 'text-gray-600 hover:text-black hover:bg-white/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stocks Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((stock) => {
          const isPositive = stock.changePercent >= 0;
          return (
            <div
              key={stock.id}
              onClick={() => onSelectAsset(stock)}
              className={`p-5 rounded-2xl border border-[#E0E3EB] bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                stock.flashState === 'up' ? 'flash-up' : stock.flashState === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full text-white font-bold flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform"
                    style={{ backgroundColor: stock.badge?.bg || '#171717' }}
                  >
                    {stock.badge?.text || stock.symbol.slice(0, 4)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-[#2962FF] transition-colors">
                      {stock.name}
                    </h4>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {stock.exchange}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-block font-bold text-xs px-2 py-0.5 rounded font-mono ${
                    isPositive ? 'bg-green-50 text-[#089981]' : 'bg-red-50 text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-2xl font-extrabold tracking-tight font-mono text-gray-900">
                    ${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  {stock.volume && (
                    <div className="text-xs text-[#787B86] mt-0.5 font-mono">
                      Vol {stock.volume}
                    </div>
                  )}
                </div>

                {/* Mini Chart */}
                <Sparkline
                  data={stock.sparkline}
                  isPositive={isPositive}
                  width={100}
                  height={40}
                  showFill={false}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
