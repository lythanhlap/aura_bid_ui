import React, { useState } from 'react';
import { Gavel, Search, Bell, PlusCircle, Wallet, User, LogIn, LogOut, ShieldCheck, ShieldAlert, ChevronDown } from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  user,
  pendingRequestsCount = 0,
  onOpenCreateModal,
  onOpenDashboardModal,
  unreadNotificationCount,
  onOpenDepositModal,
  onOpenAuthModal,
  onLogout,
  onOpenAdminModal
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isAdmin = user && user.role === 'System Admin';

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f17]/85 border-b border-white/10 transition-all">
      <div className="app-container">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand Name */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setSearchQuery('')}>
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <Gavel className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-extrabold tracking-tight text-white font-heading">
                  Aura<span className="text-gradient-gold">Bid</span>
                </span>
                <span className="badge-live text-[10px] py-0.5 px-2">LIVE</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium tracking-wide">LUXURY REAL-TIME AUCTIONS</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md relative items-center">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Tìm kiếm đồng hồ, siêu xe, tác phẩm nghệ thuật..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151d2a] border border-white/10 rounded-full pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-xs text-gray-400 hover:text-white"
              >
                Xóa
              </button>
            )}
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            
            {user ? (
              <>
                {/* Wallet Balance */}
                <button
                  onClick={onOpenDepositModal}
                  className="hidden lg:flex items-center gap-2 bg-[#151d2a] hover:bg-[#1c2738] border border-emerald-500/30 text-emerald-400 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all group"
                  title="Ví & Nạp/Rút tiền"
                >
                  <Wallet className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span className="number-tabular">${user.balance.toLocaleString()}</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-1.5 py-0.5 rounded font-bold">+</span>
                </button>

                {/* Create Auction Button */}
                <button
                  onClick={onOpenCreateModal}
                  className="btn-primary text-sm py-2 px-3.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Tạo Đấu Giá</span>
                </button>

                {/* Admin Quick Button (If Admin) with Pending Requests Badge */}
                {isAdmin && (
                  <button
                    onClick={onOpenAdminModal}
                    className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-400 transition-all relative"
                    title="Bảng Quản Trị Admin"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    {pendingRequestsCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        {pendingRequestsCount}
                      </span>
                    )}
                  </button>
                )}

                {/* Notifications Bell Button */}
                <button
                  onClick={onOpenDashboardModal}
                  className="relative p-2.5 rounded-xl bg-[#151d2a] hover:bg-[#1c2738] border border-white/10 text-gray-300 hover:text-white transition-all"
                  title="Thông báo hệ thống"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce border-2 border-[#0b0f17]">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {/* User Profile Dropdown Button */}
                <div className="relative">
                  <div
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-xl bg-[#151d2a] hover:bg-[#1c2738] border border-white/10 cursor-pointer transition-all group"
                  >
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-8 h-8 rounded-lg object-cover ring-2 ring-amber-500/40 group-hover:ring-amber-400 transition-all"
                    />
                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-white leading-tight">{user.name}</span>
                        <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      </div>
                      <span className="text-[10px] text-amber-400 font-medium block">{user.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-white transition-transform" />
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 top-12 mt-2 w-56 bg-[#101623] border border-white/15 rounded-2xl shadow-2xl p-2 z-50 space-y-1"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <button
                        onClick={onOpenDashboardModal}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white text-left transition-colors"
                      >
                        <User className="w-4 h-4 text-amber-400" />
                        Trang Cá Nhân & Ví
                      </button>

                      {isAdmin && (
                        <button
                          onClick={onOpenAdminModal}
                          className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/20 text-xs font-bold text-rose-400 text-left transition-colors justify-between"
                        >
                          <span className="flex items-center gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-rose-400" />
                            Quản Trị Admin
                          </span>
                          {pendingRequestsCount > 0 && (
                            <span className="bg-amber-400 text-slate-950 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                              {pendingRequestsCount} mới
                            </span>
                          )}
                        </button>
                      )}

                      <button
                        onClick={onOpenDepositModal}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-emerald-400 text-left transition-colors"
                      >
                        <Wallet className="w-4 h-4 text-emerald-400" />
                        Nạp / Rút Tiền Ví (${user.balance.toLocaleString()})
                      </button>

                      <div className="border-t border-white/10 my-1" />

                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-rose-500/20 text-xs font-bold text-rose-400 text-left transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng Xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* GUEST MODE */
              <button
                onClick={() => onOpenAuthModal('login')}
                className="btn-primary text-sm py-2.5 px-5 flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng Nhập / Đăng Ký</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
