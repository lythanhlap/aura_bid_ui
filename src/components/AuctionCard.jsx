import React, { useState, useEffect } from 'react';
import { Clock, TrendingUp, Zap, Heart, ShieldCheck, Flame } from 'lucide-react';

export default function AuctionCard({ auction, onSelectAuction, onQuickBid, isWatchlisted, onToggleWatchlist }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0, isUrgent: false, isEnded: false });

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, auction.endTime - now);

      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isUrgent: false, isEnded: true });
        return;
      }

      const hours = Math.floor(diff / (1000 * 3600));
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      const isUrgent = diff < 15 * 60 * 1000; // Urgent if under 15 minutes

      setTimeLeft({ hours, minutes, seconds, isUrgent, isEnded: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction.endTime]);

  const topBidder = auction.bids[0];

  return (
    <div className="glass-panel glass-panel-hover flex flex-col justify-between overflow-hidden group border border-white/10 hover:border-amber-500/40 relative">
      
      {/* Top Image Section */}
      <div className="relative aspect-[4/3] bg-black/50 overflow-hidden cursor-pointer" onClick={() => onSelectAuction(auction)}>
        <img
          src={auction.image}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#151d2a] via-transparent to-black/30"></div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {timeLeft.isEnded ? (
            <span className="bg-gray-500/20 text-gray-300 border border-white/10 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
              ĐÃ KẾT THÚC (SOLD)
            </span>
          ) : auction.status === 'live' ? (
            timeLeft.isUrgent ? (
              <span className="badge-urgent">
                <Flame className="w-3.5 h-3.5" />
                Sắp Kết Thúc!
              </span>
            ) : (
              <span className="badge-live">
                <span className="pulse-dot"></span>
                LIVE
              </span>
            )
          ) : (
            <span className="bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase">
              Sắp Diễn Ra
            </span>
          )}

          {/* Watchlist Icon Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWatchlist(auction.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md border pointer-events-auto transition-all ${
              isWatchlisted
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                : 'bg-black/40 border-white/20 text-gray-300 hover:text-white hover:bg-black/70'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWatchlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Category Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="bg-[#0b0f17]/80 backdrop-blur-md border border-white/10 text-gray-300 text-[11px] font-medium px-2.5 py-1 rounded-lg">
            {auction.categoryName}
          </span>
        </div>
      </div>

      {/* Card Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelectAuction(auction)}
            className="text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-1 cursor-pointer font-heading mb-1.5"
          >
            {auction.title}
          </h3>

          {/* Top Bidder or Seller info */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              {auction.seller.name}
            </span>
            <span>{auction.totalBids} lượt trả giá</span>
          </div>
        </div>

        {/* Price & Real-Time Countdown Box */}
        <div className="bg-[#0b0f17]/60 p-3 rounded-xl border border-white/5 space-y-2">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-400 uppercase font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              Giá Hiện Tại
            </span>
            <span className="text-[11px] text-gray-400">
              Khởi điểm: ${auction.startingBid.toLocaleString()}
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div className="text-xl font-extrabold text-amber-400 number-tabular">
              ${auction.currentBid.toLocaleString()}
            </div>
            
            {/* Countdown Badge */}
            <div className={`flex items-center gap-1 font-mono text-xs font-bold px-2 py-1 rounded-md ${
              timeLeft.isEnded
                ? 'bg-gray-500/20 text-gray-400 border border-white/10'
                : timeLeft.isUrgent
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-white/5 text-gray-200 border border-white/10'
            }`}>
              <Clock className="w-3 h-3 text-amber-400" />
              <span className="number-tabular">
                {timeLeft.isEnded
                  ? '00:00:00'
                  : `${String(timeLeft.hours).padStart(2, '0')}:${String(timeLeft.minutes).padStart(2, '0')}:${String(timeLeft.seconds).padStart(2, '0')}`}
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Quick Bid Action */}
        <div className="pt-1 flex items-center gap-2">
          <button
            onClick={() => onSelectAuction(auction)}
            className="btn-secondary flex-1 text-xs py-2 px-3"
          >
            Xem Chi Tiết
          </button>

          <button
            onClick={() => !timeLeft.isEnded && onQuickBid(auction.id, auction.currentBid + auction.bidIncrement)}
            disabled={timeLeft.isEnded}
            className={`btn-primary text-xs py-2 px-3 flex items-center gap-1.5 ${
              timeLeft.isEnded ? 'opacity-50 cursor-not-allowed filter grayscale' : ''
            }`}
            title={timeLeft.isEnded ? 'Phiên đấu giá đã kết thúc' : `Đặt thêm $${auction.bidIncrement.toLocaleString()}`}
          >
            <Zap className="w-3.5 h-3.5 fill-slate-950" />
            {timeLeft.isEnded ? 'Hết Giờ' : `+$${auction.bidIncrement >= 1000 ? `${auction.bidIncrement / 1000}k` : auction.bidIncrement}`}
          </button>
        </div>

      </div>

    </div>
  );
}
