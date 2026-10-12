import React, { useState } from 'react';
import { CreditCard, CheckCircle, ShieldCheck, QrCode, Building, Lock } from 'lucide-react';

interface FeePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (amount: number, method: string) => void;
}

export const FeePaymentModal: React.FC<FeePaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [method, setMethod] = useState<'card' | 'eft' | 'snapscan'>('card');
  const [amount, setAmount] = useState<number>(395.00);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [completedReceipt, setCompletedReceipt] = useState<{ ref: string; date: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const receipt = {
        ref: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setCompletedReceipt(receipt);
      onPaymentSuccess(amount, method);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                Secure School Fee Payment
              </h3>
              <p className="text-[11px] text-slate-400">Glenview PSDS Bursar's Office Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-sm"
          >
            ✕
          </button>
        </div>

        {completedReceipt ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-slate-900">Payment Processed Successfully</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Your school fee account has been credited. Official tax invoice dispatched to registered email.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Receipt Ref:</span>
                <span className="font-mono font-bold text-slate-800">{completedReceipt.ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-bold text-emerald-700">${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-700">{completedReceipt.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Student:</span>
                <span className="text-slate-700">Sipho Khumalo (Gr 10A)</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold shadow-xs"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Amount */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Payment Amount ($ USD / ZAR equivalent)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">$</span>
                <input
                  type="number"
                  required
                  min={10}
                  step={5}
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-900 font-mono font-bold"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Full term 4 balance: $395.00</span>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Choose Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  className={`py-2 px-2.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'card'
                      ? 'border-blue-900 bg-blue-50 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-blue-900" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('eft')}
                  className={`py-2 px-2.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'eft'
                      ? 'border-blue-900 bg-blue-50 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <Building className="w-4 h-4 text-blue-900" />
                  <span>Instant EFT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('snapscan')}
                  className={`py-2 px-2.5 rounded-lg border font-medium flex flex-col items-center gap-1 transition-all ${
                    method === 'snapscan'
                      ? 'border-blue-900 bg-blue-50 text-blue-950 font-semibold'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <QrCode className="w-4 h-4 text-blue-900" />
                  <span>SnapScan</span>
                </button>
              </div>
            </div>

            {method === 'card' ? (
              <div className="space-y-2.5 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="•••• •••• •••• 4019"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">Expiry</label>
                    <input
                      type="text"
                      defaultValue="09/29"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="•••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>
            ) : method === 'snapscan' ? (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center space-y-2">
                <QrCode className="w-24 h-24 mx-auto text-blue-900" />
                <p className="text-xs text-slate-600">Scan QR code using SnapScan or banking app</p>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600 space-y-1">
                <p><strong>Bank:</strong> Standard Bank / First National</p>
                <p><strong>Account Name:</strong> Glenview PSDS Tuition</p>
                <p><strong>Account Number:</strong> 2049182019</p>
                <p><strong>Beneficiary Ref:</strong> GV-ACC-8821-KHUMALO</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Lock className="w-3.5 h-3.5" />
              {isProcessing ? 'Processing Transaction...' : `Authorize $${amount.toFixed(2)} Payment`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
