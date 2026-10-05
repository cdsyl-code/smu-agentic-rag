import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, X, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  allAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  allAssets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const filteredAssets = useMemo(() => {
    return allAssets.filter((asset) => {
      const matchCat = categoryFilter === 'all' || asset.category === categoryFilter;
      const q = query.toLowerCase().trim();
      if (!q) return matchCat;
      const matchQuery =
        asset.name.toLowerCase().includes(q) ||
        asset.symbol.toLowerCase().includes(q) ||
        asset.exchange.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [allAssets, query, categoryFilter]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < filteredAssets.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredAssets[selectedIndex]) {
          onSelectAsset(filteredAssets[selectedIndex]);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredAssets, selectedIndex, onSelectAsset, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative border-b border-[#E0E3EB] flex items-center px-4">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search symbols, stocks, indices, crypto (e.g. NVDA, S&P 500, BTC)..."
            className="w-full py-4 pl-3 pr-8 text-base text-gray-900 placeholder-gray-400 bg-transparent border-none focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 text-xs font-semibold text-gray-400 hover:text-gray-700 px-2 py-1 bg-gray-100 rounded"
          >
            ESC
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-gray-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'indices', label: 'Indices' },
            { id: 'us_stocks', label: 'US Stocks' },
            { id: 'crypto', label: 'Crypto' },
            { id: 'futures', label: 'Futures' },
            { id: 'forex', label: 'Forex' },
            { id: 'etfs', label: 'ETFs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setCategoryFilter(tab.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap cursor-pointer transition ${
                categoryFilter === tab.id
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto max-h-[420px] p-2 divide-y divide-gray-50">
          {filteredAssets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm font-medium">No financial instruments found for "{query}"</p>
              <p className="text-xs text-gray-400 mt-1">Try searching for AAPL, TSLA, SPX, or BTC</p>
            </div>
          ) : (
            filteredAssets.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPositive = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-3 rounded-xl flex items-center justify-between cursor-pointer transition ${
                    isSelected ? 'bg-blue-50/80 text-blue-900' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {asset.badge ? (
                      <div
                        className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-xs"
                        style={{ backgroundColor: asset.badge.bg }}
                      >
                        {asset.badge.text}
                      </div>
                    ) : asset.flag ? (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">
                        {asset.flag}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2962FF] font-bold flex items-center justify-center text-xs">
                        {asset.symbol.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-gray-900 flex items-center gap-2">
                        <span>{asset.name}</span>
                        <span className="text-xs font-mono font-normal text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                          {asset.symbol}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {asset.exchange} · {asset.category}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-bold font-mono text-sm text-gray-900">
                      ${asset.price.toLocaleString('en-US', {
                        minimumFractionDigits: asset.price < 10 ? 2 : 2,
                      })}
                    </div>
                    <div
                      className={`text-xs font-bold font-mono ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="p-3 bg-gray-50/80 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="font-mono">{filteredAssets.length} symbols available</span>
        </div>
      </div>
    </div>
  );
};
