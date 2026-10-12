import React, { useState } from 'react';
import {
  CreditCard,
  QrCode,
  Wallet,
  ShoppingBag,
  HeartHandshake,
  CheckCircle,
  Plus,
  ArrowRight,
  TrendingUp,
  Receipt,
  Download,
  ShieldCheck,
} from 'lucide-react';
import { TuckShopItem } from '../types';
import { TUCK_SHOP_ITEMS } from '../data/mockData';

interface CashlessTabProps {
  onOpenFeePaymentModal: () => void;
}

export const CashlessTab: React.FC<CashlessTabProps> = ({
  onOpenFeePaymentModal,
}) => {
  const [walletBalance, setWalletBalance] = useState<number>(42.50);
  const [topUpAmount, setTopUpAmount] = useState<number>(25);
  const [cart, setCart] = useState<{ item: TuckShopItem; quantity: number }[]>([]);
  const [fundraisingRaised, setFundraisingRaised] = useState<number>(14650);
  const fundraisingTarget = 20000;
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleTopUp = () => {
    setWalletBalance((prev) => prev + topUpAmount);
    showToast(`Added $${topUpAmount.toFixed(2)} to Sipho's Tuck Shop Wallet.`);
  };

  const handleAddToCart = (item: TuckShopItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.item.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    showToast(`Added "${item.name}" to Tuck Shop pre-order.`);
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.item.price * curr.quantity, 0);

  const handleCheckoutCart = () => {
    if (walletBalance < cartTotal) {
      showToast('Insufficient wallet balance. Please top up first.');
      return;
    }
    setWalletBalance((prev) => prev - cartTotal);
    setCart([]);
    showToast(`Pre-order submitted ($${cartTotal.toFixed(2)}). Meal ready at 10:15 Break.`);
  };

  const handlePledge = (amount: number) => {
    setFundraisingRaised((prev) => prev + amount);
    showToast(`Thank you! Pledged $${amount} toward the STEM Lab Campaign.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Safe & Cashless School Finance
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-xl">
            Zero cash on school grounds. Manage school fee statements, tuck shop pre-orders, digital wallet allowances, and STEM fundraising campaigns securely.
          </p>
        </div>

        <button
          onClick={onOpenFeePaymentModal}
          className="self-start sm:self-auto px-4 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
        >
          <CreditCard className="w-3.5 h-3.5" />
          Pay School Fees Online
        </button>
      </div>

      {toastMessage && (
        <div className="bg-slate-900 text-white text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          {toastMessage}
        </div>
      )}

      {/* Grid: Cashless Wallet + Barcode Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Cashless Student Card Simulation */}
        <div className="bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400 tracking-wider">
                GLENVIEW PSDS CASHLESS
              </span>
              <span className="text-[10px] text-blue-200 uppercase font-mono">
                NFC / BARCODE ACTIVE
              </span>
            </div>

            <div className="mt-4">
              <span className="text-[11px] text-blue-300">Tuck Shop Wallet Balance</span>
              <p className="text-3xl font-bold font-mono tracking-tight mt-0.5">
                ${walletBalance.toFixed(2)}
              </p>
              <span className="text-[11px] text-blue-200 mt-1 block">
                Daily Limit: $15.00 · Student: Sipho Khumalo
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-blue-800/80 space-y-3">
            {/* Simulated Barcode */}
            <div className="bg-white rounded-lg p-3 text-center">
              <div className="h-9 flex items-center justify-center space-x-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full bg-black ${i % 3 === 0 ? 'w-1' : i % 2 === 0 ? 'w-0.5' : 'w-1.5'}`}
                  ></div>
                ))}
              </div>
              <span className="font-mono text-[10px] text-slate-800 tracking-widest mt-1 block">
                GV-2024-4019-SK
              </span>
            </div>
            <p className="text-[10px] text-blue-300 text-center">
              Scan at canteen till or vending kiosk for contactless payment
            </p>
          </div>
        </div>

        {/* Quick Top-Up Container */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-blue-900" />
              Instant Wallet Top-Up
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Refill student allowance via debit card or instant bank transfer. Zero transaction fees.
            </p>

            <div className="grid grid-cols-3 gap-2 mt-4">
              {[10, 25, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopUpAmount(amt)}
                  className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                    topUpAmount === amt
                      ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="text-[11px] font-medium text-slate-400 block mb-1">
                Or enter custom amount:
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={handleTopUp}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              Top Up ${topUpAmount.toFixed(2)} Now
            </button>
          </div>
        </div>

        {/* STEM Lab Fundraising Spotlight */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-600" />
              <h2 className="text-base font-bold text-slate-900">
                STEM & Robotics Lab Campaign
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Funding 24 high-spec workstations and 3D prototyping printers for learners.
            </p>

            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 font-mono tabular-nums">
                  ${fundraisingRaised.toLocaleString()} raised
                </span>
                <span className="text-slate-400 font-mono tabular-nums">
                  Goal: ${fundraisingTarget.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (fundraisingRaised / fundraisingTarget) * 100)}%` }}
                ></div>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium block">
                {((fundraisingRaised / fundraisingTarget) * 100).toFixed(0)}% reached · 88 donor families
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
            <button
              onClick={() => handlePledge(20)}
              className="flex-1 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-lg transition-colors"
            >
              Pledge $20
            </button>
            <button
              onClick={() => handlePledge(50)}
              className="flex-1 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition-colors shadow-xs"
            >
              Pledge $50
            </button>
          </div>
        </div>
      </div>

      {/* Tuck Shop Pre-Orders Menu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-900" />
              Healthy Tuck Shop Pre-Orders
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pre-order nutritious meals and fresh smoothies. Orders prepared for pick up at 09:45 Break.
            </p>
          </div>

          {cart.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-700">
                Cart Total: <strong className="font-mono text-blue-900">${cartTotal.toFixed(2)}</strong>
              </span>
              <button
                onClick={handleCheckoutCart}
                className="px-4 py-1.5 text-xs font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                Confirm Pre-Order ({cart.length})
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TUCK_SHOP_ITEMS.map((item) => (
            <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex flex-col justify-between bg-slate-50/40">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-medium">Available Today</span>
                <button
                  onClick={() => handleAddToCart(item)}
                  className="px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 hover:border-blue-900 text-blue-900 rounded-lg transition-colors shadow-2xs flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
