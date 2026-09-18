import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldCheck, Flame, Sparkles, Gavel, Volume2, VolumeX, Users, Trophy, Clock, Check, Zap, AlertCircle, TrendingUp, Info, MessageSquare, RotateCw, Eye, Wand2, Video, Camera } from 'lucide-react';
import confetti from 'canvas-confetti';
import arenaBg from '../assets/grand_auction_arena_bg.png';
import virtualCharacterImg from '../assets/virtual_auctioneer_character.png';

// 3D Canvas Floor Particle Light Beam Component
function VirtualStageCanvas({ emotion, isSpeaking }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = 340);
    let height = (canvas.height = 140);

    const particles = Array.from({ length: 40 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 0.8,
      speedY: Math.random() * 0.9 + 0.3,
      opacity: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.4 ? '#F59E0B' : '#06B6D4'
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw futuristic hologram light cone
      const grad = ctx.createLinearGradient(0, height, 0, 0);
      grad.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
      grad.addColorStop(0.5, 'rgba(6, 182, 212, 0.18)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(40, height);
      ctx.lineTo(width - 40, height);
      ctx.lineTo(width / 2 + 50, 0);
      ctx.lineTo(width / 2 - 50, 0);
      ctx.closePath();
      ctx.fill();

      // Render floating golden/cyan particles
      particles.forEach((p) => {
        p.y -= isSpeaking ? p.speedY * 1.8 : p.speedY;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpeaking, emotion]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-85 z-0"
    />
  );
}

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
  
  // Virtual 3D Character Voice, Gestures, Posture & Camera State
  const [auctioneerEmotion, setAuctioneerEmotion] = useState('welcoming'); // 'welcoming' | 'surprised' | 'excited' | 'tenseness' | 'decisive'
  const [auctioneerSpeech, setAuctioneerSpeech] = useState("Kính chào quý vị! Tôi là Nữ Đấu Giá Viên Ảo 3D Aura. Rất vinh hạnh được đồng hành cùng quý nhà sưu tầm.");
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true);
  const [isPointingToItem, setIsPointingToItem] = useState(false);
  const [isInspectingItem, setIsInspectingItem] = useState(false);
  const [isGavelStriking, setIsGavelStriking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [isChatMenuOpen, setIsChatMenuOpen] = useState(false);

  // 3D Perspective Camera Controls & Character Posture Mode
  const [cameraAngle, setCameraAngle] = useState('front'); // 'front' | 'left3d' | 'right3d' | 'closeUp'
  const [characterPosture, setCharacterPosture] = useState('dignified'); // 'dignified' | 'excited'

  const isAdmin = user && user.role === 'System Admin';
  const pendingRequestsForThisAuction = bidRequests.filter(
    r => r.auctionId === auction.id && r.status === 'pending'
  );

  // Web Speech API Voice Synthesis in Vietnamese
  const speakText = (text) => {
    if (!isSpeechEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 1.05;
      utterance.pitch = 1.15; // Elegant feminine voice pitch
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech API error", e);
    }
  };

  // Trigger initial welcoming speech
  useEffect(() => {
    const welcomeMsg = `Kính chào quý vị! Tôi là Nữ Đấu Giá Viên Ảo 3D Aura. Rất vinh hạnh được đồng hành cùng quý nhà sưu tầm trong phiên ${auction.title.substring(0, 30)}.`;
    setAuctioneerSpeech(welcomeMsg);
    speakText(welcomeMsg);
  }, []);

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
          setCharacterPosture('excited');
          const msg = "Thời gian sắp cạn! Bán lần 1... Bán lần 2... Quý vị nào giơ bảng trả giá tiếp theo?";
          setAuctioneerSpeech(`⏱️ ${msg}`);
          speakText(msg);
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

      setIsPointingToItem(true);
      setCharacterPosture('excited');
      setTimeout(() => setIsPointingToItem(false), 3000);

      if (isBigBid) {
        setAuctioneerEmotion('surprised');
        const msg = `Thật ấn tượng! Mức giá $${topBid.amount.toLocaleString()} vừa xuất hiện từ ${topBid.bidder}!`;
        setAuctioneerSpeech(`😮 ${msg}`);
        speakText(msg);
      } else {
        setAuctioneerEmotion('excited');
        const msg = `Đã ghi nhận mức giá $${topBid.amount.toLocaleString()} từ ${topBid.bidder}! Quý vị nào nâng giá tiếp?`;
        setAuctioneerSpeech(`🔥 ${msg}`);
        speakText(msg);
      }
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 4500);
    }
  }, [auction.bids, auction.startingBid]);

  // Emotion configuration map
  const emotionConfig = {
    welcoming: {
      label: "✨ NỮ ĐẤU GIÁ VIÊN ẢO AURA 3D",
      ringColor: "ring-cyan-300 shadow-cyan-400/60 border-cyan-300",
      textColor: "text-cyan-300",
      bgBadge: "bg-cyan-500/20 text-cyan-300 border-cyan-400/40"
    },
    surprised: {
      label: "😮 BƯỚC GIÁ ĐỘT BIẾN",
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

  // 3D Perspective Camera Angle Transform Helper
  const get3DCameraTransform = (angle) => {
    switch (angle) {
      case 'left3d':
        return 'rotateY(20deg) rotateX(4deg) scale(0.98)';
      case 'right3d':
        return 'rotateY(-20deg) rotateX(4deg) scale(0.98)';
      case 'closeUp':
        return 'scale(1.18) translateY(10px)';
      case 'front':
      default:
        return 'rotateY(0deg) rotateX(0deg) scale(1)';
    }
  };

  // Interactive Gesture Trigger Functions
  const handleTriggerGreeting = () => {
    setAuctioneerEmotion('welcoming');
    setCharacterPosture('dignified');
    setIsSpeaking(true);
    const msg = "Kính chào toàn thể nhà sưu tầm quý phái! Aura 3D rất sẵn sàng cho các bước giá bùng nổ tiếp theo!";
    setAuctioneerSpeech(`🙋‍♀️ ${msg}`);
    speakText(msg);
    setTimeout(() => setIsSpeaking(false), 4500);
  };

  const handleTriggerPointLaser = () => {
    setIsPointingToItem(true);
    setAuctioneerEmotion('excited');
    setIsSpeaking(true);
    const msg = "Hãy chú ý vào tuyệt tác đang trưng bày trên bục Hologram 3D!";
    setAuctioneerSpeech(`👉 ${msg}`);
    speakText(msg);
    setTimeout(() => {
      setIsPointingToItem(false);
      setIsSpeaking(false);
    }, 4000);
  };

  const handleTriggerGavelStrike = () => {
    setAuctioneerEmotion('decisive');
    setIsGavelStriking(true);
    setIsSpeaking(true);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F59E0B', '#10B981', '#06B6D4']
    });
    const msg = "Lần 1... Lần 2... Lần 3... ĐÃ BÁN! Tiếng búa nảy vang chốt nhịp phiên đấu giá!";
    setAuctioneerSpeech(`🔨 ${msg}`);
    speakText(msg);
    setTimeout(() => {
      setIsGavelStriking(false);
      setIsSpeaking(false);
    }, 3500);
  };

  // Interactive Question Prompts & Item Inspection
  const handleAskAuctioneer = (questionType) => {
    setIsChatMenuOpen(false);
    setIsSpeaking(true);

    if (questionType === 'appraise') {
      setAuctioneerEmotion('excited');
      setIsPointingToItem(true);
      const msg = `Kiệt tác ${auction.title} đạt chuẩn bảo chứng 100%! Đây là tài sản di sản có giá trị tích lũy rất lớn.`;
      setAuctioneerSpeech(`💎 ${msg}`);
      speakText(msg);
      setTimeout(() => setIsPointingToItem(false), 3500);
    } else if (questionType === 'prediction') {
      setAuctioneerEmotion('surprised');
      const targetEstimate = Math.round(auction.currentBid * 1.25);
      const msg = `Theo dữ liệu phân tích, tôi dự đoán phiên đấu giá này có thể cán mốc $${targetEstimate.toLocaleString()}!`;
      setAuctioneerSpeech(`📊 ${msg}`);
      speakText(msg);
    } else if (questionType === 'inspect') {
      setAuctioneerEmotion('excited');
      setIsInspectingItem(true);
      setIsPointingToItem(true);
      const msg = `Đang kích hoạt phép chiếu xoay 3D để giám định thông số vật phẩm!`;
      setAuctioneerSpeech(`🔍 ${msg}`);
      speakText(msg);
      setTimeout(() => {
        setIsInspectingItem(false);
        setIsPointingToItem(false);
      }, 5000);
    }

    setTimeout(() => setIsSpeaking(false), 5000);
  };

  // Direct Real-Time Live Room Bidding (Nâng giá trực tiếp công khai tức thì)
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
    setCharacterPosture('excited');
    setIsSpeaking(true);
    setIsPointingToItem(true);
    const msg = `Xin chúc mừng quý khách ${user?.name || 'Vô danh'} vừa ra giá trực tiếp $${amount.toLocaleString()} thành công!`;
    setAuctioneerSpeech(`🎉 ${msg}`);
    speakText(msg);

    confetti({
      particleCount: 70,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#10B981', '#6366F1']
    });

    setTimeout(() => {
      setIsSpeaking(false);
      setIsPointingToItem(false);
    }, 4500);
  };

  const handleAdminApproveAndStrikeGavel = (requestId) => {
    onApproveBidRequest(requestId);
    setAuctioneerEmotion('decisive');
    setIsGavelStriking(true);
    setIsSpeaking(true);
    setIsPointingToItem(true);

    confetti({
      particleCount: 100,
      spread: 110,
      origin: { y: 0.5 },
      colors: ['#10B981', '#F59E0B', '#3B82F6', '#EC4899']
    });

    const msg = "Bán! Đã gõ búa chấp nhận! Lượt đặt giá mới chính thức có hiệu lực trên toàn sàn!";
    setAuctioneerSpeech(`🔨 ${msg}`);
    speakText(msg);

    setTimeout(() => {
      setIsGavelStriking(false);
      setIsSpeaking(false);
      setIsPointingToItem(false);
    }, 3000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content max-w-6xl w-full relative bg-[#04060b] border border-amber-500/40 shadow-2xl rounded-3xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* GRAND ARENA 3D BACKDROP & LIGHT BEAM OVERLAY */}
        <div className="relative min-h-[640px] flex flex-col justify-between p-4 sm:p-6 overflow-hidden">
          
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

          {/* POINTER LIGHT BEAM (Connecting Virtual Auctioneer to Item Pedestal when pointing) */}
          {isPointingToItem && (
            <div className="absolute top-64 left-1/2 -translate-x-1/2 w-2.5 h-48 pointer-beam-glow rounded-full z-30 pointer-events-none" />
          )}

          {/* TOP HEADER: ARENA STATUS BAR & VOICE TOGGLE */}
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
                    ● FULL 3D AVATAR RIG
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">Nữ Đấu Giá Viên Ảo 3D Toàn Thân • Phát Âm Tiếng Nói & Cử Chỉ Tương Tác Trực Tiếp</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Audio Voice Speech Toggle */}
              <button
                onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                  isSpeechEnabled
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-gray-800 text-gray-400 border-white/10'
                }`}
                title="Bật/tắt giọng nói tiếng Việt của Đấu giá viên"
              >
                {isSpeechEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
                <span>{isSpeechEnabled ? 'Giọng Nói: BẬT' : 'Giọng Nói: TẮT'}</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-gray-400 hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* CENTER STAGE: FULL STANDING 3D VIRTUAL FEMALE CHARACTER HOSTESS RIG */}
          <div className="relative z-20 my-2 flex flex-col items-center justify-center text-center space-y-2">
            
            {/* SPEECH BUBBLE & EMOTION BADGE */}
            <div className="relative flex flex-col items-center group max-w-xl z-30">
              
              {/* Dynamic Emotional Expression Badge */}
              <div className="mb-1">
                <span className={`text-[10px] font-extrabold px-3 py-0.5 rounded-full border shadow-lg ${currentEmotionStyle.bgBadge}`}>
                  {currentEmotionStyle.label}
                </span>
              </div>

              {/* Speech Bubble */}
              <div className="bg-[#101623]/95 backdrop-blur-md border border-amber-500/40 p-3 px-5 rounded-2xl shadow-2xl relative text-xs text-amber-200 font-medium italic leading-relaxed animate-fade-in">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1 mb-1.5">
                  <span className="font-bold text-amber-400 not-italic text-[10px] uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    3D Virtual Auctioneer Character • Aura Hostess
                  </span>

                  {/* Interactive Q&A Dropdown Toggle Button */}
                  <button
                    onClick={() => setIsChatMenuOpen(!isChatMenuOpen)}
                    className="text-[10px] font-bold text-cyan-300 hover:text-white bg-cyan-500/20 hover:bg-cyan-500/30 px-2 py-0.5 rounded border border-cyan-500/40 flex items-center gap-1 transition-all"
                  >
                    <MessageSquare className="w-3 h-3" />
                    💬 Trò Chuyện & Hỏi Đáp
                  </button>
                </div>

                "{auctioneerSpeech}"

                <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-[#101623] border-r border-b border-amber-500/40 rotate-45" />
              </div>

              {/* Interactive Q&A Menu */}
              {isChatMenuOpen && (
                <div className="absolute top-full mt-2 z-50 bg-[#0b0f17] border border-cyan-500/40 rounded-2xl p-2 shadow-2xl space-y-1.5 w-72 text-left">
                  <p className="text-[10px] text-gray-400 font-bold px-2">Chọn tương tác cùng Nữ Đấu Giá Viên Ảo 3D:</p>
                  <button
                    onClick={() => handleAskAuctioneer('appraise')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors flex items-center gap-1.5"
                  >
                    💎 <span>Đánh giá chất lượng kiệt tác này?</span>
                  </button>
                  <button
                    onClick={() => handleAskAuctioneer('prediction')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors flex items-center gap-1.5"
                  >
                    📊 <span>Dự đoán mức giá chốt phiên cuối cùng?</span>
                  </button>
                  <button
                    onClick={() => handleAskAuctioneer('inspect')}
                    className="w-full text-[11px] text-gray-200 hover:text-amber-300 hover:bg-white/10 p-2 rounded-xl text-left font-medium transition-colors flex items-center gap-1.5"
                  >
                    🔍 <span>Yêu cầu xoay bệ 3D giám định chi tiết</span>
                  </button>
                </div>
              )}
            </div>

            {/* INTERACTIVE 3D CAMERA & GESTURE CONTROL TOOLBAR */}
            <div className="relative z-30 flex flex-wrap items-center justify-center gap-2 py-1">
              
              {/* 3D Perspective Camera Angle Selector */}
              <div className="flex items-center gap-1 bg-[#101623]/90 border border-amber-500/30 p-1 px-2 rounded-xl shadow-lg">
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                  <Camera className="w-3 h-3 text-amber-400" />
                  Góc 3D:
                </span>
                <button
                  onClick={() => setCameraAngle('front')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${cameraAngle === 'front' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  0° Chính Diện
                </button>
                <button
                  onClick={() => setCameraAngle('left3d')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${cameraAngle === 'left3d' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Nghiêng Trái 3D
                </button>
                <button
                  onClick={() => setCameraAngle('right3d')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${cameraAngle === 'right3d' ? 'bg-amber-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  Nghiêng Phải 3D
                </button>
                <button
                  onClick={() => setCameraAngle('closeUp')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${cameraAngle === 'closeUp' ? 'bg-cyan-500 text-slate-950 shadow' : 'text-gray-400 hover:text-white'}`}
                >
                  🔍 Cận Cảnh
                </button>
              </div>

              {/* Quick Character Motion Gesture Buttons */}
              <div className="flex items-center gap-1 bg-[#101623]/90 border border-cyan-500/30 p-1 px-2 rounded-xl shadow-lg">
                <button
                  onClick={handleTriggerGreeting}
                  className="px-2.5 py-0.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  🙋‍♀️ Chào Khán Giả
                </button>
                <button
                  onClick={handleTriggerPointLaser}
                  className="px-2.5 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  👉 Bắn Laser
                </button>
                <button
                  onClick={handleTriggerGavelStrike}
                  className="px-2.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-[10px] font-bold transition-all flex items-center gap-1"
                >
                  🔨 Gõ Búa
                </button>
              </div>

            </div>

            {/* FULL STANDING 3D VIRTUAL CHARACTER RIG WITH 3D PERSPECTIVE TRANSFORM */}
            <div
              className="relative my-1 flex flex-col items-center justify-center transition-all duration-700 ease-out z-20 group cursor-pointer"
              style={{
                perspective: '1200px',
                transformStyle: 'preserve-3d',
                transform: get3DCameraTransform(cameraAngle)
              }}
              onClick={handleTriggerGreeting}
            >
              {/* Particle Light Beam Stage Canvas */}
              <VirtualStageCanvas emotion={auctioneerEmotion} isSpeaking={isSpeaking} />

              {/* Audio Equalizer Sound Wave Bar when Speaking */}
              {isSpeaking && (
                <div className="absolute -top-4 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-400/60 text-amber-300 text-[10px] font-extrabold shadow-xl z-40 animate-pulse">
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-1 bg-amber-400 animate-eq-bar-1 rounded-full" />
                    <span className="w-1 bg-cyan-400 animate-eq-bar-2 rounded-full" />
                    <span className="w-1 bg-amber-400 animate-eq-bar-3 rounded-full" />
                    <span className="w-1 bg-cyan-400 animate-eq-bar-1 rounded-full" />
                  </div>
                  <span className="tracking-wide uppercase text-[9px]">Aura 3D Speaking...</span>
                </div>
              )}

              {/* Full Standing 3D Character Silhouette Cutout (No Square Box Boundary!) */}
              <div className={`relative h-60 sm:h-72 w-auto transition-all duration-500 ${characterPosture === 'excited' ? 'animate-posture-excited' : 'animate-posture-dignified'}`}>
                <img
                  src={virtualCharacterImg}
                  alt="3D Virtual Female Auctioneer Character"
                  className="h-full w-auto object-contain filter drop-shadow-[0_15px_35px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all duration-300 mask-radial-fade"
                />

                {/* Holographic Laser Body Scan overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-400/20 via-amber-400/10 to-transparent pointer-events-none animate-hologram-scan rounded-full" />

                {/* Gavel Shockwave Ring overlay when striking */}
                {isGavelStriking && (
                  <div className="absolute top-1/3 right-4 w-14 h-14 bg-amber-400/40 rounded-full blur-md animate-ping pointer-events-none" />
                )}
              </div>

              {/* Elevated Holographic Floor Ring Podium */}
              <div className="relative -mt-6 z-10 flex flex-col items-center">
                {/* Outer Hologram Floor Ring */}
                <div className="w-64 h-10 rounded-full bg-gradient-to-r from-amber-500/20 via-cyan-400/40 to-amber-500/20 border border-amber-400/60 shadow-[0_0_30px_rgba(245,158,11,0.5)] blur-[1px] animate-pulse flex items-center justify-center">
                  <div className="w-48 h-6 rounded-full border border-cyan-300/50 animate-spin-slow" />
                </div>

                {/* Master Podium Stand with Crystal Gavel Icon */}
                <div className="bg-[#0b0f17]/95 backdrop-blur-xl border border-amber-500/60 px-6 py-1 rounded-2xl shadow-2xl -mt-5 relative z-20 flex items-center gap-2 border-t-amber-400">
                  <Gavel className={`w-4 h-4 text-amber-400 ${isGavelStriking ? 'animate-gavel-strike text-emerald-400' : ''}`} />
                  <span className="text-xs font-black text-gradient-gold uppercase tracking-widest">
                    BỤC NỮ HOÀNG ĐẤU GIÁ 3D AURA
                  </span>
                </div>
              </div>

            </div>

            {/* CENTRAL CIRCULAR PEDESTAL UNDER VERTICAL BEAM */}
            <div className="relative flex flex-col items-center pt-1">
              
              {/* Product Showcase Card on Pedestal (Rotates 3D when inspecting) */}
              <div className={`w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-amber-500/50 shadow-2xl shadow-amber-500/20 bg-[#101623] relative z-10 ${isInspectingItem ? 'animate-item-rotate ring-4 ring-cyan-400' : ''}`}>
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
              <div className="w-52 h-5 bg-gradient-to-r from-amber-500/40 via-amber-300/60 to-amber-500/40 rounded-full blur-md mx-auto -mt-3 relative z-0" />

              {/* Price Banner Tag */}
              <div className="bg-black/80 backdrop-blur-xl px-5 py-1.5 rounded-2xl border border-amber-500/50 shadow-2xl mt-1 text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Giá Trực Tiếp Khán Phòng</span>
                <span className="text-2xl sm:text-3xl font-black text-amber-400 font-heading number-tabular">
                  ${auction.currentBid.toLocaleString()}
                </span>
              </div>

            </div>

          </div>

          {/* BOTTOM SPECTATOR POV CONTROL & ITEM INSPECTOR PANELS */}
          <div className="relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-4">
            
            {/* ITEM INSPECTOR & SPECS PANEL (Col 6) */}
            <div className="lg:col-span-6 bg-[#0b0f17]/90 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-amber-400" />
                  <h4 className="text-xs font-bold text-white uppercase font-heading">Theo Dõi Thông Tin Vật Phẩm</h4>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAskAuctioneer('inspect')}
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 transition-all"
                  >
                    <RotateCw className="w-3 h-3" />
                    Giám Định 3D
                  </button>

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
