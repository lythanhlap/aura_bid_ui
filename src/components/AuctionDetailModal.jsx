import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Heart, Clock, TrendingUp, AlertCircle, Bot, Zap, Trophy, History, Shield, ArrowUpRight } from 'lucide-react';

export default function AuctionDetailModal({
  auction,
  onClose,
  onPlaceBid,
  onSetAutoBid,
  user,
  isWatchlisted,
  onToggleWatchlist
}) {
  const [selectedImage, setSelectedImage] = useState(auction.image);
  const [customBidAmount, setCustomBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [autoBidMax, setAutoBidMax] = useState('');
  const [isAutoBidActive, setIsAutoBidActive] = useState(!!auction.userAutoBidMax);
  const [bidError, setBidError] = useState('');

  const isAdmin = user && user.role === 'System Admin';

  // Countdown timer simulation state
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auction.endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(auction.endTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime]);

  function calculateTimeLeft(endTime) {
    const difference = endTime - Date.now();
    if (difference <= 0) return { hours: 0, minutes: 0, seconds: 0, isEnded: true };
    return {
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isEnded: false
    };
  }

  const minBidAllowed = auction.currentBid + auction.bidIncrement;
  const presets = [
    minBidAllowed,
    minBidAllowed + auction.bidIncrement,
    minBidAllowed + auction.bidIncrement * 2,
    minBidAllowed + auction.bidIncrement * 5
  ];

  const handleBidSubmit = (amount) => {
    setBidError('');
    if (amount < minBidAllowed) {
      setBidError(`Mức giá phải tối thiểu là $${minBidAllowed.toLocaleString()}`);
      return;
    }
    onPlaceBid(auction.id, amount);
  };

  const handleActivateAutoBid = () => {
    const maxVal = Number(autoBidMax);
    if (!maxVal || maxVal < minBidAllowed + auction.bidIncrement) {
      setBidError(`Mức Auto-Bid tối đa phải từ $${(minBidAllowed + auction.bidIncrement).toLocaleString()}`);
      return;
    }
    onSetAutoBid(auction.id, maxVal);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-5xl relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Image Gallery & Seller Specs */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Main Active Image Display */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden border border-white/10 bg-[#101623]">
                <img
                  src={selectedImage}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <span className="badge-live absolute top-4 left-4">
                  {auction.status.toUpperCase()} AUCTION
                </span>
              </div>

              {/* Gallery Thumbnails */}
              {auction.gallery && auction.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {auction.gallery.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Thumbnail"
                      onClick={() => setSelectedImage(img)}
                      className={`w-20 h-16 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                        selectedImage === img
                          ? 'border-amber-400 scale-105'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Specifications */}
              <div className="bg-[#101623] p-4 rounded-xl border border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Thông Số Kỹ Thuật & Giám Định</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {auction.specification?.map((spec, i) => (
                    <div key={i} className="flex flex-col bg-[#151d2a] p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 text-[10px]">{spec.label}:</span>
                      <span className="text-gray-200 font-bold">{spec.value}</span>
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
                    <h5 className="text-sm font-bold text-white">{auction.seller?.name}</h5>
                    <p className="text-xs text-gray-400">Đã bán {auction.seller?.salesCount} phiên • Đánh giá ★ {auction.seller?.rating}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Đã Xác Minh
                </span>
              </div>

            </div>

            {/* Right Column: Bidding Stream & Actions */}
            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">

              {/* Title & Watchlist */}
              <div>
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-black text-white font-heading leading-snug">
                    {auction.title}
                  </h2>
                  <button
                    onClick={() => onToggleWatchlist(auction.id)}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isWatchlisted
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
              <div className={`p-4 rounded-2xl border space-y-3 ${
                timeLeft.isEnded ? 'bg-[#151d2a] border-gray-500/40' : 'bg-[#101623] border-amber-500/30'
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

              {/* Proxy Bidding Mechanism Notice */}
              {!isAdmin && (
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <Shield className="w-4 h-4 text-amber-400" />
                    Cơ Chế Ủy Quyền Đấu Giá Qua Admin:
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    Theo quy định AuraBid, yêu cầu trả giá của bạn sẽ được gửi tới Admin thẩm định và đặt giá công khai đại diện dưới danh tính Admin.
                  </p>
                </div>
              )}

              {/* Quick Bid Preset Buttons */}
              <div className="space-y-2">
                <label className="text-xs text-gray-300 font-bold uppercase tracking-wider block">
                  {isAdmin ? 'Đặt Giá Nhanh 1-Click (Admin):' : 'Chọn Mức Giá Đề Xuất Gửi Admin:'}
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
                  Nhập Mức Giá Tùy Chỉnh ($ USD):
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
                    className="btn-primary py-2.5 px-5 text-xs sm:text-sm font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>{isAdmin ? 'Đặt Giá Admin' : 'Gửi Yêu Cầu Cho Admin'}</span>
                  </button>
                </div>

                {bidError && (
                  <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
                    <AlertCircle className="w-4 h-4" />
                    {bidError}
                  </div>
                )}
              </div>

              {/* Bids History Stream */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Lịch Sử Đặt Giá Công Khai</span>
                  <span className="text-amber-400 font-normal">{auction.bids?.length || 0} lượt gần nhất</span>
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {auction.bids?.map((bid, i) => (
                    <div
                      key={bid.id || i}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs ${
                        i === 0
                          ? 'bg-amber-500/10 border border-amber-500/30'
                          : 'bg-[#101623] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={bid.avatar} alt={bid.bidder} className="w-6 h-6 rounded-full object-cover" />
                        <span className={`font-bold ${i === 0 ? 'text-amber-300' : 'text-gray-300'}`}>
                          {bid.bidder}
                        </span>
                        {i === 0 && (
                          <span className="bg-amber-500/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            DẪN ĐẦU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-gray-400">{bid.time}</span>
                        <span className="font-extrabold text-white number-tabular">${bid.amount.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
