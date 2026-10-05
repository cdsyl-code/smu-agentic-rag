import React from 'react';
import { MarketCategory, MarketAsset, EconomicIndicator } from '../types/market';
import { Sparkline } from './Sparkline';
import { Calendar, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';

interface CategoryViewProps {
  category: MarketCategory;
  assets: MarketAsset[];
  economicData: EconomicIndicator[];
  onSelectAsset: (asset: MarketAsset) => void;
  onBackToOverview: () => void;
}

const CATEGORY_TITLES: Record<MarketCategory, { title: string; subtitle: string }> = {
  overview: { title: 'Markets, everywhere', subtitle: 'Real-time global quotes, indices, movers, and live financial charts.' },
  indices: { title: 'Global Indices', subtitle: 'Benchmark equity indices across Americas, Europe, Asia-Pacific, and emerging markets.' },
  us_stocks: { title: 'US Stocks & Equities', subtitle: 'Live quotes, market volume, movers and valuations for NYSE & NASDAQ equities.' },
  world_stocks: { title: 'World Stocks', subtitle: 'International market movers from London, Frankfurt, Tokyo, and Hong Kong exchanges.' },
  crypto: { title: 'Cryptocurrencies', subtitle: 'Real-time prices, 24-hour volumes, and charts for leading decentralized digital assets.' },
  futures: { title: 'Futures & Commodities', subtitle: 'Global energy, precious metals, agriculture, and industrial raw material contracts.' },
  forex: { title: 'Forex & Currencies', subtitle: 'Major, minor, and exotic foreign exchange pairs and cross currency exchange rates.' },
  bonds: { title: 'Bonds & Sovereign Yields', subtitle: 'Government benchmark yields, yield curves, and fixed-income sovereign securities.' },
  etfs: { title: 'Exchange-Traded Funds (ETFs)', subtitle: 'Broad-market index trackers, thematic growth vehicles, and sector funds.' },
  economy: { title: 'Economic Indicators & Calendar', subtitle: 'Global macro releases, central bank decisions, inflation metrics, and employment.' },
};

export const CategoryView: React.FC<CategoryViewProps> = ({
  category,
  assets,
  economicData,
  onSelectAsset,
  onBackToOverview,
}) => {
  const meta = CATEGORY_TITLES[category] || CATEGORY_TITLES.overview;

  if (category === 'economy') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToOverview}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
            title="Back to Overview"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{meta.title}</h2>
            <p className="text-[#787B86] text-sm mt-0.5">{meta.subtitle}</p>
          </div>
        </div>

        <div className="border border-[#E0E3EB] rounded-2xl overflow-hidden bg-white shadow-2xs">
          <div className="p-4 bg-gray-50/80 border-b border-[#E0E3EB] flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Calendar className="w-4 h-4 text-[#2962FF]" />
              <span>Key Macro Releases & Central Bank Schedule</span>
            </div>
            <span className="text-xs text-[#787B86]">Timezone: EDT (UTC-4)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-[#E0E3EB] text-xs uppercase font-semibold text-[#787B86]">
                <tr>
                  <th className="py-3 px-6" scope="col">Event</th>
                  <th className="py-3 px-6" scope="col">Country / Region</th>
                  <th className="py-3 px-6" scope="col">Period / Date</th>
                  <th className="py-3 px-6 text-right" scope="col">Actual</th>
                  <th className="py-3 px-6 text-right" scope="col">Forecast</th>
                  <th className="py-3 px-6 text-right" scope="col">Prior</th>
                  <th className="py-3 px-6 text-center" scope="col">Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E0E3EB]">
                {economicData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 px-6 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="py-4 px-6 text-gray-600 flex items-center gap-2">
                      <span className="text-lg">{item.flag}</span>
                      <span>{item.country}</span>
                    </td>
                    <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                      {item.date} ({item.period})
                    </td>
                    <td className="py-4 px-6 text-right font-bold font-mono text-gray-900">
                      {item.actual}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-500 font-mono">
                      {item.forecast}
                    </td>
                    <td className="py-4 px-6 text-right text-gray-400 font-mono">
                      {item.previous}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                          item.impact === 'high'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.impact}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToOverview}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 text-gray-600 transition cursor-pointer"
          title="Back to Overview"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">{meta.title}</h2>
          <p className="text-[#787B86] text-sm mt-0.5">{meta.subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map((asset) => {
          const isPositive = asset.changePercent >= 0;
          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className={`p-5 rounded-2xl border border-[#E0E3EB] bg-white hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group ${
                asset.flashState === 'up' ? 'flash-up' : asset.flashState === 'down' ? 'flash-down' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {asset.badge ? (
                    <div
                      className="w-10 h-10 rounded-full font-bold flex items-center justify-center text-xs shadow-2xs group-hover:scale-105 transition-transform"
                      style={{
                        backgroundColor: asset.badge.bg,
                        color: asset.badge.textColor || '#FFFFFF',
                      }}
                    >
                      {asset.badge.text}
                    </div>
                  ) : asset.flag ? (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl shadow-2xs">
                      {asset.flag}
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2962FF] font-bold flex items-center justify-center text-xs">
                      {asset.symbol.slice(0, 3)}
                    </div>
                  )}

                  <div>
                    <h4 className="font-bold text-gray-900 leading-tight group-hover:text-[#2962FF] transition-colors">
                      {asset.name}
                    </h4>
                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                      {asset.symbol} · {asset.exchange}
                    </div>
                  </div>
                </div>

                <span
                  className={`inline-block font-bold text-xs px-2 py-0.5 rounded font-mono ${
                    isPositive ? 'bg-green-50 text-[#089981]' : 'bg-red-50 text-[#F23645]'
                  }`}
                >
                  {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>

              <div className="mt-4 flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-2xl font-extrabold tracking-tight font-mono text-gray-900">
                    {category === 'crypto' || category === 'futures' || category === 'etfs' ? '$' : ''}
                    {asset.price.toLocaleString('en-US', {
                      minimumFractionDigits: asset.price < 10 ? (asset.price < 1 ? 4 : 2) : 2,
                      maximumFractionDigits: asset.price < 1 ? 4 : 2,
                    })}
                    {category === 'bonds' ? '%' : ''}
                  </div>
                  {asset.volume && (
                    <div className="text-xs text-[#787B86] mt-0.5 font-mono">
                      Vol {asset.volume}
                    </div>
                  )}
                </div>

                <Sparkline
                  data={asset.sparkline}
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
    </div>
  );
};
