import React, { useState } from 'react';
import { X, LogIn, UserPlus, ShieldCheck, KeyRound, Mail, User, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AuthModal({
  onClose,
  initialTab = 'login',
  users = [],
  onLogin,
  onRegister
}) {
  const [tab, setTab] = useState(initialTab); // 'login' | 'register' | 'demo'

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('VIP Bidder');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250');
  const [regError, setRegError] = useState('');

  // Avatar presets
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=250'
  ];

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail.trim()) {
      setLoginError('Vui lòng nhập Email.');
      return;
    }

    const foundUser = users.find(u => u.email.toLowerCase() === loginEmail.trim().toLowerCase());
    if (!foundUser) {
      setLoginError('Không tìm thấy tài khoản với Email này. Thử lại hoặc dùng tab Đăng nhập Demo.');
      return;
    }

    if (foundUser.status === 'banned') {
      setLoginError('Tài khoản này đã bị tạm khóa bởi Quản trị viên.');
      return;
    }

    onLogin(foundUser);
    onClose();
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    setRegError('');

    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Vui lòng điền đầy đủ Họ tên và Email.');
      return;
    }

    const existing = users.find(u => u.email.toLowerCase() === regEmail.trim().toLowerCase());
    if (existing) {
      setRegError('Email này đã được sử dụng. Vui lòng chọn Email khác hoặc đăng nhập.');
      return;
    }

    const newUser = {
      id: `usr-${Date.now()}`,
      name: regName.trim(),
      email: regEmail.trim(),
      avatar: regAvatar,
      balance: 10000, // Welcome Bonus $10,000
      verified: true,
      role: regRole,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      bio: 'Thành viên mới gia nhập AuraBid Vaults.'
    };

    onRegister(newUser);
    onClose();
  };

  const handleQuickSelectUser = (user) => {
    onLogin(user);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-md relative" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          
          {/* Header Brand */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/25 mb-1">
              <ShieldCheck className="w-7 h-7 stroke-[2.5]" />
            </div>
            <h3 className="text-2xl font-black tracking-tight text-white font-heading">
              Aura<span className="text-gradient-gold">Bid</span> Pass
            </h3>
            <p className="text-xs text-gray-400">
              Sàn đấu giá xa xỉ thời gian thực • Hệ thống xác thực bảo mật Escrow
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-[#101623] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => setTab('login')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              Đăng Nhập
            </button>
            <button
              type="button"
              onClick={() => setTab('register')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              Đăng Ký
            </button>
            <button
              type="button"
              onClick={() => setTab('demo')}
              className={`py-2 px-3 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                tab === 'demo'
                  ? 'bg-amber-500 text-slate-950 shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Demo Nhanh
            </button>
          </div>

          {/* TAB 1: LOGIN */}
          {tab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {loginError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Email Tài Khoản
                </label>
                <input
                  type="email"
                  placeholder="alex@aurabid.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" /> Mật Khẩu
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="input-field"
                />
                <span className="text-[10px] text-gray-500 block text-right">Thử nghiệm: Mật khẩu bất kỳ hoặc xem Tab Demo Nhanh</span>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-amber-500/20">
                Xác Nhận Đăng Nhập
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {tab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {regError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {regError}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" /> Họ & Tên Hiển Thị
                </label>
                <input
                  type="text"
                  placeholder="VD: Nguyễn Văn Anh"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" /> Địa Chỉ Email
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Mật Khẩu</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Vai Trò Đăng Ký</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                    className="input-field text-xs"
                  >
                    <option value="VIP Bidder">VIP Bidder (Người Đấu Giá)</option>
                    <option value="Verified Seller">Verified Seller (Người Bán)</option>
                  </select>
                </div>
              </div>

              {/* Avatar Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-300">Chọn Ảnh Đại Diện (Avatar)</label>
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {avatarPresets.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="Preset"
                      onClick={() => setRegAvatar(url)}
                      className={`w-10 h-10 rounded-xl object-cover cursor-pointer transition-all border-2 ${
                        regAvatar === url ? 'border-amber-400 scale-105 ring-2 ring-amber-400/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tặng ngay +$10,000 quà chào mừng vào Ví khả dụng!</span>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-sm font-bold shadow-lg shadow-amber-500/20">
                Tạo Tài Khoản Mới
              </button>
            </form>
          )}

          {/* TAB 3: DEMO ACCOUNTS QUICK SWITCH */}
          {tab === 'demo' && (
            <div className="space-y-3">
              <p className="text-xs text-gray-400 font-medium text-center">
                Chọn nhanh 1 tài khoản bên dưới để trải nghiệm ngay với đầy đủ quyền hạn:
              </p>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {users.map((u) => {
                  const isAdmin = u.role === 'System Admin';
                  return (
                    <div
                      key={u.id}
                      onClick={() => handleQuickSelectUser(u)}
                      className="group flex items-center justify-between p-3 rounded-xl bg-[#101623] hover:bg-[#182235] border border-white/10 hover:border-amber-500/40 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400/40"
                        />
                        <div className="text-left">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                              {u.name}
                            </span>
                            {isAdmin && (
                              <span className="bg-rose-500/20 text-rose-400 text-[9px] font-extrabold px-1.5 py-0.5 rounded border border-rose-500/30">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-gray-400 block">{u.role} • ${u.balance.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-amber-400 font-bold group-hover:translate-x-1 transition-transform">
                        <span>Đăng nhập</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
