import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown, Check, Sparkles } from 'lucide-react';
import { Header } from './components/Header';
import { MarketSubNav } from './components/MarketSubNav';
import { IndicesSection } from './components/IndicesSection';
import { StocksSection } from './components/StocksSection';
import { CategoryView } from './components/CategoryView';
import { AssetDetailModal } from './components/AssetDetailModal';
import { SearchModal } from './components/SearchModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { GetStartedModal } from './components/GetStartedModal';
import { Footer } from './components/Footer';

import {
  MarketCategory,
  StockFilter,
  RegionFilter,
  MarketAsset,
} from './types/market';

import {
  MAJOR_INDICES,
  GLOBAL_INDICES_TABLE,
  US_STOCKS,
  CRYPTO_ASSETS,
  COMMODITIES_ASSETS,
  FOREX_ASSETS,
  BONDS_ASSETS,
  ETF_ASSETS,
  ECONOMIC_DATA,
} from './data/marketData';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('overview');
  const [activeStockFilter, setActiveStockFilter] = useState<StockFilter>('most_active');
  const [activeRegion, setActiveRegion] = useState<RegionFilter>('global');
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);

  // Live real-time simulation state
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [majorIndices, setMajorIndices] = useState<MarketAsset[]>(MAJOR_INDICES);
  const [tableIndices, setTableIndices] = useState<MarketAsset[]>(GLOBAL_INDICES_TABLE);
  const [stocksData, setStocksData] = useState<Record<StockFilter, MarketAsset[]>>(US_STOCKS);
  const [cryptoData, setCryptoData] = useState<MarketAsset[]>(CRYPTO_ASSETS);
  const [futuresData, setFuturesData] = useState<MarketAsset[]>(COMMODITIES_ASSETS);
  const [forexData, setForexData] = useState<MarketAsset[]>(FOREX_ASSETS);
  const [bondsData, setBondsData] = useState<MarketAsset[]>(BONDS_ASSETS);
  const [etfData, setEtfData] = useState<MarketAsset[]>(ETF_ASSETS);

  // Modals & Panels
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);

  // Watchlist persistence
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist');
      return saved ? JSON.parse(saved) : ['nvda', 'spx', 'btc'];
    } catch {
      return ['nvda', 'spx', 'btc'];
    }
  });

  const toggleWatchlist = useCallback((assetId: string) => {
    setWatchlistIds((prev) => {
      const next = prev.includes(assetId)
        ? prev.filter((id) => id !== assetId)
        : [...prev, assetId];
      try {
        localStorage.setItem('tv_watchlist', JSON.stringify(next));
      } catch {
        // noop
      }
      return next;
    });
  }, []);

  // Keyboard shortcut for Search (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time subtle live price simulation
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      // Pick random asset group to subtly tick
      const dice = Math.random();

      if (dice < 0.4) {
        // Tick one major index
        setMajorIndices((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => {
            if (idx !== targetIdx) return { ...item, flashState: null };
            const deltaPercent = (Math.random() - 0.49) * 0.08;
            const newPrice = Number((item.price * (1 + deltaPercent / 100)).toFixed(2));
            const diff = Number((newPrice - item.prevClose).toFixed(2));
            const newPct = Number(((diff / item.prevClose) * 100).toFixed(2));
            return {
              ...item,
              price: newPrice,
              change: diff,
              changePercent: newPct,
              flashState: deltaPercent >= 0 ? 'up' : 'down',
            };
          });
        });
      } else if (dice < 0.75) {
        // Tick active stocks
        setStocksData((prev) => {
          const currentList = prev[activeStockFilter] || [];
          if (!currentList.length) return prev;
          const targetIdx = Math.floor(Math.random() * currentList.length);

          const updatedList = currentList.map((item, idx) => {
            if (idx !== targetIdx) return { ...item, flashState: null };
            const deltaPercent = (Math.random() - 0.48) * 0.12;
            const newPrice = Number((item.price * (1 + deltaPercent / 100)).toFixed(2));
            const diff = Number((newPrice - item.prevClose).toFixed(2));
            const newPct = Number(((diff / item.prevClose) * 100).toFixed(2));
            return {
              ...item,
              price: newPrice,
              change: diff,
              changePercent: newPct,
              flashState: deltaPercent >= 0 ? 'up' : 'down',
            };
          });

          return { ...prev, [activeStockFilter]: updatedList };
        });
      } else {
        // Tick table indices
        setTableIndices((prev) => {
          const targetIdx = Math.floor(Math.random() * prev.length);
          return prev.map((item, idx) => {
            if (idx !== targetIdx) return { ...item, flashState: null };
            const deltaPercent = (Math.random() - 0.49) * 0.06;
            const newPrice = Number((item.price * (1 + deltaPercent / 100)).toFixed(2));
            const diff = Number((newPrice - item.prevClose).toFixed(2));
            const newPct = Number(((diff / item.prevClose) * 100).toFixed(2));
            return {
              ...item,
              price: newPrice,
              change: diff,
              changePercent: newPct,
              flashState: deltaPercent >= 0 ? 'up' : 'down',
            };
          });
        });
      }
    }, 2800);

    return () => clearInterval(interval);
  }, [isLiveUpdating, activeStockFilter]);

  // Aggregate all assets for search and watchlist
  const allAssets = [
    ...majorIndices,
    ...tableIndices,
    ...stocksData.most_active,
    ...stocksData.gainers,
    ...stocksData.losers,
    ...stocksData.volatility,
    ...cryptoData,
    ...futuresData,
    ...forexData,
    ...bondsData,
    ...etfData,
  ];

  // Filtered table indices based on region
  const filteredTableIndices = tableIndices.filter((item) => {
    if (activeRegion === 'global') return true;
    return item.region === activeRegion;
  });

  // Watchlist assets
  const watchlistAssets = allAssets.filter((a) => watchlistIds.includes(a.id));

  // Determine active view content
  const renderContent = () => {
    if (activeCategory === 'overview') {
      return (
        <div className="space-y-12">
          {/* Hero Headline */}
          <section className="text-center pt-6 pb-2 relative" data-purpose="hero-title">
            <div className="relative inline-block">
              <button
                onClick={() => setIsRegionDropdownOpen(!isRegionDropdownOpen)}
                className="text-4xl md:text-5xl font-extrabold tracking-tight inline-flex items-center justify-center gap-3 cursor-pointer group text-gray-900 focus:outline-none"
                aria-label="Select Market Region"
              >
                <span>
                  {activeRegion === 'global'
                    ? 'Markets, everywhere'
                    : activeRegion === 'americas'
                    ? 'Markets, Americas'
                    : activeRegion === 'europe'
                    ? 'Markets, Europe'
                    : 'Markets, Asia-Pacific'}
                </span>
                <ChevronDown
                  className={`w-8 h-8 text-black group-hover:translate-y-0.5 transition-transform duration-200 ${
                    isRegionDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Region Dropdown */}
              {isRegionDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-[#E0E3EB] py-2 z-30 text-left animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-1.5 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Select Region
                  </div>
                  {[
                    { id: 'global', label: 'Everywhere (Global)', sub: 'All worldwide financial markets' },
                    { id: 'americas', label: 'Americas', sub: 'US, Canada, Latin America' },
                    { id: 'europe', label: 'Europe', sub: 'UK, Germany, France, Eurozone' },
                    { id: 'asia_pacific', label: 'Asia-Pacific', sub: 'Japan, Hong Kong, Australia' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setActiveRegion(r.id as RegionFilter);
                        setIsRegionDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left flex items-start justify-between hover:bg-gray-50 transition-colors cursor-pointer ${
                        activeRegion === r.id ? 'bg-blue-50/60 text-[#2962FF]' : 'text-gray-800'
                      }`}
                    >
                      <div>
                        <div className="text-sm font-semibold">{r.label}</div>
                        <div className="text-[11px] text-gray-400">{r.sub}</div>
                      </div>
                      {activeRegion === r.id && <Check className="w-4 h-4 text-[#2962FF] mt-1 shrink-0" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <p className="text-[#787B86] mt-2 text-base md:text-lg">
              Real-time global quotes, indices, movers, and live financial charts.
            </p>
          </section>

          {/* Section 1: Indices */}
          <IndicesSection
            majorIndices={majorIndices}
            tableIndices={filteredTableIndices}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            isLiveUpdating={isLiveUpdating}
            onToggleLive={() => setIsLiveUpdating(!isLiveUpdating)}
            onNavigateIndicesTab={() => setActiveCategory('indices')}
          />

          {/* Section 2: US Stocks & Market Leaders */}
          <StocksSection
            stocks={stocksData[activeStockFilter] || []}
            activeFilter={activeStockFilter}
            onChangeFilter={(filter) => setActiveStockFilter(filter)}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            onNavigateStocksTab={() => setActiveCategory('us_stocks')}
          />
        </div>
      );
    }

    if (activeCategory === 'indices') {
      return (
        <CategoryView
          category="indices"
          assets={[...majorIndices, ...tableIndices]}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'us_stocks') {
      return (
        <div className="space-y-6">
          <CategoryView
            category="us_stocks"
            assets={[
              ...stocksData.most_active,
              ...stocksData.gainers.slice(0, 3),
              ...stocksData.volatility.slice(0, 3),
            ]}
            economicData={[]}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            onBackToOverview={() => setActiveCategory('overview')}
          />
        </div>
      );
    }

    if (activeCategory === 'world_stocks') {
      return (
        <CategoryView
          category="world_stocks"
          assets={tableIndices}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'crypto') {
      return (
        <CategoryView
          category="crypto"
          assets={cryptoData}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'futures') {
      return (
        <CategoryView
          category="futures"
          assets={futuresData}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'forex') {
      return (
        <CategoryView
          category="forex"
          assets={forexData}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'bonds') {
      return (
        <CategoryView
          category="bonds"
          assets={bondsData}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'etfs') {
      return (
        <CategoryView
          category="etfs"
          assets={etfData}
          economicData={[]}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    if (activeCategory === 'economy') {
      return (
        <CategoryView
          category="economy"
          assets={[]}
          economicData={ECONOMIC_DATA}
          onSelectAsset={(asset) => setSelectedAsset(asset)}
          onBackToOverview={() => setActiveCategory('overview')}
        />
      );
    }

    return null;
  };

  return (
    <div
      className="min-h-screen flex flex-col font-sans selection:bg-blue-100 text-[#131722] bg-white"
      onClick={() => setIsRegionDropdownOpen(false)}
    >
      {/* Top Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        watchlistCount={watchlistIds.length}
        onOpenWatchlist={() => setIsWatchlistOpen(true)}
      />

      {/* Horizontal Market Sub-Navigation Pills */}
      <MarketSubNav
        activeCategory={activeCategory}
        onSelectCategory={(cat) => setActiveCategory(cat)}
      />

      {/* Main Content Area */}
      <main className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 w-full flex-1">
        {renderContent()}
      </main>

      {/* Main Footer */}
      <Footer />

      {/* Interactive Asset Detail Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
          isWatchlisted={watchlistIds.includes(selectedAsset.id)}
          onToggleWatchlist={toggleWatchlist}
        />
      )}

      {/* Symbol Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        allAssets={allAssets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
      />

      {/* Watchlist Slide-out Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlistAssets}
        onSelectAsset={(asset) => setSelectedAsset(asset)}
        onRemoveFromWatchlist={toggleWatchlist}
      />

      {/* Get Started / Registration Modal */}
      <GetStartedModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />
    </div>
  );
}
