import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface GetStartedModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GetStartedModal: React.FC<GetStartedModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [email, setEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs select-none animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-200 p-6 md:p-8 animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-black transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-green-100 text-[#089981] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-gray-900">Welcome to TradingView!</h3>
            <p className="text-sm text-gray-600">
              Your free trader account is ready. Happy charting and market tracking!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center space-y-2">
              {/* TV Logo */}
              <div className="flex justify-center mb-3">
                <svg className="w-10 h-8 text-black" fill="none" viewBox="0 0 36 28">
                  <path d="M0 0H7.5V28H0V0Z" fill="currentColor"></path>
                  <path d="M12.5 0H20V19H12.5V0Z" fill="currentColor"></path>
                  <path d="M25 0H32.5V9.5H25V0Z" fill="currentColor"></path>
                  <path d="M7.5 19H12.5V28H7.5V19Z" fill="currentColor"></path>
                  <path d="M20 9.5H25V28H20V9.5Z" fill="currentColor"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                Where the world does markets
              </h3>
              <p className="text-xs text-gray-500">
                Join over 50 million traders and investors exploring real-time global charts.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setIsSuccess(true);
                  setTimeout(() => { setIsSuccess(false); onClose(); }, 2000);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 font-semibold text-sm hover:bg-gray-50 transition cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.92H1.28v3.15C3.3 21.36 7.37 24 12 24z" />
                  <path fill="#FBBC05" d="M5.32 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28V6.57H1.28C.46 8.2 0 10.04 0 12s.46 3.8 1.28 5.43l4.04-3.15z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.3 2.64 1.28 6.57l4.04 3.15c.94-2.82 3.58-4.97 6.68-4.97z" />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-2">
                <div className="border-t border-gray-200 w-full"></div>
                <span className="bg-white px-3 text-xs text-gray-400 uppercase">or</span>
                <div className="border-t border-gray-200 w-full"></div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2962FF]"
                />
                <button
                  type="submit"
                  className="w-full cta-gradient text-white py-2.5 rounded-xl font-semibold text-sm hover:opacity-95 transition shadow-xs cursor-pointer"
                >
                  Start free exploration
                </button>
              </form>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#089981]" />
                <span>Zero hidden fees</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Sub-second tick updates</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
