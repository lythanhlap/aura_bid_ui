import React, { useState } from 'react';
import { X, Wallet, ShieldCheck, Trophy, Heart, Gavel, PlusCircle, CheckCircle, AlertTriangle, LogOut, Settings, DollarSign, Edit, User, Mail, Sparkles, ShieldAlert } from 'lucide-react';

export default function UserDashboardModal({
  onClose,
  user,
  auctions = [],
  watchlist = [],
  transactions = [],
  onOpenDepositModal,
  onSelectAuction,
  onLogout,
  onOpenAdminModal,
  onUpdateProfile,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('bids'); // 'bids' | 'won' | 'watchlist' | 'listings' | 'transactions' | 'settings'

  // Settings form state
  const [editName, setEditName] = useState(user?.name || '');
  const [editAvatar, setEditAvatar] = useState(user?.avatar || '');
  const [editBio, setEditBio] = useState(user?.bio || '');

  if (!user) return null;

  // Find auctions where user has placed a bid
  const userBiddedAuctions = auctions.filter(auc =>
    auc.bids.some(b => b.bidder === user.name)
  );

  // Find watchlisted auctions
  const watchlistedAuctions = auctions.filter(auc => watchlist.includes(auc.id));

  // Find auctions listed by user
  const userListings = auctions.filter(auc => auc.seller?.name === user.name);

  // Find auctions won by user
  const wonAuctions = auctions.filter(auc =>
    auc.endTime <= Date.now() && auc.bids[0]?.bidder === user.name
  );

  // Filter transactions for current user
  const userTransactions = transactions.filter(t => t.userId === user.id || t.userName === user.name);

  const isAdmin = user.role === 'System Admin';

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile(user.id, {
      name: editName,
      avatar: editAvatar,
      bio: editBio
    });
    addToast('Đã Cập Nhật Hồ Sơ', 'Thông tin cá nhân của bạn đã được thay đổi thành công.', 'success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-3xl relative" onClick={(e) => e.stopPropagation()}>
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Top User Profile Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#101623] to-[#151d2a] border border-white/10">
            <div className="flex items-center gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400/50 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-white font-heading">{user.name}</h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{user.email || 'Hội viên cấp cao • Geneva Vault Guild'}</p>
                {user.bio && <p className="text-[11px] text-gray-500 italic mt-1 max-w-sm line-clamp-1">{user.bio}</p>}
              </div>
            </div>

            {/* Wallet Quick Balance & Action Buttons */}
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 bg-[#0b0f17] p-2.5 px-3 rounded-xl border border-emerald-500/30">
                <div>
                  <span className="text-[9px] text-gray-400 uppercase font-semibold block">Số Dư Ví Khả Dụng</span>
                  <span className="text-base font-black text-emerald-400 number-tabular">
                    ${user.balance.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={onOpenDepositModal}
                  className="btn-emerald text-xs py-1.5 px-2.5"
                >
                  + Nạp / Rút
                </button>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdminModal();
                    }}
                    className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Bảng Admin
                  </button>
                )}

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="bg-gray-800 hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 border border-white/10 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Đăng Xuất
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 border-b border-white/10 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('bids')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'bids'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Gavel className="w-3.5 h-3.5" />
              Đang Tham Gia ({userBiddedAuctions.length})
            </button>

            <button
              onClick={() => setActiveTab('won')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'won'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              Đã Thắng ({wonAuctions.length})
            </button>

            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'watchlist'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              Yêu Thích ({watchlistedAuctions.length})
            </button>

            <button
              onClick={() => setActiveTab('listings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'listings'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Đang Bán ({userListings.length})
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'transactions'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              Lịch Sử Ví ({userTransactions.length})
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              Hồ Sơ & Cài Đặt
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="space-y-3 min-h-[240px] max-h-80 overflow-y-auto pr-1">
            
            {/* TAB BIDS */}
            {activeTab === 'bids' && (
              userBiddedAuctions.length > 0 ? (
                userBiddedAuctions.map(auc => {
                  const isTopBidder = auc.bids[0]?.bidder === user.name;
                  return (
                    <div
                      key={auc.id}
                      onClick={() => {
                        onClose();
                        onSelectAuction(auc);
                      }}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-[#101623] hover:bg-[#151d2a] border border-white/5 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img src={auc.image} alt={auc.title} className="w-12 h-12 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-white line-clamp-1">{auc.title}</h4>
                          <span className="text-[11px] text-gray-400">Giá hiện tại: ${auc.currentBid.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {isTopBidder ? (
                          <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            ĐANG DẪN ĐẦU
                          </span>
                        ) : (
                          <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            BỊ ĐÈ GIÁ!
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  Bạn chưa tham gia trả giá phiên đấu giá nào.
                </div>
              )
            )}

            {/* TAB WON */}
            {activeTab === 'won' && (
              wonAuctions.length > 0 ? (
                wonAuctions.map(auc => (
                  <div
                    key={auc.id}
                    onClick={() => {
                      onClose();
                      onSelectAuction(auc);
                    }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#101623] hover:bg-[#151d2a] border border-emerald-500/30 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={auc.image} alt={auc.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{auc.title}</h4>
                        <span className="text-[11px] text-emerald-400 font-bold">Giá Thắng Cuộc: ${auc.currentBid.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-emerald-400" />
                      ĐÃ THẮNG
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  Bạn chưa thắng phiên đấu giá nào.
                </div>
              )
            )}

            {/* TAB WATCHLIST */}
            {activeTab === 'watchlist' && (
              watchlistedAuctions.length > 0 ? (
                watchlistedAuctions.map(auc => (
                  <div
                    key={auc.id}
                    onClick={() => {
                      onClose();
                      onSelectAuction(auc);
                    }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#101623] hover:bg-[#151d2a] border border-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={auc.image} alt={auc.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{auc.title}</h4>
                        <span className="text-[11px] text-amber-400 font-bold">${auc.currentBid.toLocaleString()}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">Xem Ngay →</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  Danh sách theo dõi trống.
                </div>
              )
            )}

            {/* TAB LISTINGS */}
            {activeTab === 'listings' && (
              userListings.length > 0 ? (
                userListings.map(auc => (
                  <div
                    key={auc.id}
                    onClick={() => {
                      onClose();
                      onSelectAuction(auc);
                    }}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#101623] hover:bg-[#151d2a] border border-white/5 cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={auc.image} alt={auc.title} className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{auc.title}</h4>
                        <span className="text-[11px] text-gray-400">{auc.totalBids} lượt đặt giá</span>
                      </div>
                    </div>
                    <span className="badge-live">LIVE</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  Bạn chưa đăng bán phiên đấu giá nào.
                </div>
              )
            )}

            {/* TAB TRANSACTIONS */}
            {activeTab === 'transactions' && (
              userTransactions.length > 0 ? (
                <div className="space-y-2">
                  {userTransactions.map(tx => {
                    const isPositive = tx.type === 'deposit' || tx.type === 'bid_refund';
                    return (
                      <div key={tx.id} className="flex items-center justify-between p-3 rounded-xl bg-[#101623] border border-white/5 text-xs">
                        <div className="space-y-0.5">
                          <span className="font-bold text-white block">{tx.description}</span>
                          <span className="text-[10px] text-gray-400 block">{tx.date}</span>
                        </div>
                        <span className={`font-bold number-tabular ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {isPositive ? '+' : '-'}${tx.amount.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-xs text-gray-400">
                  Chưa có lịch sử biến động số dư ví nào.
                </div>
              )
            )}

            {/* TAB SETTINGS & PROFILE EDIT */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveProfile} className="space-y-4 bg-[#101623] p-4 rounded-xl border border-white/10">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Edit className="w-4 h-4 text-amber-400" /> Cập Nhật Thông Tin Cá Nhân
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Tên Hiển Thị</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Đường Dẫn Ảnh Đại Diện (Avatar URL)</label>
                  <input
                    type="text"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    className="input-field text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Tiểu Sử / Bio</label>
                  <textarea
                    rows={2}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    className="input-field text-xs resize-none"
                    placeholder="Giới thiệu ngắn về bản thân..."
                  />
                </div>

                <button type="submit" className="btn-primary py-2.5 px-4 text-xs font-bold">
                  Lưu Thay Đổi
                </button>
              </form>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
