import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer
      className="border-t border-[#E0E3EB] py-8 text-xs text-[#787B86] bg-[#fafbfc] select-none mt-auto"
      data-purpose="site-footer"
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <svg
            className="w-6 h-5 text-gray-500 shrink-0"
            fill="none"
            viewBox="0 0 36 28"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0H7.5V28H0V0Z" fill="currentColor"></path>
            <path d="M12.5 0H20V19H12.5V0Z" fill="currentColor"></path>
            <path d="M25 0H32.5V9.5H25V0Z" fill="currentColor"></path>
            <path d="M7.5 19H12.5V28H7.5V19Z" fill="currentColor"></path>
            <path d="M20 9.5H25V28H20V9.5Z" fill="currentColor"></path>
          </svg>
          <span>© 2024 TradingView, Inc. Real-time market data and analytical tools.</span>
        </div>

        <div className="flex items-center gap-6 font-medium">
          <button
            onClick={() => alert("TradingView Terms of Use: Market quotes and data provided for personal and informational analytical purposes.")}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Terms of use
          </button>
          <button
            onClick={() => alert("TradingView Privacy Policy: Your financial security, personal data, and preferences are protected.")}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Privacy policy
          </button>
          <button
            onClick={() => alert("Cookie settings: Analytical session tokens and market filter preferences are stored locally.")}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Cookies
          </button>
          <button
            onClick={() => alert("Financial Disclaimer: Market data is provided 'as is' for informational purposes only and is not intended for trading advice.")}
            className="hover:text-black transition-colors cursor-pointer"
          >
            Disclaimer
          </button>
        </div>
      </div>
    </footer>
  );
};
