import React, { useState, useEffect } from 'react';
import { X, Clock, TrendingUp, ShieldCheck, Zap, Heart, CheckCircle2, History, Bot, Sparkles, AlertCircle, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AuctionDetailModal({
  auction,
  onClose,
  onPlaceBid,
  onSetAutoBid,
  user,
  isWatchlisted,
  onToggleWatchlist
}) {
  const [selectedImg, setSelectedImg] = useState(auction.gallery[0] || auction.image);
  const [customBidAmount, setCustomBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [autoBidMax, setAutoBidMax] = useState(auction.userAutoBidMax || '');
  const [isAutoBidActive, setIsAutoBidActive] = useState(Boolean(auction.userAutoBidMax));
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isEnded: false });
  const [bidError, setBidError] = useState('');

  useEffect(() => {
    setCustomBidAmount(auction.currentBid + auction.bidIncrement);
  }, [auction.currentBid, auction.bidIncrement]);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, auction.endTime - now);
      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isEnded: true });
        return;
      }
      const hours = Math.floor(diff / (1000 * 3600));
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds, isEnded: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const handleBidSubmit = (amountToBid) => {
    if (timeLeft.isEnded) {
      setBidError('Phiên đấu giá đã kết thúc, không thể đặt giá thêm.');
      return;
    }

    const minRequired = auction.currentBid + auction.bidIncrement;
    if (amountToBid < minRequired) {
      setBidError(`Mức giá phải tối thiểu là $${minRequired.toLocaleString()}`);
      return;
    }
    if (amountToBid > user.balance) {
      setBidError(`Số dư ví khả dụng không đủ ($${user.balance.toLocaleString()})`);
      return;
    }

    setBidError('');
    onPlaceBid(auction.id, amountToBid);

    // Fire golden confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#F59E0B', '#10B981']
    });
  };

  const handleActivateAutoBid = () => {
    const numMax = Number(autoBidMax);
    if (!numMax || numMax <= auction.currentBid) {
      setBidError(`Auto-Bid phải lớn hơn giá hiện tại ($${auction.currentBid.toLocaleString()})`);
      return;
    }
    if (onSetAutoBid) {
      onSetAutoBid(auction.id, numMax);
      setIsAutoBidActive(true);
      setBidError('');
    }
  };

  const minBidAllowed = auction.currentBid + auction.bidIncrement;
  const presets = [
    minBidAllowed,
    minBidAllowed + auction.bidIncrement,
    minBidAllowed + auction.bidIncrement * 2,
    minBidAllowed + auction.bidIncrement * 5
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content relative" onClick={(e) => e.stopPropagation()}>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 sm:p-8">

          {/* Left Column: Image Gallery & Specifications */}
          <div className="lg:col-span-6 space-y-6">

            {/* Main Main Image View */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/15 bg-black/60">
              <img
                src={selectedImg}
                alt={auction.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="badge-live">
                  <span className="pulse-dot"></span>
                  LIVE Bidding
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {auction.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {auction.gallery.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImg(imgUrl)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === imgUrl ? 'border-amber-400 scale-105 shadow-md' : 'border-white/10 opacity-60 hover:opacity-100'
                      }`}
                  >
                    <img src={imgUrl} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Specifications Card */}
            <div className="bg-[#101623] p-5 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Thông Số Kỹ Thuật & Giám Định
              </h4>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {auction.specification.map((spec, idx) => (
                  <div key={idx} className="flex justify-between py-1.5 border-b border-white/5 last:border-none">
                    <span className="text-gray-400">{spec.label}:</span>
                    <span className="text-gray-200 font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Seller info */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-[#101623] border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="text-sm font-bold text-white">{auction.seller.name}</h5>
                  <p className="text-xs text-gray-400">Đã bán {auction.seller.salesCount} phiên • Đánh giá ★ {auction.seller.rating}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Đã Xác Minh
              </span>
            </div>

          </div>

          {/* Right Column: Title, Real-Time Bid Stream & Bid Action Panel */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

            {/* Header Title & Watchlist */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-black text-white font-heading leading-snug">
                  {auction.title}
                </h2>
                <button
                  onClick={() => onToggleWatchlist(auction.id)}
                  className={`p-2.5 rounded-xl border transition-all ${isWatchlisted
                      ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isWatchlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                {auction.description}
              </p>
            </div>

            {/* Current Bid & Countdown Banner */}
            <div className={`p-4 rounded-2xl border space-y-3 ${timeLeft.isEnded ? 'bg-[#151d2a] border-gray-500/40' : 'bg-[#101623] border-amber-500/30'
              }`}>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  {timeLeft.isEnded ? 'Giá Thắng Cuộc Cuối Cùng' : 'Mức Giá Đã Trả Cao Nhất'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {timeLeft.isEnded ? (
                    <strong className="text-rose-400 font-bold uppercase">Đã Kết Thúc (SOLD)</strong>
                  ) : (
                    <>
                      Đếm ngược:
                      <strong className="text-white font-mono ml-1">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                      </strong>
                    </>
                  )}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-3xl font-black text-amber-400 number-tabular">
                  ${auction.currentBid.toLocaleString()}
                </div>
                {timeLeft.isEnded && auction.bids[0] && (
                  <div className="flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs px-3 py-1.5 rounded-xl font-bold">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    Thắng cuộc: {auction.bids[0].bidder}
                  </div>
                )}
              </div>

              <div className="text-xs text-gray-400 flex items-center justify-between pt-1 border-t border-white/5">
                <span>Bước giá tối thiểu: <strong className="text-gray-200">+${auction.bidIncrement.toLocaleString()}</strong></span>
                <span>Tổng lượt trả giá: <strong className="text-amber-400">{auction.totalBids}</strong></span>
              </div>
            </div>

            {/* Quick Bid Preset Buttons */}
            <div className="space-y-2">
              <label className="text-xs text-gray-300 font-bold uppercase tracking-wider block">
                Đặt Giá Nhanh 1-Click:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {presets.map((presetVal, i) => (
                  <button
                    key={i}
                    onClick={() => handleBidSubmit(presetVal)}
                    className="btn-secondary text-xs py-2.5 font-bold hover:border-amber-500 hover:text-amber-400"
                  >
                    ${presetVal.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Bid Input Form */}
            <div className="space-y-3">
              <label className="text-xs text-gray-300 font-bold uppercase tracking-wider block">
                Nhập Số Tiền Tùy Chỉnh:
              </label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3.5 top-2.5 text-gray-400 font-bold">$</span>
                  <input
                    type="number"
                    value={customBidAmount}
                    onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                    min={minBidAllowed}
                    step={auction.bidIncrement}
                    className="w-full bg-[#101623] border border-white/15 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <button
                  onClick={() => handleBidSubmit(customBidAmount)}
                  className="btn-primary py-2.5 px-6 text-sm"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  Xác Nhận Trả Giá
                </button>
              </div>

              {bidError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                  <AlertCircle className="w-4 h-4" />
                  {bidError}
                </div>
              )}
            </div>

            {/* Auto-Bid Proxy Feature */}
            <div className="bg-[#101623]/80 p-3.5 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" />
                  Ủy Quyền Đấu Giá Tự Động (Auto-Bid)
                </span>
                <input
                  type="checkbox"
                  checked={isAutoBidActive}
                  onChange={(e) => setIsAutoBidActive(e.target.checked)}
                  className="accent-cyan-500 cursor-pointer w-4 h-4"
                />
              </div>

              {isAutoBidActive && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="number"
                    placeholder="Mức giá tối đa bạn ủy quyền..."
                    value={autoBidMax}
                    onChange={(e) => setAutoBidMax(e.target.value)}
                    className="flex-1 bg-[#151d2a] border border-cyan-500/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                  />
                  <button
                    onClick={handleActivateAutoBid}
                    className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg"
                  >
                    Kích Hoạt
                  </button>
                </div>
              )}
            </div>

            {/* Real-time Bid Stream Log */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                <span className="flex items-center gap-1">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  Lịch Sử Đặt Giá Trực Tiếp
                </span>
                <span>{auction.bids.length} giao dịch gần nhất</span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                {auction.bids.map((bid, index) => (
                  <div
                    key={bid.id || index}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs transition-all ${index === 0
                        ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 new-bid-flash'
                        : 'bg-[#101623] border border-white/5 text-gray-300'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={bid.avatar} alt={bid.bidder} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-bold">{bid.bidder}</span>
                      {index === 0 && <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-1.5 rounded">LEADER</span>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-white number-tabular">${bid.amount.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400">{bid.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
