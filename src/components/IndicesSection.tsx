import React, { useState } from 'react';
import { ChevronRight, RefreshCw } from 'lucide-react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';

interface IndicesSectionProps {
  majorIndices: MarketAsset[];
  tableIndices: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  isLiveUpdating: boolean;
  onToggleLive: () => void;
  onNavigateIndicesTab: () => void;
}

export const IndicesSection: React.FC<IndicesSectionProps> = ({
  majorIndices,
  tableIndices,
  onSelectAsset,
  isLiveUpdating,
  onToggleLive,
  onNavigateIndicesTab,
}) => {
  const [showAllRows, setShowAllRows] = useState(false);

  const displayedTableIndices = showAllRows ? tableIndices : tableIndices.slice(0, 4);

  return (
    <section className="space-y-6" data-purpose="indices-container">
      {/* Section Title Link */}
      <div className="flex items-center justify-between">
        <button
          onClick={onNavigateIndicesTab}
          className="inline-flex items-center gap-1.5 text-2xl font-bold tracking-tight hover:text-[#2962FF] group transition-colors cursor-pointer text-left"
        >
          <span>Indices</span>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#2962FF] group-hover:translate-x-1 transition-all" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleLive}
            title={isLiveUpdating ? "Pause live tick simulation" : "Resume live tick simulation"}
            className="flex items-center gap-2 text-xs md:text-sm font-medium text-[#787B86] hover:text-black transition-colors cursor-pointer py-1 px-2 rounded-lg hover:bg-gray-100"
          >
            <span className="relative flex h-2 w-2">
              {isLiveUpdating && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#089981] opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${isLiveUpdating ? 'bg-[#089981]' : 'bg-gray-400'}`}></span>
            </span>
            <span>Real-time updates</span>
            <RefreshCw className={`w-3.5 h-3.5 ml-0.5 text-gray-400 ${isLiveUpdating ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          </button>
        </div>
      </div>

      {/* Top Index Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {majorIndices.map((index) => {
          const isPositive = index.change >= 0;
          return (
            <div
              key={index.id}
              onClick={() => onSelectAsset(index)}
              className={`p-5 rounded-2xl border border-[#E0E3EB] bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                index.flashState === 'up' ? 'flash-up' : index.flashState === 'down' ? 'flash-down' : ''
              }`}
              data-purpose="ticker-card"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-sm shadow-xs transition-transform group-hover:scale-105"
                    style={{ backgroundColor: index.badge?.bg || '#E53935' }}
                  >
                    {index.badge?.text || index.symbol.slice(0, 3)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-snug text-gray-900 group-hover:text-[#2962FF] transition-colors">
                      {index.name}
                    </h3>
                    <span className="text-xs font-medium text-gray-500">
                      {index.symbol} · {index.exchange}
                    </span>
                  </div>
                </div>

                {/* Mini Sparkline */}
                <Sparkline
                  data={index.sparkline}
                  isPositive={isPositive}
                  width={100}
                  height={40}
                  showFill={true}
                />
              </div>

              <div className="mt-4 flex items-baseline justify-between pt-1">
                <span className="text-2xl font-extrabold tracking-tight font-mono text-gray-900">
                  {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <div
                  className={`flex items-center gap-1.5 font-semibold text-sm ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  <span className="font-mono">
                    {isPositive ? '+' : ''}{index.change.toFixed(2)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      isPositive ? 'bg-green-50 text-[#089981]' : 'bg-red-50 text-[#F23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Regional & Global Indices Table Grid */}
      <div className="border border-[#E0E3EB] rounded-2xl overflow-hidden bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/80 border-b border-[#E0E3EB] text-xs uppercase font-semibold text-[#787B86]">
              <tr>
                <th className="py-3 px-6" scope="col">Index Name</th>
                <th className="py-3 px-6 text-right" scope="col">Price</th>
                <th className="py-3 px-6 text-right" scope="col">Change</th>
                <th className="py-3 px-6 text-right" scope="col">% Change</th>
                <th className="py-3 px-6 text-center" scope="col">Trend (24h)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E3EB]">
              {displayedTableIndices.map((row) => {
                const isPositive = row.change >= 0;
                return (
                  <tr
                    key={row.id}
                    onClick={() => onSelectAsset(row)}
                    className={`hover:bg-gray-50/80 transition cursor-pointer group ${
                      row.flashState === 'up' ? 'flash-up' : row.flashState === 'down' ? 'flash-down' : ''
                    }`}
                  >
                    <td className="py-4 px-6 flex items-center gap-3">
                      <span className="text-xl" role="img" aria-label={row.name}>{row.flag || '🌐'}</span>
                      <div>
                        <div className="font-bold text-gray-900 group-hover:text-[#2962FF] transition-colors">
                          {row.name}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {row.symbol} · {row.exchange}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold font-mono text-gray-900">
                      {row.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td
                      className={`py-4 px-6 text-right font-medium font-mono ${
                        isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                      }`}
                    >
                      {isPositive ? '+' : ''}{row.change.toFixed(2)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span
                        className={`inline-block font-bold text-xs px-2.5 py-1 rounded-md font-mono ${
                          isPositive
                            ? 'bg-green-50 text-[#089981]'
                            : 'bg-red-50 text-[#F23645]'
                        }`}
                      >
                        {isPositive ? '+' : ''}{row.changePercent.toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex justify-center">
                        <Sparkline
                          data={row.sparkline}
                          isPositive={isPositive}
                          width={80}
                          height={25}
                          showFill={false}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {tableIndices.length > 4 && (
          <div className="p-3 bg-gray-50/60 border-t border-[#E0E3EB] text-center">
            <button
              onClick={() => setShowAllRows(!showAllRows)}
              className="text-xs font-semibold text-[#2962FF] hover:underline cursor-pointer"
            >
              {showAllRows ? 'Show fewer indices' : `Show ${tableIndices.length - 4} more global indices`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
