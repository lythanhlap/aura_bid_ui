import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Flame, Sparkles, Gavel, Volume2, VolumeX, Users, Trophy, Clock, Check, Zap, AlertCircle, TrendingUp, Info, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';
import arenaBg from '../assets/grand_auction_arena_bg.png';

export default function LiveAuctionHallModal({
  auction,
  onClose,
  user,
  users = [],
  bidRequests = [],
  onPlaceBid,
  onApproveBidRequest,
  onRejectBidRequest,
  addToast
}) {
  const [selectedPresetAmount, setSelectedPresetAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [customBidAmount, setCustomBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [activeSideTab, setActiveSideTab] = useState('specs'); // 'specs' | 'bids'
  const [auctioneerPhrase, setAuctioneerPhrase] = useState("Chào mừng quý nhà sưu tầm đến với Đại Khán Phòng Mái Vòm AuraBid Arena!");
  const [isGavelStriking, setIsGavelStriking] = useState(false);

  const isAdmin = user && user.role === 'System Admin';
  const pendingRequestsForThisAuction = bidRequests.filter(
    r => r.auctionId === auction.id && r.status === 'pending'
  );

  // Countdown timer simulation
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

  // Update Auctioneer phrase dynamically on bids update
  useEffect(() => {
    if (auction.bids && auction.bids.length > 0) {
      const topBid = auction.bids[0];
      setAuctioneerPhrase(`Đã xác nhận mức giá công khai $${topBid.amount.toLocaleString()} từ ${topBid.bidder}! Quý vị nào tiếp tục ra giá?`);
    }
  }, [auction.bids]);

  const handleUserSubmitRequest = (amount) => {
    if (amount <= auction.currentBid) {
      addToast('Mức Giá Không Hợp Lệ', `Mức đề xuất phải tối thiểu cao hơn $${auction.currentBid.toLocaleString()}`, 'warning');
      return;
    }
    onPlaceBid(auction.id, amount);
    setAuctioneerPhrase(`Quý khách ${user.name} vừa gửi yêu cầu nâng giá lên $${amount.toLocaleString()}! Đang chuyển Bục Admin phê duyệt...`);
  };

  const handleAdminApproveAndStrikeGavel = (requestId) => {
    onApproveBidRequest(requestId);
    setIsGavelStriking(true);

    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899']
    });

    setAuctioneerPhrase(`🔨 ĐÃ GÕ BÚA CHẤP NHẬN! Mức giá mới chính thức phát hành trên sàn đấu giá!`);
    setTimeout(() => setIsGavelStriking(false), 1200);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-6xl w-full relative bg-[#04060b] border border-amber-500/40 shadow-2xl rounded-3xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* GRAND ARENA 3D BACKDROP & LIGHT BEAM OVERLAY */}
        <div className="relative min-h-[580px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          
          {/* Background Arena Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 mix-blend-luminosity filter contrast-125 pointer-events-none scale-105 transition-transform duration-1000"
            style={{ backgroundImage: `url(${arenaBg})` }}
          />

          {/* Dark Lighting & Radial Spotlight Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#04060b] via-[#04060b]/60 to-[#04060b]/80 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

          {/* VERTICAL LIGHT BEAM SHINING ONTO PEDESTAL */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 sm:w-56 h-full bg-gradient-to-b from-amber-300/30 via-amber-400/15 to-transparent blur-md pointer-events-none z-10" />

          {/* TOP HEADER: ARENA STATUS BAR */}
          <div className="relative z-20 flex items-center justify-between bg-[#0b0f17]/90 backdrop-blur-xl p-3 px-5 rounded-2xl border border-white/10 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30">
                <Gavel className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-black text-white font-heading tracking-wide">
                    ĐẠI KHÁN PHÒNG MÁI VÒM <span className="text-gradient-gold">AURA ARENA 3D</span>
                  </h3>
                  <span className="badge-live text-[9px] py-0.5 px-2 animate-pulse">
                    ● TRỰC TIẾP SPECTATOR POV
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Góc nhìn người tham gia khán phòng • Theo dõi vật phẩm & Đấu giá thời gian thực</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#101623] border border-white/10 text-xs">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Thời gian: <strong className="text-white font-mono">{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</strong></span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CENTER STAGE: VIRTUAL AUCTIONEER AVATAR ON ELEVATED PODIUM & PEDESTAL */}
          <div className="relative z-20 my-4 flex flex-col items-center justify-center text-center space-y-4">
            
            {/* VIRTUAL AUCTIONEER AVATAR ON PODIUM */}
            <div className="relative flex flex-col items-center group">
              
              {/* Animated Speech Bubble */}
              <div className="mb-2 max-w-lg bg-[#101623]/90 backdrop-blur-md border border-amber-500/40 p-3 px-5 rounded-2xl shadow-2xl relative text-xs text-amber-200 font-medium italic animate-fade-in">
                <span className="font-bold text-amber-400 not-italic block text-[10px] uppercase tracking-wider mb-0.5">
                  Virtual Auctioneer • Harrison 3D
                </span>
                "{auctioneerPhrase}"
                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#101623] border-r border-b border-amber-500/40 rotate-45" />
              </div>

              {/* Virtual Character Avatar Avatar */}
              <div className="relative">
                <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400 shadow-2xl shadow-amber-500/30 bg-[#101623] relative z-10 transition-transform ${isGavelStriking ? 'scale-110 ring-4 ring-amber-400' : ''}`}>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
                    alt="Virtual Auctioneer Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Podium Hologram Glow Circle */}
                <div className="w-28 h-6 bg-amber-400/30 rounded-full blur-md mx-auto -mt-3 relative z-0 animate-pulse" />
              </div>

              {/* Elevated Master Podium Stand */}
              <div className="bg-[#0f172a]/90 backdrop-blur-md border border-amber-500/40 px-4 py-1 rounded-xl shadow-lg -mt-2 relative z-20 flex items-center gap-1.5">
                <Gavel className={`w-3.5 h-3.5 text-amber-400 ${isGavelStriking ? 'rotate-45 transition-transform' : ''}`} />
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                  BỤC ĐẤU GIÁ TRUNG TÂM
                </span>
              </div>
            </div>

            {/* CENTRAL CIRCULAR PEDESTAL UNDER VERTICAL BEAM */}
            <div className="relative flex flex-col items-center">
              
              {/* Product Showcase Card on Pedestal */}
              <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 bg-[#101623] relative z-10">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                  <span className="text-xs font-bold text-amber-300 truncate">{auction.title}</span>
                </div>
              </div>

              {/* Circular Pedestal Base */}
              <div className="w-64 h-8 bg-gradient-to-r from-amber-500/40 via-amber-300/60 to-amber-500/40 rounded-full blur-md mx-auto -mt-4 relative z-0" />

              {/* Price Banner Tag */}
              <div className="bg-black/80 backdrop-blur-xl px-6 py-2.5 rounded-2xl border border-amber-500/50 shadow-2xl mt-2 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Giá Cao Nhất Khán Phòng</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading number-tabular">
                  ${auction.currentBid.toLocaleString()}
                </span>
              </div>

            </div>

          </div>

          {/* BOTTOM / SIDE SPECTATOR POV CONTROL & ITEM INSPECTOR PANELS */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ITEM INSPECTOR & SPECS PANEL (Col 6) */}
            <div className="lg:col-span-6 bg-[#0b0f17]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase font-heading">Theo Dõi Thông Tin Vật Phẩm</h4>
                </div>

                <div className="flex items-center gap-1 bg-[#101623] p-1 rounded-lg border border-white/5">
                  <button
                    onClick={() => setActiveSideTab('specs')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${activeSideTab === 'specs' ? 'bg-amber-500 text-slate-950' : 'text-gray-400'}`}
                  >
                    Thông Số
                  </button>
                  <button
                    onClick={() => setActiveSideTab('bids')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${activeSideTab === 'bids' ? 'bg-amber-500 text-slate-950' : 'text-gray-400'}`}
                  >
                    Luồng Giá ({auction.bids?.length || 0})
                  </button>
                </div>
              </div>

              {activeSideTab === 'specs' ? (
                <div className="space-y-2 text-xs">
                  <h5 className="font-bold text-white line-clamp-1">{auction.title}</h5>
                  <p className="text-[11px] text-gray-300 line-clamp-2">{auction.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {auction.specification?.map((spec, idx) => (
                      <div key={idx} className="bg-[#101623] p-2 rounded-lg border border-white/5">
                        <span className="text-[10px] text-gray-400 block">{spec.label}</span>
                        <span className="font-bold text-amber-300 truncate block">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {auction.bids?.map((bid, i) => (
                    <div
                      key={bid.id || i}
                      className={`p-2 rounded-xl text-xs flex items-center justify-between border ${
                        i === 0 ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold' : 'bg-[#101623] border-white/5 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img src={bid.avatar} alt={bid.bidder} className="w-6 h-6 rounded-md object-cover" />
                        <span className="text-[11px]">{bid.bidder}</span>
                      </div>
                      <span className="font-extrabold text-amber-400 number-tabular">${bid.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PARTICIPANT BIDDING CONTROLS (Col 6) */}
            <div className="lg:col-span-6 bg-[#0b0f17]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-3">
              
              {isAdmin ? (
                /* ADMIN CONTROL BAR */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Bục Quản Trị Admin
                    </span>
                    <span className="bg-rose-500/20 text-rose-400 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {pendingRequestsForThisAuction.length} Yêu Cầu Chờ
                    </span>
                  </div>

                  {pendingRequestsForThisAuction.length > 0 ? (
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                      {pendingRequestsForThisAuction.map(req => (
                        <div key={req.id} className="p-2.5 rounded-xl bg-[#101623] border border-white/10 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-white block">{req.userName}</span>
                            <span className="text-[10px] text-amber-400 font-extrabold">${req.proposedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdminApproveAndStrikeGavel(req.id)}
                              className="btn-emerald py-1 px-3 text-xs font-bold shadow flex items-center gap-1"
                            >
                              🔨 Duyệt & Gõ Búa
                            </button>
                            <button
                              onClick={() => onRejectBidRequest(req.id)}
                              className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-2 py-1 rounded text-[11px]"
                            >
                              Từ Chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic text-center py-4">
                      Chưa có yêu cầu đấu giá nào từ người dùng chờ duyệt.
                    </p>
                  )}
                </div>
              ) : (
                /* NORMAL USER PARTICIPANT CONSOLE */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-300 block">
                      Điều Khiển Trả Giá (Gửi Yêu Cầu Cho Admin):
                    </label>
                    <span className="text-[10px] text-amber-400 font-semibold">Bước giá +${auction.bidIncrement.toLocaleString()}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      auction.currentBid + auction.bidIncrement,
                      auction.currentBid + auction.bidIncrement * 2,
                      auction.currentBid + auction.bidIncrement * 5
                    ].map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserSubmitRequest(val)}
                        className="btn-secondary py-2 text-xs font-bold text-amber-300 hover:border-amber-400"
                      >
                        +${val.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                      <input
                        type="number"
                        value={customBidAmount}
                        onChange={(e) => setCustomBidAmount(Number(e.target.value))}
                        min={auction.currentBid + auction.bidIncrement}
                        step={auction.bidIncrement}
                        className="w-full bg-[#101623] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={() => handleUserSubmitRequest(customBidAmount)}
                      className="btn-primary py-2 px-5 text-xs font-bold shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Gửi Yêu Cầu Cho Admin</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
