import React, { useState, useEffect } from 'react';
import { Search, Globe, User, ChevronDown, Check, Bookmark } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  watchlistCount: number;
  onOpenWatchlist: () => void;
}

const LANGUAGES = [
  { code: 'EN', name: 'English (US)' },
  { code: 'ES', name: 'Español' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'FR', name: 'Français' },
  { code: 'JA', name: '日本語' },
  { code: 'ZH', name: '简体中文' },
];

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenAuth,
  watchlistCount,
  onOpenWatchlist,
}) => {
  const [selectedLang, setSelectedLang] = useState('EN');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleWindowClick = () => {
      setIsLangOpen(false);
      setIsAccountOpen(false);
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E0E3EB] select-none" data-purpose="top-navigation-bar">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Search Area */}
        <div className="flex items-center gap-6 flex-1">
          {/* TradingView Logo Mark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 text-black hover:opacity-80 transition-opacity focus:outline-none"
            title="TradingView Markets"
            aria-label="TradingView Home"
          >
            <svg className="w-9 h-7 shrink-0" fill="none" viewBox="0 0 36 28" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H7.5V28H0V0Z" fill="currentColor"></path>
              <path d="M12.5 0H20V19H12.5V0Z" fill="currentColor"></path>
              <path d="M25 0H32.5V9.5H25V0Z" fill="currentColor"></path>
              <path d="M7.5 19H12.5V28H7.5V19Z" fill="currentColor"></path>
              <path d="M20 9.5H25V28H20V9.5Z" fill="currentColor"></path>
            </svg>
          </button>

          {/* Search Bar with Shortcut Badge */}
          <div className="relative w-full max-w-xs md:max-w-sm hidden sm:block">
            <button
              onClick={onOpenSearch}
              className="w-full bg-[#f0f3fa] hover:bg-[#e7eaf2] text-sm text-gray-500 rounded-full pl-10 pr-4 py-2 border-none flex items-center justify-between transition-colors text-left group cursor-pointer"
            >
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
                <Search className="w-4 h-4" />
              </div>
              <span className="text-gray-500 text-sm">Search (Ctrl+K)</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[11px] font-mono text-gray-500 bg-white rounded border border-gray-300 shadow-2xs">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Mobile search trigger */}
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-full transition"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-[15px] font-medium text-gray-800">
            <a href="#products" onClick={(e) => { e.preventDefault(); alert("Explore advanced charting, screener tools, heatmaps, and financial indicators."); }} className="hover:text-[#2962FF] transition-colors">
              Products
            </a>
            <a href="#community" onClick={(e) => { e.preventDefault(); alert("Join 50M+ active investors sharing trade ideas, scripts, and market analysis."); }} className="hover:text-[#2962FF] transition-colors">
              Community
            </a>
            <a href="#markets" className="text-[#2962FF] font-semibold flex items-center gap-1 border-b-2 border-[#2962FF] py-5">
              Markets
            </a>
            <a href="#brokers" onClick={(e) => { e.preventDefault(); alert("Connect directly with integrated brokerage partners for zero-latency execution."); }} className="hover:text-[#2962FF] transition-colors">
              Brokers
            </a>
            <a href="#more" onClick={(e) => { e.preventDefault(); alert("More tools: Pine Script Editor, Economic Calendar, Earnings Calendar, Crypto Heatmaps."); }} className="hover:text-[#2962FF] transition-colors">
              More
            </a>
          </nav>
        </div>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-3">
          {/* Watchlist Quick Button */}
          <button
            onClick={onOpenWatchlist}
            className="relative p-2 rounded-full text-gray-700 hover:bg-gray-100 transition"
            title="Watchlist"
            aria-label="Watchlist"
          >
            <Bookmark className="w-5 h-5" />
            {watchlistCount > 0 && (
              <span className="absolute top-1 right-1 bg-[#2962FF] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Language Switcher */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setIsLangOpen(!isLangOpen);
                setIsAccountOpen(false);
              }}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 hover:text-black px-2.5 py-1.5 rounded-lg hover:bg-gray-100 transition cursor-pointer"
              aria-label="Select language"
            >
              <Globe className="w-5 h-5 text-gray-600" />
              <span>{selectedLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-[#E0E3EB] py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Select Language
                </div>
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLang(lang.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      selectedLang === lang.code ? 'text-[#2962FF] font-semibold bg-blue-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>{lang.name}</span>
                    {selectedLang === lang.code && <Check className="w-4 h-4 text-[#2962FF]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Profile Avatar / Icon */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => {
                setIsAccountOpen(!isAccountOpen);
                setIsLangOpen(false);
              }}
              aria-label="Account"
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 transition cursor-pointer"
            >
              <User className="w-5 h-5" />
            </button>

            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E0E3EB] p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2962FF] font-bold flex items-center justify-center text-sm">
                    TV
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">Guest Trader</div>
                    <div className="text-xs text-gray-500">Live Free Plan</div>
                  </div>
                </div>
                <div className="py-2 space-y-1">
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenWatchlist();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <span>Watchlist</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">
                      {watchlistCount}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenSearch();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    Symbol Search
                  </button>
                  <button
                    onClick={() => {
                      setIsAccountOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full text-left px-2.5 py-1.5 text-sm text-[#2962FF] font-medium hover:bg-blue-50 rounded-lg"
                  >
                    Sign In / Create Account
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* CTA Button with Vibrant Gradient */}
          <button
            onClick={onOpenAuth}
            className="cta-gradient text-white text-sm font-semibold px-4 py-2 rounded-full shadow-xs hover:opacity-95 active:scale-98 transition-all cursor-pointer whitespace-nowrap"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
