import React, { useState, useMemo } from 'react';
import { X, Bookmark, BookmarkCheck, TrendingUp, TrendingDown, Bell, Share2, Check } from 'lucide-react';
import { MarketAsset } from '../types/market';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (assetId: string) => void;
}

type Timeframe = '1D' | '5D' | '1M' | '6M' | '1Y' | '5Y' | 'ALL';
type ChartStyle = 'area' | 'line' | 'candles';

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const [timeframe, setTimeframe] = useState<Timeframe>('1D');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('area');
  const [hoveredPoint, setHoveredPoint] = useState<{ index: number; price: number; time: string } | null>(null);
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Generate simulated chart series based on timeframe
  const chartData = useMemo(() => {
    if (!asset) return [];
    const count = timeframe === '1D' ? 24 : timeframe === '5D' ? 35 : timeframe === '1M' ? 30 : 50;
    const base = asset.price;
    const volatility = base * 0.02;
    const points: { price: number; time: string; open: number; high: number; low: number; close: number }[] = [];

    let current = base - (asset.changePercent / 100) * base;
    for (let i = 0; i < count; i++) {
      const delta = (Math.random() - 0.48) * volatility;
      current = Math.max(current + delta, base * 0.4);
      const open = current;
      const close = current + (Math.random() - 0.48) * (volatility * 0.5);
      const high = Math.max(open, close) + Math.random() * (volatility * 0.4);
      const low = Math.min(open, close) - Math.random() * (volatility * 0.4);

      let timeLabel = '';
      if (timeframe === '1D') {
        const hour = 9 + Math.floor((i / count) * 7);
        const minute = Math.floor(((i / count) * 60) % 60);
        timeLabel = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      } else if (timeframe === '5D') {
        timeLabel = `Day ${Math.floor(i / 7) + 1} ${10 + (i % 6)}:00`;
      } else {
        timeLabel = `Oct ${i + 1}`;
      }

      points.push({ price: close, time: timeLabel, open, high, low, close });
    }
    // Force last point to match current asset price
    if (points.length > 0) {
      points[points.length - 1].price = asset.price;
      points[points.length - 1].close = asset.price;
    }
    return points;
  }, [asset, timeframe]);

  if (!asset) return null;

  const isPositive = asset.changePercent >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';
  const fillColor = isPositive ? 'rgba(8, 153, 129, 0.12)' : 'rgba(242, 54, 69, 0.12)';

  // Chart coordinate calculations
  const chartWidth = 720;
  const chartHeight = 240;
  const paddingX = 20;
  const paddingY = 20;
  const innerW = chartWidth - paddingX * 2;
  const innerH = chartHeight - paddingY * 2;

  const prices = chartData.map((d) => d.price);
  const minP = Math.min(...prices, asset.low || asset.price * 0.98);
  const maxP = Math.max(...prices, asset.high || asset.price * 1.02);
  const rangeP = maxP - minP || 1;

  const svgPoints = chartData.map((d, idx) => {
    const x = paddingX + (idx / (chartData.length - 1)) * innerW;
    const y = paddingY + innerH - ((d.price - minP) / rangeP) * innerH;
    return { x, y, data: d };
  });

  let linePath = `M ${svgPoints[0]?.x || 0} ${svgPoints[0]?.y || 0}`;
  for (let i = 1; i < svgPoints.length; i++) {
    const prev = svgPoints[i - 1];
    const curr = svgPoints[i];
    const midX = (prev.x + curr.x) / 2;
    linePath += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  const areaPath = `${linePath} L ${svgPoints[svgPoints.length - 1]?.x || innerW} ${chartHeight} L ${paddingX} ${chartHeight} Z`;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleAlert = () => {
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-200 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="p-5 md:px-7 border-b border-[#E0E3EB] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {asset.badge ? (
              <div
                className="w-10 h-10 rounded-full font-bold flex items-center justify-center text-xs text-white shadow-2xs"
                style={{ backgroundColor: asset.badge.bg }}
              >
                {asset.badge.text}
              </div>
            ) : asset.flag ? (
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                {asset.flag}
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2962FF] font-bold flex items-center justify-center text-sm">
                {asset.symbol.slice(0, 3)}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-xl text-gray-900 leading-tight">
                  {asset.name}
                </h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-medium">
                  {asset.symbol}
                </span>
              </div>
              <div className="text-xs text-[#787B86] font-mono mt-0.5">
                {asset.exchange} · Real-time Market Quote
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset.id)}
              className={`p-2 rounded-full border transition cursor-pointer ${
                isWatchlisted
                  ? 'bg-blue-50 border-blue-200 text-[#2962FF]'
                  : 'border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isWatchlisted ? <BookmarkCheck className="w-5 h-5 fill-current" /> : <Bookmark className="w-5 h-5" />}
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              title="Share Quote"
            >
              {copiedLink ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-black transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 md:px-7 overflow-y-auto space-y-6">
          {/* Price & Change Banner */}
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-extrabold font-mono text-gray-900 tracking-tight">
                  {hoveredPoint
                    ? `$${hoveredPoint.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : `$${asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </span>
                <div
                  className={`flex items-center gap-1.5 font-bold text-base font-mono ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span>{isPositive ? '+' : ''}{asset.change.toFixed(2)}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold ${
                      isPositive ? 'bg-green-50 text-[#089981]' : 'bg-red-50 text-[#F23645]'
                    }`}
                  >
                    {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
              <div className="text-xs text-[#787B86] mt-1">
                {hoveredPoint ? `Time: ${hoveredPoint.time}` : 'Regular trading session · Prices in USD'}
              </div>
            </div>

            {/* Timeframe selector */}
            <div className="flex items-center bg-[#f0f3fa] p-1 rounded-xl text-xs font-semibold">
              {(['1D', '5D', '1M', '6M', '1Y', '5Y', 'ALL'] as Timeframe[]).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeframe(tf)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    timeframe === tf ? 'bg-white shadow-2xs text-black font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Chart Area */}
          <div className="relative bg-gray-50/50 border border-gray-200 rounded-2xl p-4 overflow-hidden">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span className="font-mono">High: ${maxP.toFixed(2)}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setChartStyle('area')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    chartStyle === 'area' ? 'bg-blue-100 text-[#2962FF]' : 'hover:bg-gray-200'
                  }`}
                >
                  Area
                </button>
                <button
                  onClick={() => setChartStyle('line')}
                  className={`px-2 py-0.5 rounded font-medium ${
                    chartStyle === 'line' ? 'bg-blue-100 text-[#2962FF]' : 'hover:bg-gray-200'
                  }`}
                >
                  Line
                </button>
              </div>
              <span className="font-mono">Low: ${minP.toFixed(2)}</span>
            </div>

            <div className="relative w-full h-[220px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                {/* Horizontal reference grid lines */}
                <line x1="0" y1={paddingY} x2={chartWidth} y2={paddingY} stroke="#E5E7EB" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight / 2} x2={chartWidth} y2={chartHeight / 2} stroke="#E5E7EB" strokeDasharray="3 3" />
                <line x1="0" y1={chartHeight - paddingY} x2={chartWidth} y2={chartHeight - paddingY} stroke="#E5E7EB" strokeDasharray="3 3" />

                {chartStyle === 'area' && (
                  <path d={areaPath} fill={fillColor} />
                )}

                <path
                  d={linePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Hover indicator point */}
                {hoveredPoint && (
                  <g>
                    <line
                      x1={svgPoints[hoveredPoint.index]?.x || 0}
                      y1="0"
                      x2={svgPoints[hoveredPoint.index]?.x || 0}
                      y2={chartHeight}
                      stroke="#9CA3AF"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx={svgPoints[hoveredPoint.index]?.x || 0}
                      cy={svgPoints[hoveredPoint.index]?.y || 0}
                      r="5"
                      fill={strokeColor}
                      stroke="#FFFFFF"
                      strokeWidth="2"
                    />
                  </g>
                )}

                {/* Invisible hover overlay triggers */}
                {svgPoints.map((pt, idx) => (
                  <rect
                    key={idx}
                    x={pt.x - innerW / (svgPoints.length * 2)}
                    y="0"
                    width={innerW / svgPoints.length}
                    height={chartHeight}
                    fill="transparent"
                    className="cursor-crosshair"
                    onMouseEnter={() => setHoveredPoint({ index: idx, price: pt.data.price, time: pt.data.time })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div>
            <h4 className="font-bold text-sm text-gray-900 mb-3">Key Statistics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Open</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  ${(asset.open || asset.price * 0.99).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Day Range</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  ${(asset.low || asset.price * 0.98).toFixed(2)} - ${(asset.high || asset.price * 1.02).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">52W Range</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  ${asset.week52Low?.toFixed(2) || (asset.price * 0.7).toFixed(2)} - ${asset.week52High?.toFixed(2) || (asset.price * 1.15).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Volume</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  {asset.volume || '32.4M'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Market Cap</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  {asset.marketCap || 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">P/E Ratio</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  {asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Prev Close</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5">
                  ${(asset.prevClose || asset.price - asset.change).toFixed(2)}
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-[#787B86]">Primary Exchange</div>
                <div className="text-sm font-bold font-mono text-gray-900 mt-0.5 truncate">
                  {asset.exchange}
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {asset.description && (
            <div className="p-4 bg-blue-50/40 rounded-2xl border border-blue-100/80">
              <h5 className="font-semibold text-xs text-blue-900 uppercase tracking-wider mb-1">
                About {asset.name}
              </h5>
              <p className="text-xs md:text-sm text-gray-700 leading-relaxed">
                {asset.description}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
            <button
              onClick={handleAlert}
              className="flex items-center gap-2 text-xs font-semibold text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-500" />
              <span>{alertSuccess ? 'Alert Created at $' + asset.price.toFixed(2) : 'Set Price Alert'}</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  alert(`Demo Order: Successfully placed a simulated Market Buy Order for 10 units of ${asset.symbol} at $${asset.price.toFixed(2)}.`);
                }}
                className="cta-gradient text-white text-xs md:text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-95 transition cursor-pointer shadow-xs"
              >
                Paper Trade {asset.symbol}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
