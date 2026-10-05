import React from 'react';
import { X, Trash2, ArrowUpRight, TrendingUp, TrendingDown, Bookmark } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  onRemoveFromWatchlist: (id: string) => void;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onSelectAsset,
  onRemoveFromWatchlist,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col border-l border-gray-200 animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-50 text-[#2962FF] rounded-xl">
              <Bookmark className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 leading-tight">My Watchlist</h3>
              <p className="text-xs text-[#787B86]">{watchlist.length} saved instruments</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-black transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {watchlist.length === 0 ? (
            <div className="text-center py-20 px-6">
              <Bookmark className="w-12 h-12 mx-auto text-gray-300 stroke-[1.5] mb-3" />
              <h4 className="font-bold text-gray-900 text-base">Your watchlist is empty</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                Click any asset card or table row and press the bookmark icon to track price changes in real-time.
              </p>
            </div>
          ) : (
            watchlist.map((asset) => {
              const isPositive = asset.changePercent >= 0;
              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  className="p-3.5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xs transition bg-white flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    {asset.badge ? (
                      <div
                        className="w-8 h-8 rounded-full text-white font-bold flex items-center justify-center text-[11px]"
                        style={{ backgroundColor: asset.badge.bg }}
                      >
                        {asset.badge.text}
                      </div>
                    ) : asset.flag ? (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm">
                        {asset.flag}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2962FF] font-bold flex items-center justify-center text-xs">
                        {asset.symbol.slice(0, 3)}
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-sm text-gray-900 group-hover:text-[#2962FF] transition-colors">
                        {asset.name}
                      </div>
                      <div className="text-xs text-gray-400 font-mono">
                        {asset.symbol} · {asset.exchange}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="font-bold font-mono text-sm text-gray-900">
                        ${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div
                        className={`text-xs font-bold font-mono ${
                          isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveFromWatchlist(asset.id);
                      }}
                      className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition cursor-pointer"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-gray-50 border-t border-[#E0E3EB] flex items-center justify-between text-xs text-[#787B86]">
          <span>Data refreshed with live ticks</span>
          <button
            onClick={onClose}
            className="font-semibold text-[#2962FF] hover:underline"
          >
            Close panel
          </button>
        </div>
      </div>
    </div>
  );
};
