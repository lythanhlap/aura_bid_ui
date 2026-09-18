import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Flame, Sparkles, Gavel, Volume2, VolumeX, Users, Trophy, Clock, Check, Zap, AlertCircle, TrendingUp, Info, MessageSquare, Smile, Frown, Sparkle, Activity } from 'lucide-react';
import confetti from 'canvas-confetti';
import arenaBg from '../assets/grand_auction_arena_bg.png';

export default function LiveAuctionHallModal({
  auction,
  onClose,
  user,
  users = [],
  bidRequests = [],
  onPlaceBid,
  onDirectLiveRoomBid,
  onApproveBidRequest,
  onRejectBidRequest,
  addToast
}) {
  const [selectedPresetAmount, setSelectedPresetAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [customBidAmount, setCustomBidAmount] = useState(auction.currentBid + auction.bidIncrement);
  const [activeSideTab, setActiveSideTab] = useState('specs'); // 'specs' | 'bids'
  
  // Virtual AI Auctioneer Sensory & Emotion State
  const [auctioneerEmotion, setAuctioneerEmotion] = useState('welcoming'); // 'welcoming' | 'surprised' | 'excited' | 'tenseness' | 'decisive'
  const [auctioneerSpeech, setAuctioneerSpeech] = useState("Kính chào quý nhà sưu tầm! Tôi là Harrison - Đấu giá viên ảo 3D trực tiếp điều hành phiên đấu giá này.");
  const [isGavelStriking, setIsGavelStriking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  const isAdmin = user && user.role === 'System Admin';
  const pendingRequestsForThisAuction = bidRequests.filter(
    r => r.auctionId === auction.id && r.status === 'pending'
  );

  // Countdown timer simulation
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auction.endTime));

  useEffect(() => {
    const timer = setInterval(() => {
      const remaining = calculateTimeLeft(auction.endTime);
      setTimeLeft(remaining);

      // Sensory perception: Auctioneer tense state when time < 30 seconds
      if (remaining.seconds <= 30 && remaining.hours === 0 && remaining.minutes === 0 && !remaining.isEnded) {
        if (auctioneerEmotion !== 'tenseness' && auctioneerEmotion !== 'decisive') {
          setAuctioneerEmotion('tenseness');
          setAuctioneerSpeech("⏱️ THỜI GIAN SẮP CẠN! Bán lần 1... Bán lần 2... Quý vị nào giơ bảng trả giá tiếp theo?");
          setIsSpeaking(true);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [auction.endTime, auctioneerEmotion]);

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

  // Sensory Perception: Auctioneer reacts when public bids update
  useEffect(() => {
    if (auction.bids && auction.bids.length > 0) {
      const topBid = auction.bids[0];
      const isBigBid = topBid.amount > auction.startingBid * 1.5;

      if (isBigBid) {
        setAuctioneerEmotion('surprised');
        setAuctioneerSpeech(`😮 THẬT BẤT NGỜ! Mức giá ấn tượng $${topBid.amount.toLocaleString()} vừa xuất hiện từ ${topBid.bidder}!`);
      } else {
        setAuctioneerEmotion('excited');
        setAuctioneerSpeech(`🔥 Hào hứng quá! Đã ghi nhận mức giá $${topBid.amount.toLocaleString()} từ ${topBid.bidder}! Quý vị nào nâng giá tiếp?`);
      }
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4000);
    }
  }, [auction.bids, auction.startingBid]);

  // Emotion configuration map
  const emotionConfig = {
    welcoming: {
      label: "😊 THÂN THIỆN CHÀO MỪNG",
      ringColor: "ring-cyan-400 shadow-cyan-500/50 border-cyan-400",
      textColor: "text-cyan-300",
      bgBadge: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
    },
    surprised: {
      label: "😮 NGẠC NHIÊN ĐỘT BIẾN",
      ringColor: "ring-purple-400 shadow-purple-500/60 border-purple-400",
      textColor: "text-purple-300",
      bgBadge: "bg-purple-500/20 text-purple-300 border-purple-500/40"
    },
    excited: {
      label: "🔥 HÀO HỨNG SÔI NỔI",
      ringColor: "ring-amber-400 shadow-amber-500/60 border-amber-400",
      textColor: "text-amber-300",
      bgBadge: "bg-amber-500/20 text-amber-300 border-amber-500/40"
    },
    tenseness: {
      label: "⏳ DỒN DẬP ĐẾM NGƯỢC",
      ringColor: "ring-rose-500 shadow-rose-500/70 border-rose-500",
      textColor: "text-rose-300",
      bgBadge: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    },
    decisive: {
      label: "🔨 QUYẾT ĐOÁN GÕ BÚA",
      ringColor: "ring-emerald-400 shadow-emerald-500/70 border-emerald-400",
      textColor: "text-emerald-300",
      bgBadge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    }
  };

  const currentEmotionStyle = emotionConfig[auctioneerEmotion] || emotionConfig.welcoming;

  // Interactive Question Prompts for Virtual Auctioneer Q&A
  const handleAskAuctioneer = (questionType) => {
    setIsChatMenuOpen(false);
    setIsSpeaking(true);

    if (questionType === 'appraise') {
      setAuctioneerEmotion('excited');
      setAuctioneerSpeech(`💎 Kiệt tác ${auction.title} đạt chuẩn bảo chứng 100%! Đây là tài sản tích lũy di sản rất quý hiếm.`);
    } else if (questionType === 'prediction') {
      setAuctioneerEmotion('surprised');
      const targetEstimate = Math.round(auction.currentBid * 1.25);
      setAuctioneerSpeech(`📊 Theo dữ liệu sàn AuraBid, tôi dự đoán phiên này có thể cán mốc $${targetEstimate.toLocaleString()}!`);
    } else if (questionType === 'deposit') {
      setAuctioneerEmotion('welcoming');
      setAuctioneerSpeech(`🛡️ Quý vị đặt giá trực tiếp trong phòng này sẽ cập nhật ngay lập tức lên sàn thời gian thực!`);
    }

    setTimeout(() => setIsSpeaking(false), 5000);
  };

  // Direct Real-Time Live Room Bidding (Nâng giá trực tiếp công khai tức thì trong phòng 3D)
  const handleDirectLiveRoomBidSubmit = (amount) => {
    if (amount <= auction.currentBid) {
      addToast('Mức Giá Không Hợp Lệ', `Mức trả giá trực tiếp phải tối thiểu cao hơn $${auction.currentBid.toLocaleString()}`, 'warning');
      return;
    }

    if (onDirectLiveRoomBid) {
      onDirectLiveRoomBid(auction.id, amount);
    } else {
      onPlaceBid(auction.id, amount);
    }

    setAuctioneerEmotion('excited');
    setIsSpeaking(true);
    setAuctioneerSpeech(`🎉 XIN CHÚC MỪNG! Quý khách ${user?.name || 'Vô danh'} vừa đặt giá trực tiếp $${amount.toLocaleString()} thành công!`);

    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#6366F1']
    });

    setTimeout(() => setIsSpeaking(false), 4000);
  };

  const handleAdminApproveAndStrikeGavel = (requestId) => {
    onApproveBidRequest(requestId);
    setAuctioneerEmotion('decisive');
    setIsGavelStriking(true);
    setIsSpeaking(true);

    confetti({
      particleCount: 90,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899']
    });

    setAuctioneerSpeech(`🔨 BÁN! ĐÃ GÕ BÚA CHẤP NHẬN! Lượt đặt giá mới chính thức phát hành trên sàn!`);
    setTimeout(() => {
      setIsGavelStriking(false);
      setIsSpeaking(false);
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-6xl w-full relative bg-[#04060b] border border-amber-500/40 shadow-2xl rounded-3xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* GRAND ARENA 3D BACKDROP & LIGHT BEAM OVERLAY */}
        <div className="relative min-h-[590px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          
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
                  <span className="badge-live text-[9px] py-0.5 px-2 animate-pulse flex items-center gap-1">
                    <Activity className="w-3 h-3 text-emerald-400" />
                    DIRECT LIVE BIDDING
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Góc nhìn SPECTATOR POV • Nhân Viên Đấu Giá AI Chuyển Động 3D Sinh Động</p>
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

          {/* CENTER STAGE: ANIMATED VIRTUAL AI AUCTIONEER CHARACTER WITH MOTION & EMOTIONS */}
          <div className="relative z-20 my-3 flex flex-col items-center justify-center text-center space-y-3">
            
            {/* VIRTUAL CHARACTER SPEECH BUBBLE & EMOTION STATUS */}
            <div className="relative flex flex-col items-center group max-w-lg">
              
              {/* Dynamic Emotional Expression Badge */}
              <div className="mb-1.5">
                <span className={`text-[10px] font-extrabold px-3 py-1 rounded-full border shadow-lg ${currentEmotionStyle.bgBadge}`}>
                  {currentEmotionStyle.label}
                </span>
              </div>

              {/* Speech Bubble */}
              <div className="bg-[#101623]/95 backdrop-blur-md border border-amber-500/40 p-3 px-5 rounded-2xl shadow-2xl relative text-xs text-amber-200 font-medium italic leading-relaxed animate-fade-in">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1.5">
                  <span className="font-bold text-amber-400 not-italic text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Animated Virtual AI Auctioneer • Harrison 3D
                  </span>

                  {/* Interactive Q&A Dropdown Toggle Button */}
                  <button
                    onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                    className="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 px-2 py-0.5 rounded border border-cyan-500/40 flex items-center gap-1 transition-all"
                  >
                    <MessageSquare className="w-3 h-3" />
                    💬 Hỏi Đấu Giá Viên
                  </button>
                </div>

                "{auctioneerSpeech}"

                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#101623] border-r border-b border-amber-500/40 rotate-45" />
              </div>

              {/* Interactive Q&A Menu */}
              {isChatMenuOpen && (
                <div className="absolute top-full mt-2 z-50 bg-[#0b0f17] border border-cyan-500/40 rounded-2xl p-2 shadow-2xl space-y-1.5 w-64 text-left">
                  <p className="text-[10px] text-gray-400 font-bold px-2">Chọn câu hỏi tương tác với Đấu giá viên 3D:</p>
                  <button
                    onClick={() => handleAskAuctioneer('appraise')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors"
                  >
                    💎 Đánh giá chất lượng sản phẩm này thế nào?
                  </button>
                  <button
                    onClick={() => handleAskAuctioneer('prediction')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors"
                  >
                    📊 Dự đoán mức giá chốt phiên cuối cùng?
                  </button>
                  <button
                    onClick={() => handleAskAuctioneer('deposit')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors"
                  >
                    🛡️ Cơ chế đặt giá trực tiếp trong phòng 3D?
                  </button>
                </div>
              )}

              {/* 3D ANIMATED VIRTUAL CHARACTER RIG (Body Sway, Speaking Waves, Hologram Laser Scan) */}
              <div className="relative mt-3 cursor-pointer group" onClick={() => handleAskAuctioneer('appraise')}>
                
                {/* 3D Swaying Avatar Container */}
                <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 shadow-2xl bg-[#101623] relative z-10 transition-all duration-500 animate-avatar-sway animate-hologram-scan ${currentEmotionStyle.ringColor} ${isSpeaking ? 'animate-speaking-pulse' : ''}`}>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250"
                    alt="Animated Virtual Character Avatar"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                  />
                  {/* Hologram Laser Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-transparent to-amber-400/20 pointer-events-none" />
                </div>

                {/* Animated Speaking Wave Ring Indicator */}
                {isSpeaking && (
                  <div className="absolute inset-0 rounded-full border-2 border-amber-400/60 animate-ping pointer-events-none" />
                )}

                {/* Podium Hologram Glow Circle */}
                <div className="w-32 h-7 bg-gradient-to-r from-cyan-400/40 via-amber-400/50 to-cyan-400/40 rounded-full blur-md mx-auto -mt-3 relative z-0 animate-pulse" />
              </div>

              {/* Elevated Master Podium Stand */}
              <div className="bg-[#0f172a]/90 backdrop-blur-md border border-amber-500/40 px-4 py-1 rounded-xl shadow-lg -mt-2 relative z-20 flex items-center gap-1.5">
                <Gavel className={`w-4 h-4 text-amber-400 ${isGavelStriking ? 'animate-gavel-strike text-emerald-400' : ''}`} />
                <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-widest">
                  BỤC ĐẤU GIÁ TRUNG TÂM
                </span>
              </div>
            </div>

            {/* CENTRAL CIRCULAR PEDESTAL UNDER VERTICAL BEAM */}
            <div className="relative flex flex-col items-center">
              
              {/* Product Showcase Card on Pedestal */}
              <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 bg-[#101623] relative z-10">
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
              <div className="w-60 h-7 bg-gradient-to-r from-amber-500/40 via-amber-300/60 to-amber-500/40 rounded-full blur-md mx-auto -mt-4 relative z-0" />

              {/* Price Banner Tag */}
              <div className="bg-black/80 backdrop-blur-xl px-6 py-2 rounded-2xl border border-amber-500/50 shadow-2xl mt-1.5 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Giá Trực Tiếp Khán Phòng</span>
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

            {/* PARTICIPANT DIRECT LIVE BIDDING CONSOLE (Col 6) */}
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
                /* NORMAL USER DIRECT LIVE BIDDING CONSOLE IN 3D ROOM */
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-white block flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      Đặt Giá Trực Tiếp Sàn Khán Phòng 3D:
                    </label>
                    <span className="text-[10px] text-emerald-400 font-semibold">Cập nhật công khai ngay</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      auction.currentBid + auction.bidIncrement,
                      auction.currentBid + auction.bidIncrement * 2,
                      auction.currentBid + auction.bidIncrement * 5
                    ].map((val, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleDirectLiveRoomBidSubmit(val)}
                        className="btn-secondary py-2 text-xs font-bold text-amber-300 hover:border-amber-400 hover:bg-amber-500/10"
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
                        className="w-full bg-[#101623] border border-amber-500/30 rounded-xl pl-7 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <button
                      onClick={() => handleDirectLiveRoomBidSubmit(customBidAmount)}
                      className="btn-primary py-2 px-5 text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-slate-950" />
                      <span>⚡ Đặt Giá Trực Tiếp $</span>
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
