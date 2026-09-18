import React, { useState } from 'react';
import { X, Users, Gavel, ShieldCheck, DollarSign, PlusCircle, Lock, Unlock, Check, AlertCircle, Edit, Trash2, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart2 } from 'lucide-react';

export default function AdminPanelModal({
  onClose,
  users = [],
  auctions = [],
  transactions = [],
  onUpdateUserRole,
  onUpdateUserBalance,
  onToggleUserStatus,
  onToggleUserKyc,
  onDeleteAuction,
  onEndAuctionEarly,
  addToast
}) {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'auctions' | 'transactions'
  const [userSearch, setUserSearch] = useState('');
  const [balanceInputUser, setBalanceInputUser] = useState(null);
  const [customBalanceAmount, setCustomBalanceAmount] = useState('');

  // Metrics
  const totalUsers = users.length;
  const activeAuctionsCount = auctions.filter(a => a.status === 'live').length;
  const totalVolume = auctions.reduce((sum, a) => sum + (a.currentBid || 0), 0);
  const platformRevenue = Math.round(totalVolume * 0.05); // 5% fee

  // Filtered users
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.role.toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleAdjustBalanceSubmit = (e) => {
    e.preventDefault();
    if (!balanceInputUser) return;
    const val = parseFloat(customBalanceAmount);
    if (isNaN(val)) return;

    onUpdateUserBalance(balanceInputUser.id, val);
    addToast('Điều Chỉnh Số Dư!', `Đã cập nhật số dư của ${balanceInputUser.name} thành $${val.toLocaleString()}`, 'success');
    setBalanceInputUser(null);
    setCustomBalanceAmount('');
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
          
          {/* Admin Header & Stats */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-extrabold shadow-lg">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white font-heading">Bảng Quản Trị Hệ Thống Admin</h2>
                  <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-0.5 rounded-full border border-rose-500/30">
                    Control Center
                  </span>
                </div>
                <p className="text-xs text-gray-400">Quản lý người dùng, phân quyền, số dư ví và giám sát các phiên đấu giá.</p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 rounded-xl bg-[#101623] border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-400" /> Tổng Người Dùng
                </span>
                <span className="text-2xl font-black text-white font-heading">{totalUsers}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101623] border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1">
                  <Gavel className="w-3.5 h-3.5 text-emerald-400" /> Phiên Đang Live
                </span>
                <span className="text-2xl font-black text-emerald-400 font-heading">{activeAuctionsCount}</span>
              </div>

              <div className="p-4 rounded-xl bg-[#101623] border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-cyan-400" /> Tổng Đấu Giá ($)
                </span>
                <span className="text-xl font-black text-cyan-400 number-tabular font-heading">
                  ${(totalVolume / 1000000).toFixed(2)}M
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#101623] border border-white/10 space-y-1">
                <span className="text-[11px] text-gray-400 font-semibold uppercase flex items-center gap-1">
                  <BarChart2 className="w-3.5 h-3.5 text-amber-400" /> Doanh Thu Sàn (5%)
                </span>
                <span className="text-xl font-black text-amber-400 number-tabular font-heading">
                  ${(platformRevenue / 1000).toFixed(0)}k
                </span>
              </div>
            </div>
          </div>

          {/* Admin Tabs */}
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'users'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              Quản Lý Người Dùng ({users.length})
            </button>

            <button
              onClick={() => setActiveTab('auctions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'auctions'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Gavel className="w-4 h-4" />
              Giám Sát Đấu Giá ({auctions.length})
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'transactions'
                  ? 'bg-rose-500 text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              Nhật Ký Giao Dịch Ví ({transactions.length})
            </button>
          </div>

          {/* TAB 1: USERS MANAGEMENT TABLE */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Tìm theo tên, email, vai trò..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="input-field max-w-xs text-xs"
                />
                <span className="text-xs text-gray-400">Hiển thị {filteredUsers.length} tài khoản</span>
              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#101623] border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px]">
                      <th className="p-3">Thành Viên</th>
                      <th className="p-3">Vai Trò (Role)</th>
                      <th className="p-3">Số Dư Ví ($)</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3">Xác Minh KYC</th>
                      <th className="p-3 text-right">Thao Tác Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0b0f17]">
                    {filteredUsers.map((u) => {
                      const isBanned = u.status === 'banned';
                      return (
                        <tr key={u.id} className="hover:bg-[#121927] transition-colors">
                          
                          {/* User info */}
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img src={u.avatar} alt={u.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-white/10" />
                              <div>
                                <span className="font-bold text-white block">{u.name}</span>
                                <span className="text-[10px] text-gray-400 block">{u.email}</span>
                              </div>
                            </div>
                          </td>

                          {/* Role selector */}
                          <td className="p-3">
                            <select
                              value={u.role}
                              onChange={(e) => {
                                onUpdateUserRole(u.id, e.target.value);
                                addToast('Cập Nhật Vai Trò', `Đã đổi vai trò ${u.name} thành ${e.target.value}`, 'info');
                              }}
                              className="bg-[#151d2a] border border-white/10 text-white rounded-lg px-2 py-1 text-[11px] focus:outline-none focus:border-amber-500"
                            >
                              <option value="System Admin">System Admin</option>
                              <option value="VIP Bidder">VIP Bidder</option>
                              <option value="Diamond Collector">Diamond Collector</option>
                              <option value="Verified Seller">Verified Seller</option>
                              <option value="Member">Member</option>
                            </select>
                          </td>

                          {/* Balance & Edit Button */}
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-emerald-400 number-tabular">
                                ${u.balance.toLocaleString()}
                              </span>
                              <button
                                onClick={() => {
                                  setBalanceInputUser(u);
                                  setCustomBalanceAmount(u.balance.toString());
                                }}
                                className="p-1 rounded hover:bg-white/10 text-amber-400"
                                title="Sửa số dư"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            {isBanned ? (
                              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                                BỊ KHÓA
                              </span>
                            ) : (
                              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded">
                                HOẠT ĐỘNG
                              </span>
                            )}
                          </td>

                          {/* KYC Toggle */}
                          <td className="p-3">
                            <button
                              onClick={() => {
                                onToggleUserKyc(u.id);
                                addToast('Cập Nhật KYC', `Thay đổi trạng thái KYC của ${u.name}`, 'info');
                              }}
                              className={`text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1 ${
                                u.verified
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : 'bg-gray-800 text-gray-400 border border-white/10 hover:text-white'
                              }`}
                            >
                              <ShieldCheck className="w-3 h-3" />
                              {u.verified ? 'Đã KYC' : 'Chưa KYC'}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                onToggleUserStatus(u.id);
                                addToast(
                                  isBanned ? 'Đã Mở Khóa Tài Khoản' : 'Đã Khóa Tài Khoản',
                                  `Tài khoản ${u.name} hiện tại ${isBanned ? 'đã có thể đăng nhập' : 'bị tạm ngừng'}`,
                                  isBanned ? 'success' : 'warning'
                                );
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 justify-end ml-auto ${
                                isBanned
                                  ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                                  : 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30'
                              }`}
                            >
                              {isBanned ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                              {isBanned ? 'Mở Khóa' : 'Khóa TK'}
                            </button>
                          </td>

                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: AUCTION MODERATION */}
          {activeTab === 'auctions' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#101623] border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px]">
                      <th className="p-3">Sản Phẩm Đấu Giá</th>
                      <th className="p-3">Danh Mục</th>
                      <th className="p-3">Giá Hiện Tại</th>
                      <th className="p-3">Người Bán</th>
                      <th className="p-3">Trạng Thái</th>
                      <th className="p-3 text-right">Thao Tác Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0b0f17]">
                    {auctions.map((auc) => (
                      <tr key={auc.id} className="hover:bg-[#121927] transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <img src={auc.image} alt={auc.title} className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-bold text-white max-w-xs truncate">{auc.title}</span>
                          </div>
                        </td>
                        <td className="p-3 text-gray-400">{auc.categoryName}</td>
                        <td className="p-3 font-bold text-amber-400">${auc.currentBid.toLocaleString()}</td>
                        <td className="p-3 text-gray-300">{auc.seller?.name}</td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            auc.status === 'live' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-gray-800 text-gray-400'
                          }`}>
                            {auc.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {auc.status === 'live' && (
                              <button
                                onClick={() => {
                                  onEndAuctionEarly(auc.id);
                                  addToast('Đã Kết Thúc Đấu Giá', `Đã chốt phiên đấu giá ${auc.title}`, 'info');
                                }}
                                className="px-2 py-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 text-[10px] font-bold border border-amber-500/30"
                              >
                                Chốt Sớm
                              </button>
                            )}
                            <button
                              onClick={() => {
                                onDeleteAuction(auc.id);
                                addToast('Đã Xóa Phiên Đấu Giá', `Đã gỡ bài đăng ${auc.title}`, 'warning');
                              }}
                              className="p-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30"
                              title="Xóa phiên"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: TRANSACTIONS LOG */}
          {activeTab === 'transactions' && (
            <div className="space-y-3">
              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#101623] border-b border-white/10 text-gray-400 uppercase font-semibold text-[10px]">
                      <th className="p-3">Mã GD</th>
                      <th className="p-3">Thành Viên</th>
                      <th className="p-3">Loại Giao Dịch</th>
                      <th className="p-3">Số Tiền ($)</th>
                      <th className="p-3">Mô Tả / Nội Dung</th>
                      <th className="p-3 text-right">Thời Gian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#0b0f17]">
                    {transactions.map((tx) => {
                      const isPositive = tx.type === 'deposit' || tx.type === 'bid_refund';
                      return (
                        <tr key={tx.id} className="hover:bg-[#121927] transition-colors">
                          <td className="p-3 text-gray-500 font-mono text-[10px]">{tx.id}</td>
                          <td className="p-3 font-bold text-white">{tx.userName}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              tx.type === 'deposit' ? 'bg-emerald-500/20 text-emerald-400' :
                              tx.type === 'withdraw' ? 'bg-amber-500/20 text-amber-400' :
                              'bg-cyan-500/20 text-cyan-400'
                            }`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className={`p-3 font-bold number-tabular ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : '-'}${tx.amount.toLocaleString()}
                          </td>
                          <td className="p-3 text-gray-300 max-w-xs truncate">{tx.description}</td>
                          <td className="p-3 text-right text-gray-400 text-[10px]">{tx.date}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Modal Overlay for Balance Adjustment */}
          {balanceInputUser && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#101623] border border-white/20 p-6 rounded-2xl max-w-sm w-full space-y-4">
                <h4 className="text-sm font-bold text-white">Chỉnh Sửa Số Dư Ví ({balanceInputUser.name})</h4>
                <form onSubmit={handleAdjustBalanceSubmit} className="space-y-3">
                  <input
                    type="number"
                    value={customBalanceAmount}
                    onChange={(e) => setCustomBalanceAmount(e.target.value)}
                    className="input-field"
                    placeholder="Nhập số dư USD mới"
                    required
                  />
                  <div className="flex items-center gap-2">
                    <button type="submit" className="btn-emerald flex-1 py-2 text-xs">
                      Cập Nhật
                    </button>
                    <button
                      type="button"
                      onClick={() => setBalanceInputUser(null)}
                      className="btn-secondary flex-1 py-2 text-xs"
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
