import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Flame, Sparkles, Gavel, Volume2, VolumeX, Users, Trophy, Clock, Check, Zap, AlertCircle, Heart, MessageSquare, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

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
  const [selectedPreset, setSelectedPreset] = useState(auction.currentBid + auction.bidIncrement);
  const [customBid, setCustomBid] = useState(auction.currentBid + auction.bidIncrement);
  const [reactions, setReactions] = useState([]);
  const [auctioneerPhrase, setAuctioneerPhrase] = useState("Kính chào quý nhà sưu tầm! Phiên đấu giá siêu thực chính thức diễn ra.");

  const isAdmin = user && user.role === 'System Admin';
  const pendingRequestsForThisAuction = bidRequests.filter(
    r => r.auctionId === auction.id && r.status === 'pending'
  );

  // VIP Audience Seating simulation
  const audienceList = users.slice(0, 6);

  // Floating Emoji Reaction Handler
  const handleSendReaction = (emoji) => {
    const newReaction = {
      id: Date.now() + Math.random(),
      emoji,
      left: Math.random() * 80 + 10 // 10% to 90%
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  // Auctioneer Dynamic Speech Updates
  useEffect(() => {
    if (auction.bids && auction.bids.length > 0) {
      const topBid = auction.bids[0];
      setAuctioneerPhrase(`Đã ghi nhận mức giá $${topBid.amount.toLocaleString()} từ ${topBid.bidder}! Ai sẽ ra giá cao hơn?`);
    }
  }, [auction.bids]);

  const handleUserRequestSubmit = (amount) => {
    if (amount <= auction.currentBid) {
      addToast('Mức Giá Không Hợp Lệ', `Giá đề xuất phải cao hơn $${auction.currentBid.toLocaleString()}`, 'warning');
      return;
    }
    onPlaceBid(auction.id, amount);
    setAuctioneerPhrase(`Quý khách ${user.name} vừa gửi yêu cầu đấu giá $${amount.toLocaleString()} tới Bục Quản Trị!`);
  };

  const handleAdminApproveAndStrikeGavel = (requestId) => {
    onApproveBidRequest(requestId);

    // Gavel Sound Effect Simulation & Confetti Burst on Stage
    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#3B82F6']
    });

    setAuctioneerPhrase(`🔨 ĐÃ GÕ BÚA XÁC NHẬN! Mức giá mới được công nhận trên khán phòng!`);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-6xl w-full relative bg-[#070a10] border border-amber-500/30 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-white/10 bg-[#0b0f17]/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/30 animate-pulse">
              <Gavel className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-white font-heading">
                  Khán Phòng Đấu Giá Trực Tiếp <span className="text-gradient-gold">3D VIP Hall</span>
                </h3>
                <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  ● LIVE BROADCAST
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Trải nghiệm không gian sân khấu đấu giá xa xỉ thời gian thực</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101623] border border-white/10 text-xs text-gray-300">
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Khán phòng: <strong>{audienceList.length + 42} nhà sưu tầm</strong></span>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[520px]">
          
          {/* MAIN 3D SPOTLIGHT STAGE (Col 8) */}
          <div className="lg:col-span-8 relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#0e1420] via-[#080c14] to-[#05070a] overflow-hidden">
            
            {/* Ambient Spotlight Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-10 left-1/4 w-48 h-96 bg-amber-400/10 -rotate-45 blur-2xl pointer-events-none" />
            <div className="absolute top-10 right-1/4 w-48 h-96 bg-cyan-400/10 rotate-45 blur-2xl pointer-events-none" />

            {/* Dynamic Floating Emojis Layer */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
              {reactions.map(r => (
                <div
                  key={r.id}
                  style={{ left: `${r.left}%` }}
                  className="absolute bottom-12 text-3xl animate-bounce transition-all duration-1000 opacity-90"
                >
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Top Stage Auctioneer Podium & Speech */}
            <div className="relative z-10 flex items-center gap-4 bg-[#101623]/80 backdrop-blur-md p-3.5 px-5 rounded-2xl border border-amber-500/30 shadow-xl max-w-xl mx-auto">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
                  alt="Chief Auctioneer"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 p-0.5 rounded-full text-[9px] font-extrabold">
                  🔨
                </span>
              </div>
              <div className="text-left flex-1">
                <span className="text-[10px] text-amber-400 font-extrabold uppercase tracking-widest block">
                  Đấu Giá Viên Trực Tiếp • Mr. Harrison
                </span>
                <p className="text-xs text-white font-medium italic leading-snug">
                  "{auctioneerPhrase}"
                </p>
              </div>
            </div>

            {/* Central Stage Pedestal Product Display */}
            <div className="relative z-10 my-6 flex flex-col items-center justify-center text-center">
              
              {/* Product Spotlight Glass Stand */}
              <div className="relative group cursor-pointer">
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/20 bg-[#101623] relative z-10 transition-transform duration-500 group-hover:scale-105">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="text-xs text-amber-300 font-bold max-w-full truncate">{auction.title}</span>
                  </div>
                </div>

                {/* Pedestal Base Glow */}
                <div className="w-80 h-10 bg-gradient-to-r from-amber-500/40 via-amber-300/60 to-amber-500/40 rounded-full blur-md mx-auto -mt-5 relative z-0" />
              </div>

              {/* Real-time Bid Price Tag on Stage */}
              <div className="mt-4 flex items-center gap-3">
                <div className="bg-black/60 backdrop-blur-md px-6 py-2 rounded-2xl border border-amber-500/50 shadow-2xl text-center">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Mức Giá Hiện Tại Khán Phòng</span>
                  <span className="text-3xl font-black text-amber-400 font-heading number-tabular">
                    ${auction.currentBid.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

            {/* VIP Audience Seating Row (Người Trên Sân) */}
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-2">
                <span>HÀNG GHẾ VIP THAM GIA TRỰC TIẾP TRÊN SÂN:</span>
                <span className="text-amber-400">Tương tác thả cảm xúc 👇</span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-[#0b0f17]/90 p-3 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto">
                <div className="flex items-center gap-3">
                  {audienceList.map((aud, idx) => (
                    <div key={aud.id || idx} className="flex flex-col items-center gap-1 group cursor-pointer">
                      <div className="relative">
                        <img
                          src={aud.avatar}
                          alt={aud.name}
                          className="w-10 h-10 rounded-xl object-cover ring-2 ring-amber-400/40 group-hover:scale-110 transition-transform"
                        />
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 absolute -bottom-0.5 -right-0.5 border-2 border-[#0b0f17]" />
                      </div>
                      <span className="text-[10px] text-gray-300 font-bold max-w-[60px] truncate">{aud.name}</span>
                    </div>
                  ))}
                </div>

                {/* Reaction Quick Buttons */}
                <div className="flex items-center gap-1.5 border-l border-white/10 pl-3">
                  {['👏', '🔥', '💎', '🚀'].map((emoji, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendReaction(emoji)}
                      className="w-9 h-9 rounded-xl bg-[#151d2a] hover:bg-[#202b3c] border border-white/10 text-base flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE PANEL: LIVE STREAM BIDS & CONTROLS (Col 4) */}
          <div className="lg:col-span-4 bg-[#0b0f17] border-l border-white/10 p-5 flex flex-col justify-between space-y-4">
            
            {/* Top Live Bids Log Stream */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[300px]">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h4 className="text-xs font-bold text-white font-heading uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" /> Luồng Giá Công Khai
                </h4>
                <span className="badge-live text-[9px]">LIVE STAGE</span>
              </div>

              <div className="space-y-2">
                {auction.bids?.map((bid, i) => (
                  <div
                    key={bid.id || i}
                    className={`p-2.5 rounded-xl text-xs flex items-center justify-between border ${
                      i === 0
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
                        : 'bg-[#101623] border-white/5 text-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={bid.avatar} alt={bid.bidder} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-white block text-[11px]">{bid.bidder}</span>
                        <span className="text-[9px] text-gray-400 block">{bid.time}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-amber-400 number-tabular text-sm">
                      ${bid.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CONTROLS SECTION */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              
              {/* ADMIN CONTROLS: IF USER IS ADMIN */}
              {isAdmin ? (
                <div className="space-y-3 bg-[#101623] p-4 rounded-2xl border border-rose-500/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4" /> Bục Điều Hành Admin
                    </span>
                    <span className="bg-rose-500/20 text-rose-400 text-[10px] font-extrabold px-2 py-0.5 rounded">
                      {pendingRequestsForThisAuction.length} Yêu Cầu Chờ
                    </span>
                  </div>

                  {pendingRequestsForThisAuction.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {pendingRequestsForThisAuction.map(req => (
                        <div key={req.id} className="p-2.5 rounded-xl bg-[#151d2a] border border-white/10 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white">{req.userName}</span>
                            <span className="font-black text-amber-400">${req.proposedAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleAdminApproveAndStrikeGavel(req.id)}
                              className="btn-emerald flex-1 py-1.5 text-[11px] font-bold"
                            >
                              🔨 Duyệt & Gõ Búa
                            </button>
                            <button
                              onClick={() => onRejectBidRequest(req.id)}
                              className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 px-2 py-1.5 rounded-lg text-[11px] font-semibold border border-rose-500/30"
                            >
                              Từ Chối
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-gray-400 italic text-center py-2">
                      Hiện chưa có yêu cầu đấu giá nào từ người dùng chờ duyệt.
                    </p>
                  )}
                </div>
              ) : (
                /* NORMAL USER CONTROLS: SUBMIT PROPOSAL TO ADMIN */
                <div className="space-y-3 bg-[#101623] p-4 rounded-2xl border border-white/10">
                  <label className="text-xs font-bold text-gray-300 block">
                    Gửi Yêu Cầu Trả Giá Trực Tiếp Tới Admin:
                  </label>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      auction.currentBid + auction.bidIncrement,
                      auction.currentBid + auction.bidIncrement * 2
                    ].map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleUserRequestSubmit(val)}
                        className="btn-secondary py-2 text-xs font-bold text-amber-400 hover:border-amber-400"
                      >
                        +${val.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2 text-gray-400 font-bold">$</span>
                    <input
                      type="number"
                      value={customBid}
                      onChange={(e) => setCustomBid(Number(e.target.value))}
                      min={auction.currentBid + auction.bidIncrement}
                      step={auction.bidIncrement}
                      className="w-full bg-[#151d2a] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <button
                    onClick={() => handleUserRequestSubmit(customBid)}
                    className="btn-primary w-full py-2.5 text-xs font-bold shadow-lg shadow-amber-500/20"
                  >
                    Gửi Yêu Cầu Đấu Giá $
                  </button>
                </div>
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
