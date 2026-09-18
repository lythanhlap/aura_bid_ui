import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroFeatured from './components/HeroFeatured';
import AuctionGrid from './components/AuctionGrid';
import AuctionDetailModal from './components/AuctionDetailModal';
import CreateAuctionModal from './components/CreateAuctionModal';
import UserDashboardModal from './components/UserDashboardModal';
import DepositModal from './components/DepositModal';
import AuthModal from './components/AuthModal';
import AdminPanelModal from './components/AdminPanelModal';
import ToastContainer from './components/ToastContainer';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  getStoredAuctions,
  saveStoredAuctions,
  getStoredTransactions,
  saveStoredTransactions
} from './mockData';

export default function App() {
  // Persistent States
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredCurrentUser);
  const [auctions, setAuctions] = useState(getStoredAuctions);
  const [transactions, setTransactions] = useState(getStoredTransactions);
  const [watchlist, setWatchlist] = useState(['auc-1', 'auc-3']);

  // UI Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('live'); // live, upcoming, watchlist
  const [sortBy, setSortBy] = useState('endingSoon'); // endingSoon, highestBid, mostBids

  // Modals State
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDashboardModalOpen, setIsDashboardModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register' | 'demo'
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Toast System State
  const [toasts, setToasts] = useState([
    {
      id: 'welcome-toast',
      title: 'Chào mừng tới AuraBid!',
      message: 'Sàn đấu giá trực tuyến thời gian thực cao cấp hàng đầu.',
      type: 'info'
    }
  ]);

  // Sync state to LocalStorage
  useEffect(() => {
    saveStoredUsers(users);
  }, [users]);

  useEffect(() => {
    saveStoredCurrentUser(user);
  }, [user]);

  useEffect(() => {
    saveStoredAuctions(auctions);
  }, [auctions]);

  useEffect(() => {
    saveStoredTransactions(transactions);
  }, [transactions]);

  const addToast = (title, message, type = 'info') => {
    const newToast = { id: `toast-${Date.now()}-${Math.random()}`, title, message, type };
    setToasts(prev => [...prev.slice(-3), newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  const dismissToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper: Require Authentication check for protected actions
  const requireAuth = (callback, tab = 'login') => {
    if (!user) {
      setAuthTab(tab);
      setIsAuthModalOpen(true);
      addToast('Yêu Cầu Đăng Nhập', 'Vui lòng đăng nhập hoặc chọn tài khoản Demo để tiếp tục.', 'warning');
      return false;
    }
    callback();
    return true;
  };

  // Auth Handlers
  const handleLogin = (loggedUser) => {
    setUser(loggedUser);
    addToast('Đăng Nhập Thành Công!', `Chào mừng trở lại, ${loggedUser.name} (${loggedUser.role})`, 'success');
  };

  const handleLogout = () => {
    setUser(null);
    addToast('Đã Đăng Xuất', 'Bạn hiện đang truy cập với vai trò Khách.', 'info');
  };

  const handleRegister = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    setUser(newUser);
    
    // Add Welcome Transaction
    const welcomeTx = {
      id: `tx-${Date.now()}`,
      userId: newUser.id,
      userName: newUser.name,
      type: 'deposit',
      amount: 10000,
      status: 'completed',
      date: new Date().toLocaleString('vi-VN'),
      description: 'Thưởng chào mừng tài khoản mới (Welcome Bonus)'
    };
    setTransactions(prev => [welcomeTx, ...prev]);

    addToast('Tạo Tài Khoản Thành Công!', `Tài khoản ${newUser.name} đã sẵn sàng với $10,000 quà tặng chào mừng.`, 'success');
  };

  // Profile Edit
  const handleUpdateProfile = (userId, updatedFields) => {
    setUser(prev => prev && prev.id === userId ? { ...prev, ...updatedFields } : prev);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedFields } : u));
  };

  // Toggle Watchlist
  const handleToggleWatchlist = (auctionId) => {
    setWatchlist(prev => {
      const exists = prev.includes(auctionId);
      if (exists) {
        addToast('Đã Bỏ Theo Dõi', 'Đã xóa vật phẩm khỏi danh sách theo dõi của bạn.', 'info');
        return prev.filter(id => id !== auctionId);
      } else {
        addToast('Đã Lưu Theo Dõi', 'Vật phẩm đã được đưa vào danh sách theo dõi.', 'success');
        return [...prev, auctionId];
      }
    });
  };

  // Place Bid Action
  const handlePlaceBid = (auctionIdInput, amount) => {
    if (!requireAuth(() => {}, 'login')) return;

    const auctionId = typeof auctionIdInput === 'object' ? auctionIdInput.id : auctionIdInput;
    const targetAuction = auctions.find(a => a.id === auctionId);

    if (!targetAuction) return;

    if (user.balance < amount) {
      addToast('Số Dư Ví Không Đủ!', `Bạn cần ít nhất $${amount.toLocaleString()} để đặt giá. Vui lòng Nạp Tiền thêm.`, 'warning');
      setIsDepositModalOpen(true);
      return;
    }

    setAuctions(prevAuctions =>
      prevAuctions.map(auc => {
        if (auc.id === auctionId) {
          const newBid = {
            id: `bid-${Date.now()}`,
            bidder: user.name,
            amount: amount,
            time: 'Vừa xong',
            avatar: user.avatar
          };

          // Anti-sniping rule: extend 30 seconds if < 1 minute left
          let updatedEndTime = auc.endTime;
          if (auc.endTime - Date.now() < 60 * 1000) {
            updatedEndTime += 30 * 1000;
          }

          return {
            ...auc,
            currentBid: amount,
            totalBids: auc.totalBids + 1,
            endTime: updatedEndTime,
            bids: [newBid, ...auc.bids]
          };
        }
        return auc;
      })
    );

    // Update selected auction modal state if open
    if (selectedAuction && selectedAuction.id === auctionId) {
      setSelectedAuction(prev => ({
        ...prev,
        currentBid: amount,
        totalBids: prev.totalBids + 1,
        bids: [
          {
            id: `bid-${Date.now()}`,
            bidder: user.name,
            amount: amount,
            time: 'Vừa xong',
            avatar: user.avatar
          },
          ...prev.bids
        ]
      }));
    }

    // Record Bid Log Transaction
    const bidTx = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: 'bid_hold',
      amount: amount,
      status: 'completed',
      date: new Date().toLocaleString('vi-VN'),
      description: `Đặt giá phiên ${targetAuction.title.substring(0, 30)}...`
    };
    setTransactions(prev => [bidTx, ...prev]);

    addToast('Đặt Giá Thành Công!', `Bạn đã trả giá thành công $${amount.toLocaleString()}`, 'success');
  };

  // Set Auto-Bid Proxy
  const handleSetAutoBid = (auctionIdInput, maxAmount) => {
    if (!requireAuth(() => {}, 'login')) return;

    const auctionId = typeof auctionIdInput === 'object' ? auctionIdInput.id : auctionIdInput;
    setAuctions(prev =>
      prev.map(auc => {
        if (auc.id === auctionId) {
          return { ...auc, userAutoBidMax: maxAmount };
        }
        return auc;
      })
    );

    if (selectedAuction && selectedAuction.id === auctionId) {
      setSelectedAuction(prev => ({ ...prev, userAutoBidMax: maxAmount }));
    }

    addToast('Kích Hoạt Auto-Bid!', `Đã ủy quyền hệ thống tự động trả giá đến mức tối đa $${maxAmount.toLocaleString()}`, 'success');
  };

  // Deposit Success
  const handleDepositSuccess = (amount) => {
    if (!user) return;

    const updatedBalance = user.balance + amount;
    setUser(prev => prev ? { ...prev, balance: updatedBalance } : null);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: updatedBalance } : u));

    const depositTx = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: 'deposit',
      amount: amount,
      status: 'completed',
      date: new Date().toLocaleString('vi-VN'),
      description: 'Nạp tiền vào ví khả dụng AuraBid'
    };
    setTransactions(prev => [depositTx, ...prev]);

    addToast('Nạp Tiền Thành Công!', `Số dư ví khả dụng đã tăng thêm +$${amount.toLocaleString()}`, 'success');
  };

  // Withdraw Success
  const handleWithdrawSuccess = (amount, bankDetails) => {
    if (!user) return;

    const updatedBalance = Math.max(0, user.balance - amount);
    setUser(prev => prev ? { ...prev, balance: updatedBalance } : null);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, balance: updatedBalance } : u));

    const withdrawTx = {
      id: `tx-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      type: 'withdraw',
      amount: amount,
      status: 'completed',
      date: new Date().toLocaleString('vi-VN'),
      description: `Rút tiền về ${bankDetails.bankName} (STK: ${bankDetails.accountNumber})`
    };
    setTransactions(prev => [withdrawTx, ...prev]);

    addToast('Rút Tiền Thành Công!', `Đã giải ngân -$${amount.toLocaleString()} về tài khoản ngân hàng.`, 'success');
  };

  // Create Auction
  const handleCreateAuction = (newAuction) => {
    if (!requireAuth(() => {}, 'login')) return;

    // Attach creator seller name if logged in
    const finalAuction = {
      ...newAuction,
      seller: {
        name: user.name,
        rating: 5.0,
        verified: user.verified,
        salesCount: 1
      }
    };

    setAuctions(prev => [finalAuction, ...prev]);
    addToast('Đã Đăng Đấu Giá!', 'Sản phẩm của bạn đã hiển thị công khai trên phiên đấu giá LIVE.', 'success');
  };

  // Admin Actions
  const handleAdminUpdateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleAdminUpdateUserBalance = (userId, newBalance) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, balance: newBalance } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, balance: newBalance } : null);
    }
  };

  const handleAdminToggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'banned' ? 'active' : 'banned';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleAdminToggleUserKyc = (userId) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, verified: !u.verified } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, verified: !prev.verified } : null);
    }
  };

  const handleAdminDeleteAuction = (auctionId) => {
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
    if (selectedAuction && selectedAuction.id === auctionId) {
      setSelectedAuction(null);
    }
  };

  const handleAdminEndAuctionEarly = (auctionId) => {
    setAuctions(prev => prev.map(a => a.id === auctionId ? { ...a, endTime: Date.now(), status: 'ended' } : a));
  };

  // Live Bid Simulator: Simulates external bids every 14 seconds
  useEffect(() => {
    const simulatorInterval = setInterval(() => {
      const activeLiveAuctions = auctions.filter(a => a.status === 'live' && a.endTime > Date.now());
      if (activeLiveAuctions.length === 0) return;

      const randomTarget = activeLiveAuctions[Math.floor(Math.random() * activeLiveAuctions.length)];
      const botNames = ['Baron Rothschild', 'Sophia Laurent', 'Vanguard Capital', 'Satoshi_N', 'Geneva Buyer'];
      const botAvatars = [
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=150'
      ];

      const chosenBot = botNames[Math.floor(Math.random() * botNames.length)];
      const chosenAvatar = botAvatars[Math.floor(Math.random() * botAvatars.length)];
      const increment = randomTarget.bidIncrement;
      const botAmount = randomTarget.currentBid + increment;

      // Check if current top bidder was user before outbidding
      const wasUserTop = user && randomTarget.bids[0]?.bidder === user.name;

      // Bot Bids
      setAuctions(prev =>
        prev.map(auc => {
          if (auc.id === randomTarget.id) {
            const botBid = {
              id: `bid-bot-${Date.now()}`,
              bidder: chosenBot,
              amount: botAmount,
              time: 'Vừa xong',
              avatar: chosenAvatar
            };

            // Check if user has Auto-Bid enabled and can counter-bid
            let updatedBids = [botBid, ...auc.bids];
            let finalBidAmount = botAmount;

            if (user && auc.userAutoBidMax && auc.userAutoBidMax >= botAmount + increment && user.balance >= botAmount + increment) {
              const autoCounterAmount = botAmount + increment;
              const userAutoBid = {
                id: `bid-autobid-${Date.now()}`,
                bidder: user.name,
                amount: autoCounterAmount,
                time: 'Tự động trả giá',
                avatar: user.avatar
              };
              updatedBids = [userAutoBid, ...updatedBids];
              finalBidAmount = autoCounterAmount;
            }

            return {
              ...auc,
              currentBid: finalBidAmount,
              totalBids: auc.totalBids + updatedBids.length - auc.bids.length,
              bids: updatedBids
            };
          }
          return auc;
        })
      );

      // Notify user if outbid
      if (wasUserTop) {
        if (randomTarget.userAutoBidMax && randomTarget.userAutoBidMax >= botAmount + increment) {
          addToast(
            'AUTO-BID ĐÃ KÍCH HOẠT!',
            `Hệ thống tự động nâng giá lên $${(botAmount + increment).toLocaleString()} giữ vị trí Dẫn đầu trên ${randomTarget.title.substring(0, 20)}...`,
            'info'
          );
        } else {
          addToast(
            'CẢNH BÁO BỊ ĐÈ GIÁ!',
            `${chosenBot} vừa trả giá $${botAmount.toLocaleString()} trên ${randomTarget.title.substring(0, 25)}...`,
            'warning'
          );
        }
      }

    }, 14000);

    return () => clearInterval(simulatorInterval);
  }, [auctions, user]);

  // Filtered & Sorted Auctions
  const filteredAuctions = auctions.filter(auc => {
    // Category match
    if (activeCategory !== 'all' && auc.category !== activeCategory) return false;
    // Status / Watchlist match
    if (activeStatus === 'watchlist') {
      if (!watchlist.includes(auc.id)) return false;
    } else if (auc.status !== activeStatus) {
      return false;
    }
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = auc.title.toLowerCase().includes(q);
      const matchCategory = auc.categoryName.toLowerCase().includes(q);
      const matchSeller = auc.seller?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory && !matchSeller) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'endingSoon') return a.endTime - b.endTime;
    if (sortBy === 'highestBid') return b.currentBid - a.currentBid;
    if (sortBy === 'mostBids') return b.totalBids - a.totalBids;
    return 0;
  });

  const featuredAuction = auctions.find(a => a.featured) || auctions[0];

  return (
    <div className="min-h-screen relative flex flex-col justify-between">
      
      {/* Background Glowing Ambient Orbs */}
      <div className="bg-glow-container">
        <div className="bg-orb-1"></div>
        <div className="bg-orb-2"></div>
        <div className="bg-orb-[#06b6d4]"></div>
      </div>

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        user={user}
        onOpenCreateModal={() => requireAuth(() => setIsCreateModalOpen(true))}
        onOpenDashboardModal={() => requireAuth(() => setIsDashboardModalOpen(true))}
        unreadNotificationCount={toasts.length}
        onOpenDepositModal={() => requireAuth(() => setIsDepositModalOpen(true))}
        onOpenAuthModal={(tab) => {
          setAuthTab(tab);
          setIsAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Page Container */}
      <main className="app-container flex-1 py-6 space-y-8">
        
        {/* Hero Featured Live Auction */}
        {!searchQuery && activeCategory === 'all' && activeStatus === 'live' && featuredAuction && (
          <HeroFeatured
            auction={featuredAuction}
            onSelectAuction={(auc) => setSelectedAuction(auc)}
            onQuickBid={handlePlaceBid}
            isWatchlisted={watchlist.includes(featuredAuction.id)}
            onToggleWatchlist={handleToggleWatchlist}
          />
        )}

        {/* Auction Grid */}
        <AuctionGrid
          auctions={filteredAuctions}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          searchQuery={searchQuery}
          onSelectAuction={(auc) => setSelectedAuction(auc)}
          onQuickBid={handlePlaceBid}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
        />

      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-white/10 bg-[#0b0f17]/90 backdrop-blur-md py-8 text-gray-400 text-xs">
        <div className="app-container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-heading text-sm">AuraBid Luxury Vaults</span>
            <span>• Verified Real-Time Auction Engine</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#terms" className="hover:text-amber-400 transition-colors">Điều khoản đấu giá</a>
            <a href="#authenticity" className="hover:text-amber-400 transition-colors">Giám định & Bảo chứng</a>
            <a href="#security" className="hover:text-amber-400 transition-colors">Bảo mật Escrow</a>
          </div>
          <div>
            © 2026 AuraBid International. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
      {selectedAuction && (
        <AuctionDetailModal
          auction={selectedAuction}
          onClose={() => setSelectedAuction(null)}
          onPlaceBid={handlePlaceBid}
          onSetAutoBid={handleSetAutoBid}
          user={user}
          isWatchlisted={watchlist.includes(selectedAuction.id)}
          onToggleWatchlist={handleToggleWatchlist}
        />
      )}

      {isCreateModalOpen && (
        <CreateAuctionModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreateAuction={handleCreateAuction}
        />
      )}

      {isDashboardModalOpen && user && (
        <UserDashboardModal
          onClose={() => setIsDashboardModalOpen(false)}
          user={user}
          auctions={auctions}
          watchlist={watchlist}
          transactions={transactions}
          onOpenDepositModal={() => {
            setIsDashboardModalOpen(false);
            setIsDepositModalOpen(true);
          }}
          onSelectAuction={(auc) => setSelectedAuction(auc)}
          onLogout={handleLogout}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          onUpdateProfile={handleUpdateProfile}
          addToast={addToast}
        />
      )}

      {isDepositModalOpen && user && (
        <DepositModal
          onClose={() => setIsDepositModalOpen(false)}
          onDepositSuccess={handleDepositSuccess}
          onWithdrawSuccess={handleWithdrawSuccess}
          currentBalance={user.balance}
          addToast={addToast}
        />
      )}

      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
          initialTab={authTab}
          users={users}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      )}

      {isAdminModalOpen && (
        <AdminPanelModal
          onClose={() => setIsAdminModalOpen(false)}
          users={users}
          auctions={auctions}
          transactions={transactions}
          onUpdateUserRole={handleAdminUpdateUserRole}
          onUpdateUserBalance={handleAdminUpdateUserBalance}
          onToggleUserStatus={handleAdminToggleUserStatus}
          onToggleUserKyc={handleAdminToggleUserKyc}
          onDeleteAuction={handleAdminDeleteAuction}
          onEndAuctionEarly={handleAdminEndAuctionEarly}
          addToast={addToast}
        />
      )}

      {/* Notification Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
