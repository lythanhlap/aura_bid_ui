import React, { useState, useEffect } from 'react';
import { Flame, Clock, ShieldCheck, ArrowRight, TrendingUp, Zap, Heart } from 'lucide-react';

export default function HeroFeatured({ auction, onSelectAuction, onQuickBid, isWatchlisted, onToggleWatchlist }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!auction) return;

    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, auction.endTime - now);

      const hours = Math.floor(diff / (1000 * 3600));
      const minutes = Math.floor((diff % (1000 * 3600)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [auction]);

  if (!auction) return null;

  const topBid = auction.bids[0];

  return (
    <section className="py-8">
      <div className="glass-panel overflow-hidden relative border-amber-500/20 shadow-2xl shadow-amber-500/5">
        {/* Ambient Top Glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full filter blur-3xl pointer-events-none"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 lg:p-10 items-center">
          
          {/* Left Column: Info & Bidding */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="badge-live">
                <span className="pulse-dot"></span>
                Phiên Nổi Bật LIVE
              </span>
              <span className="bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {auction.totalBids} Lượt Trả Giá
              </span>
              <span className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-full">
                {auction.categoryName}
              </span>
            </div>

            {/* Title & Description */}
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight font-heading mb-3">
                {auction.title}
              </h1>
              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed">
                {auction.description}
              </p>
            </div>

            {/* Price & Timer Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0b0f17]/70 p-4 rounded-2xl border border-white/10">
              
              {/* Current Bid */}
              <div className="space-y-1 border-b sm:border-b-0 sm:border-r border-white/10 pb-3 sm:pb-0 sm:pr-4">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                  Giá Cao Nhất Hiện Tại
                </span>
                <div className="text-2xl lg:text-3xl font-black text-amber-400 number-tabular">
                  ${auction.currentBid.toLocaleString()}
                </div>
                {topBid && (
                  <div className="flex items-center gap-2 text-xs text-gray-400 pt-1">
                    <img src={topBid.avatar} alt={topBid.bidder} className="w-4 h-4 rounded-full object-cover" />
                    <span>Dẫn đầu: <strong className="text-gray-200">{topBid.bidder}</strong></span>
                  </div>
                )}
              </div>

              {/* Countdown Timer */}
              <div className="space-y-1 sm:pl-2">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Thời Gian Còn Lại
                </span>
                <div className="flex items-center gap-2 font-mono text-xl lg:text-2xl font-bold text-white">
                  <span className="bg-[#151d2a] px-2.5 py-1 rounded-lg border border-white/10 number-tabular">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </span>
                  <span className="text-amber-400 font-sans">:</span>
                  <span className="bg-[#151d2a] px-2.5 py-1 rounded-lg border border-white/10 number-tabular">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </span>
                  <span className="text-amber-400 font-sans">:</span>
                  <span className="bg-[#151d2a] px-2.5 py-1 rounded-lg border border-white/10 text-amber-400 number-tabular">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </span>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onQuickBid(auction.id, auction.currentBid + auction.bidIncrement)}
                className="btn-primary flex-1 sm:flex-none text-base py-3 px-6"
              >
                <Zap className="w-5 h-5 fill-slate-950" />
                Đặt Giá Tối Thiểu +${auction.bidIncrement.toLocaleString()}
              </button>

              <button
                onClick={() => onSelectAuction(auction)}
                className="btn-secondary flex-1 sm:flex-none text-base py-3 px-6"
              >
                Chi Tiết Phân Đấu Giá
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onToggleWatchlist(auction.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isWatchlisted
                    ? 'bg-rose-500/20 border-rose-500/50 text-rose-400'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
                title="Lưu vào theo dõi"
              >
                <Heart className={`w-5 h-5 ${isWatchlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
            </div>

          </div>

          {/* Right Column: High-Res Image Preview */}
          <div className="lg:col-span-5 relative group">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 aspect-[4/3] lg:aspect-square">
              <img
                src={auction.image}
                alt={auction.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-transparent opacity-80"></div>
              
              {/* Seller Verification Floating Tag */}
              <div className="absolute bottom-4 left-4 right-4 bg-[#151d2a]/90 backdrop-blur-md p-3 rounded-xl border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{auction.seller.name}</h4>
                    <p className="text-[10px] text-gray-400">Verified Partner • ★ {auction.seller.rating}</p>
                  </div>
                </div>
                <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-md">
                  Chính Hãng
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
