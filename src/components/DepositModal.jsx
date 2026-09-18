import React, { useState } from 'react';
import { X, Wallet, ArrowDownRight, ArrowUpRight, Check, DollarSign, CreditCard, Building2, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DepositModal({
  onClose,
  onDepositSuccess,
  onWithdrawSuccess,
  currentBalance = 0,
  addToast
}) {
  const [tab, setTab] = useState('deposit'); // 'deposit' | 'withdraw'
  
  // Deposit state
  const [amount, setAmount] = useState(25000);
  const [method, setMethod] = useState('qr');

  // Withdraw state
  const [withdrawAmount, setWithdrawAmount] = useState(10000);
  const [bankName, setBankName] = useState('Vietcombank (VCB)');
  const [accountNumber, setAccountNumber] = useState('1019283746');
  const [accountName, setAccountName] = useState('ALEX VANCE');
  const [withdrawError, setWithdrawError] = useState('');

  const handleDeposit = () => {
    if (!amount || amount <= 0) return;
    onDepositSuccess(Number(amount));
    
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#10B981', '#34D399', '#FBBF24']
    });

    onClose();
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    setWithdrawError('');

    const val = Number(withdrawAmount);
    if (!val || val <= 0) {
      setWithdrawError('Số tiền rút không hợp lệ.');
      return;
    }

    if (val > currentBalance) {
      setWithdrawError('Số dư ví khả dụng không đủ để rút số tiền này.');
      return;
    }

    if (!accountNumber.trim() || !accountName.trim()) {
      setWithdrawError('Vui lòng điền đầy đủ thông tin tài khoản ngân hàng nhận tiền.');
      return;
    }

    onWithdrawSuccess(val, { bankName, accountNumber, accountName });
    if (addToast) {
      addToast('Yêu Cầu Rút Tiền Thành Công', `Đã chuyển $${val.toLocaleString()} về tài khoản ${bankName}`, 'success');
    }
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md relative" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 space-y-5">
          
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Quản Lý Ví AuraBid</h3>
              <p className="text-xs text-gray-400">
                Số dư hiện tại: <strong className="text-emerald-400 font-mono">${currentBalance.toLocaleString()}</strong>
              </p>
            </div>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-[#101623] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setTab('deposit')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'deposit' ? 'bg-emerald-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              Nạp Tiền
            </button>
            <button
              type="button"
              onClick={() => setTab('withdraw')}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'withdraw' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Rút Tiền
            </button>
          </div>

          {/* TAB 1: DEPOSIT */}
          {tab === 'deposit' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold block">Mức Nạp Nhanh:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[10000, 25000, 100000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setAmount(val)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                        amount === val
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-[#101623] border-white/10 text-gray-300 hover:border-white/30'
                      }`}
                    >
                      +${val >= 1000 ? `${val / 1000}k` : val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold block">Số Tiền Tùy Chỉnh ($ USD):</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    min="100"
                    className="w-full bg-[#101623] border border-white/15 rounded-xl pl-8 pr-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-semibold block">Phương Thức Thanh Toán:</label>
                <div className="space-y-2 text-xs">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    method === 'qr' ? 'bg-white/5 border-emerald-500/50' : 'bg-[#101623] border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="pay" checked={method === 'qr'} onChange={() => setMethod('qr')} className="accent-emerald-500" />
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span className="text-white font-medium">Chuyển Khoản QR VietQR / Banking</span>
                    </div>
                    <span className="text-[10px] text-emerald-400 font-bold">Xử lý 30 giây</span>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer ${
                    method === 'card' ? 'bg-white/5 border-emerald-500/50' : 'bg-[#101623] border-white/5'
                  }`}>
                    <div className="flex items-center gap-2">
                      <input type="radio" name="pay" checked={method === 'card'} onChange={() => setMethod('card')} className="accent-emerald-500" />
                      <CreditCard className="w-4 h-4 text-amber-400" />
                      <span className="text-white font-medium">Thẻ Quốc Tế Visa / MasterCard / Amex</span>
                    </div>
                    <span className="text-[10px] text-gray-400">Tức thì</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleDeposit}
                className="btn-emerald w-full py-3 text-sm font-bold"
              >
                Xác Nhận Nạp +${Number(amount).toLocaleString()}
              </button>
            </div>
          )}

          {/* TAB 2: WITHDRAW */}
          {tab === 'withdraw' && (
            <form onSubmit={handleWithdraw} className="space-y-4">
              {withdrawError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                  {withdrawError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Số Tiền Muốn Rút ($ USD)</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    max={currentBalance}
                    className="w-full bg-[#101623] border border-white/15 rounded-xl pl-8 pr-4 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Tên Ngân Hàng Nhận</label>
                <select
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Vietcombank (VCB)">Vietcombank (VCB)</option>
                  <option value="Techcombank (TCB)">Techcombank (TCB)</option>
                  <option value="MB Bank">MB Bank</option>
                  <option value="ACB Bank">ACB Bank</option>
                  <option value="Crypto USDT Wallet">Ví USDT ERC-20 / TRC-20</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Số Tài Khoản</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Tên Chủ Tài Khoản</label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    className="input-field text-xs uppercase"
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                Lưu ý: Yêu cầu rút tiền được kiểm duyệt tự động 24/7 và giải ngân trong vòng 5-15 phút.
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-amber-500/20"
              >
                Xác Nhận Rút -${Number(withdrawAmount).toLocaleString()}
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
