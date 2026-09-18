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
import LiveAuctionHallModal from './components/LiveAuctionHallModal';
import ToastContainer from './components/ToastContainer';
import {
  getStoredUsers,
  saveStoredUsers,
  getStoredCurrentUser,
  saveStoredCurrentUser,
  getStoredAuctions,
  saveStoredAuctions,
  getStoredTransactions,
  saveStoredTransactions,
  getStoredBidRequests,
  saveStoredBidRequests
} from './mockData';

export default function App() {
  // Persistent States
  const [users, setUsers] = useState(getStoredUsers);
  const [user, setUser] = useState(getStoredCurrentUser);
  const [auctions, setAuctions] = useState(getStoredAuctions);
  const [transactions, setTransactions] = useState(getStoredTransactions);
  const [bidRequests, setBidRequests] = useState(getStoredBidRequests);
  const [watchlist, setWatchlist] = useState(['auc-1', 'auc-3']);

  // UI Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStatus, setActiveStatus] = useState('live'); // live, upcoming, watchlist
  const [sortBy, setSortBy] = useState('endingSoon'); // endingSoon, highestBid, mostBids

  // Modals State
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [activeLiveHallAuction, setActiveLiveHallAuction] = useState(null);
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
      message: 'Sàn đấu giá trực tuyến cao cấp • Trải nghiệm Khán Phòng 3D Siêu Thực.',
      type: 'info'
    }
  ]);

  // Sync states to LocalStorage
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

  useEffect(() => {
    saveStoredBidRequests(bidRequests);
  }, [bidRequests]);

  const pendingRequestsCount = bidRequests.filter(r => r.status === 'pending').length;

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

  // Place Bid Action / Proxy Request
  const handlePlaceBid = (auctionIdInput, amount) => {
    if (!requireAuth(() => {}, 'login')) return;

    const auctionId = typeof auctionIdInput === 'object' ? auctionIdInput.id : auctionIdInput;
    const targetAuction = auctions.find(a => a.id === auctionId);

    if (!targetAuction) return;

    if (user.balance < amount) {
      addToast('Số Dư Ví Không Đủ!', `Bạn cần ít nhất $${amount.toLocaleString()} để đề xuất giá. Vui lòng Nạp Tiền thêm.`, 'warning');
      setIsDepositModalOpen(true);
      return;
    }

    const isAdmin = user.role === 'System Admin';

    if (isAdmin) {
      // Admin places bid directly under Admin identity
      executeDirectBid(auctionId, amount, `Admin (${user.name})`, user.avatar);
      addToast('Admin Đặt Giá Thành Công!', `Đã phát hành lượt đặt giá $${amount.toLocaleString()} trực tiếp trên khán phòng.`, 'success');
    } else {
      // Normal user: Create a pending Bid Request for Admin to approve (NOT displayed publicly until approved)
      const newRequest = {
        id: `req-${Date.now()}`,
        auctionId: targetAuction.id,
        auctionTitle: targetAuction.title,
        auctionImage: targetAuction.image,
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar,
        proposedAmount: amount,
        currentBidAtRequest: targetAuction.currentBid,
        status: 'pending',
        createdAt: new Date().toLocaleString('vi-VN'),
        note: `Ủy quyền Admin trả giá ${targetAuction.title.substring(0, 25)}...`
      };

      setBidRequests(prev => [newRequest, ...prev]);

      addToast(
        'ĐÃ GỬI YÊU CẦU CHO ADMIN!',
        `Yêu cầu đặt giá $${amount.toLocaleString()} đã chuyển tới Bục Admin. Sản phẩm giữ nguyên giá hiện tại cho đến khi Admin bấm Duyệt.`,
        'info'
      );
    }
  };

  // Helper to execute auction bid update directly
  const executeDirectBid = (auctionId, amount, bidderName, bidderAvatar) => {
    setAuctions(prevAuctions =>
      prevAuctions.map(auc => {
        if (auc.id === auctionId) {
          const newBid = {
            id: `bid-${Date.now()}`,
            bidder: bidderName,
            amount: amount,
            time: 'Vừa xong',
            avatar: bidderAvatar
          };

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

    if (selectedAuction && selectedAuction.id === auctionId) {
      setSelectedAuction(prev => ({
        ...prev,
        currentBid: amount,
        totalBids: prev.totalBids + 1,
        bids: [
          {
            id: `bid-${Date.now()}`,
            bidder: bidderName,
            amount: amount,
            time: 'Vừa xong',
            avatar: bidderAvatar
          },
          ...prev.bids
        ]
      }));
    }

    if (activeLiveHallAuction && activeLiveHallAuction.id === auctionId) {
      setActiveLiveHallAuction(prev => ({
        ...prev,
        currentBid: amount,
        totalBids: prev.totalBids + 1,
        bids: [
          {
            id: `bid-${Date.now()}`,
            bidder: bidderName,
            amount: amount,
            time: 'Vừa xong',
            avatar: bidderAvatar
          },
          ...prev.bids
        ]
      }));
    }
  };

  // Admin approves a pending bid request
  const handleApproveBidRequest = (requestId) => {
    const targetReq = bidRequests.find(r => r.id === requestId);
    if (!targetReq || targetReq.status !== 'pending') return;

    setBidRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'approved' } : r));

    const adminBidderName = `Admin Representative (Ủy quyền bởi ${targetReq.userName})`;
    const adminAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250";

    executeDirectBid(targetReq.auctionId, targetReq.proposedAmount, adminBidderName, adminAvatar);

    const bidTx = {
      id: `tx-${Date.now()}`,
      userId: targetReq.userId,
      userName: targetReq.userName,
      type: 'bid_hold',
      amount: targetReq.proposedAmount,
      status: 'completed',
      date: new Date().toLocaleString('vi-VN'),
      description: `Admin gõ búa duyệt & trả giá $${targetReq.proposedAmount.toLocaleString()} đại diện cho ${targetReq.userName}`
    };
    setTransactions(prev => [bidTx, ...prev]);

    addToast(
      '🔨 ĐÃ GÕ BÚA DUYỆT ĐẤU GIÁ!',
      `Đã phát hành lượt đặt giá $${targetReq.proposedAmount.toLocaleString()} dưới danh tính Admin đại diện cho ${targetReq.userName}`,
      'success'
    );
  };

  // Admin rejects a pending bid request
  const handleRejectBidRequest = (requestId) => {
    const targetReq = bidRequests.find(r => r.id === requestId);
    if (!targetReq || targetReq.status !== 'pending') return;

    setBidRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));

    addToast('Đã Từ Chối Yêu Cầu', `Yêu cầu trả giá của ${targetReq.userName} đã bị từ chối.`, 'warning');
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
    if (activeLiveHallAuction && activeLiveHallAuction.id === auctionId) {
      setActiveLiveHallAuction(null);
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

      const wasUserTop = user && randomTarget.bids[0]?.bidder.includes(user.name);

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

            let updatedBids = [botBid, ...auc.bids];
            let finalBidAmount = botAmount;

            if (user && auc.userAutoBidMax && auc.userAutoBidMax >= botAmount + increment && user.balance >= botAmount + increment) {
              const autoCounterAmount = botAmount + increment;
              const userAutoBid = {
                id: `bid-autobid-${Date.now()}`,
                bidder: `Admin Representative (Ủy quyền bởi ${user.name})`,
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
    if (activeCategory !== 'all' && auc.category !== activeCategory) return false;
    if (activeStatus === 'watchlist') {
      if (!watchlist.includes(auc.id)) return false;
    } else if (auc.status !== activeStatus) {
      return false;
    }
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
        pendingRequestsCount={pendingRequestsCount}
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
            onOpenLiveHall={(auc) => setActiveLiveHallAuction(auc)}
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
          onOpenLiveHall={(auc) => setActiveLiveHallAuction(auc)}
        />

      </main>

      {/* Luxury Footer */}
      <footer className="border-t border-white/10 bg-[#0b0f17]/90 backdrop-blur-md py-8 text-gray-400 text-xs">
        <div className="app-container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold font-heading text-sm">AuraBid Luxury Vaults</span>
            <span>• Live VIP Virtual 3D Auction Stage Engine</span>
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

      {activeLiveHallAuction && (
        <LiveAuctionHallModal
          auction={activeLiveHallAuction}
          onClose={() => setActiveLiveHallAuction(null)}
          user={user}
          users={users}
          bidRequests={bidRequests}
          onPlaceBid={handlePlaceBid}
          onApproveBidRequest={handleApproveBidRequest}
          onRejectBidRequest={handleRejectBidRequest}
          addToast={addToast}
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
          bidRequests={bidRequests}
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
          bidRequests={bidRequests}
          onUpdateUserRole={handleAdminUpdateUserRole}
          onUpdateUserBalance={handleAdminUpdateUserBalance}
          onToggleUserStatus={handleAdminToggleUserStatus}
          onToggleUserKyc={handleAdminToggleUserKyc}
          onDeleteAuction={handleAdminDeleteAuction}
          onEndAuctionEarly={handleAdminEndAuctionEarly}
          onApproveBidRequest={handleApproveBidRequest}
          onRejectBidRequest={handleRejectBidRequest}
          addToast={addToast}
        />
      )}

      {/* Notification Toast Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

    </div>
  );
}
