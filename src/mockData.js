// AuraBid Mock Data for Luxury Real-Time Auctions

export const INITIAL_USER = {
  name: "Alex Vance",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
  balance: 145850, // USD
  verified: true,
  role: "VIP Bidder"
};

export const CATEGORIES = [
  { id: "all", name: "Tất cả vật phẩm", icon: "Sparkles" },
  { id: "watches", name: "Đồng hồ xa xỉ", icon: "Watch" },
  { id: "automotive", name: "Siêu xe & Độc bản", icon: "Car" },
  { id: "art", name: "Nghệ thuật & NFT", icon: "Palette" },
  { id: "jewelry", name: "Trang sức & Kim cương", icon: "Gem" },
  { id: "antiques", name: "Cổ vật & Sưu tầm", icon: "Crown" }
];

export const INITIAL_AUCTIONS = [
  {
    id: "auc-1",
    title: "Patek Philippe Grandmaster Chime 6300G White Gold",
    category: "watches",
    categoryName: "Đồng hồ xa xỉ",
    status: "live", // live, upcoming, ended
    featured: true,
    startingBid: 2800000,
    currentBid: 3450000,
    bidIncrement: 50000,
    totalBids: 48,
    reserveMet: true,
    // End time 2 hours 45 mins from now
    endTime: Date.now() + (2 * 3600 + 45 * 60 + 15) * 1000,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Geneva Heritage Vaults",
      rating: 4.98,
      verified: true,
      salesCount: 142
    },
    description: "Siêu phẩm đồng hồ Patek Philippe 6300G chế tác bằng vàng trắng 18k nguyên khối. Đầy đủ chứng nhận authenticity chứng nhận bởi Geneva Seal. Một trong những kiệt tác phức tạp nhất thế giới với 20 chức năng cơ học.",
    specification: [
      { label: "Thương hiệu", value: "Patek Philippe" },
      { label: "Chất liệu vỏ", value: "White Gold 18K" },
      { label: "Bộ máy", value: "Manual Wind Caliber 300 GS AL 36-750 QIS FUS IRM" },
      { label: "Năm sản xuất", value: "2023" },
      { label: "Tình trạng", value: "Mới 100% Nguyên Hộp Certificate" }
    ],
    bids: [
      { id: "b1", bidder: "Lord Sterling", amount: 3450000, time: "2 phút trước", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" },
      { id: "b2", bidder: "Elena Rostova", amount: 3400000, time: "8 phút trước", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" },
      { id: "b3", bidder: "Kaito Tanaka", amount: 3350000, time: "15 phút trước", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150" },
      { id: "b4", bidder: "Lord Sterling", amount: 3300000, time: "30 phút trước", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" }
    ]
  },
  {
    id: "auc-2",
    title: "1962 Ferrari 250 GTO Scaglietti Berlinetta #3851GT",
    category: "automotive",
    categoryName: "Siêu xe & Độc bản",
    status: "live",
    featured: false,
    startingBid: 12000000,
    currentBid: 14800000,
    bidIncrement: 250000,
    totalBids: 32,
    reserveMet: true,
    endTime: Date.now() + (1 * 3600 + 12 * 60 + 40) * 1000,
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1000",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Maranello Classic Registry",
      rating: 5.0,
      verified: true,
      salesCount: 89
    },
    description: "Huyền thoại Ferrari 250 GTO 1962 với số khung #3851GT nổi tiếng. Đã qua kiểm định bảo tàng Ferrari Classiche. Động cơ V12 Colombo 3.0L sản sinh 300 mã lực.",
    specification: [
      { label: "Động cơ", value: "3.0L V12 Colombo 300HP" },
      { label: "Hộp số", value: "5-Speed Manual" },
      { label: "Số khung", value: "#3851GT Original" },
      { label: "Chứng nhận", value: "Ferrari Classiche Certified" }
    ],
    bids: [
      { id: "b20", bidder: "Scuderia Collector", amount: 14800000, time: "5 phút trước", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150" },
      { id: "b21", bidder: "Alex Vance", amount: 14550000, time: "22 phút trước", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150" }
    ]
  },
  {
    id: "auc-3",
    title: "Celestial Symphony #01 - Generative AI Art NFT 1/1",
    category: "art",
    categoryName: "Nghệ thuật & NFT",
    status: "live",
    featured: false,
    startingBid: 85000,
    currentBid: 142000,
    bidIncrement: 5000,
    totalBids: 61,
    reserveMet: true,
    endTime: Date.now() + (0 * 3600 + 18 * 60 + 50) * 1000, // Urgent ending under 20 mins!
    image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "CyberArt Atelier",
      rating: 4.92,
      verified: true,
      salesCount: 310
    },
    description: "Tác phẩm nghệ thuật thuật toán kỹ thuật số duy nhất 1/1. Đã mint trên mạng lưới Ethereum Blockchain đi kèm quyền sở hữu IP bản quyền gốc và bản in physical 8K Plexiglas.",
    specification: [
      { label: "Định dạng", value: "ERC-721 NFT + 8K Physical Acrylic Print" },
      { label: "Mạng lưới", value: "Ethereum Mainnet" },
      { label: "Độ phân giải gốc", value: "16384 x 16384 px" }
    ],
    bids: [
      { id: "b31", bidder: "CryptoWhale_99", amount: 142000, time: "1 phút trước", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150" },
      { id: "b32", bidder: "MetaGallery", amount: 137000, time: "4 phút trước", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150" }
    ]
  },
  {
    id: "auc-4",
    title: "10.42 Carat Vivid Royal Blue Sapphire Ring with Platinum",
    category: "jewelry",
    categoryName: "Trang sức & Kim cương",
    status: "live",
    featured: false,
    startingBid: 420000,
    currentBid: 580000,
    bidIncrement: 10000,
    totalBids: 19,
    reserveMet: true,
    endTime: Date.now() + (5 * 3600 + 10 * 60 + 0) * 1000,
    image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Tiffany & Gemology Guild",
      rating: 4.96,
      verified: true,
      salesCount: 75
    },
    description: "Viên Sapphire xanh hoàng gia 10.42 carat nguồn gốc Sri Lanka (Ceylon) nguyên bản không qua xử lý nhiệt. Đính kèm 2 viên kim cương baguette 1.2ct trên vỏ nhẫn Platinum 950.",
    specification: [
      { label: "Loại đá", value: "Natural Royal Blue Sapphire (Ceylon)" },
      { label: "Trọng lượng", value: "10.42 Carats" },
      { label: "Chứng thư GIA", value: "GIA Report #221849103" }
    ],
    bids: [
      { id: "b41", bidder: "Duchess de Valois", amount: 580000, time: "18 phút trước", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150" }
    ]
  },
  {
    id: "auc-5",
    title: "18th Century Dynasty Imperial Dragon Jade Seal",
    category: "antiques",
    categoryName: "Cổ vật & Sưu tầm",
    status: "live",
    featured: false,
    startingBid: 750000,
    currentBid: 920000,
    bidIncrement: 20000,
    totalBids: 27,
    reserveMet: true,
    endTime: Date.now() + (8 * 3600 + 30 * 60 + 0) * 1000,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Sotheby Asian Treasures",
      rating: 4.99,
      verified: true,
      salesCount: 205
    },
    description: "Ấn rồng ngọc bích triều đại nhà Thanh thế kỷ 18. Được chạm khắc từ khối ngọc bích Hetian tự nhiên quý hiếm, hoa văn rồng 5 móng biểu tượng cho quyền uy hoàng gia.",
    specification: [
      { label: "Chất liệu", value: "White Hetian Jade" },
      { label: "Niên đại", value: "Thế kỷ 18 (Càn Long)" },
      { label: "Chứng nhận", value: "Sotheby Antiquities Provenance" }
    ],
    bids: [
      { id: "b51", bidder: "Orient Collector", amount: 920000, time: "40 phút trước", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" }
    ]
  },
  {
    id: "auc-6",
    title: "Rolex Daytona 'Paul Newman' Ref. 6239 Steel",
    category: "watches",
    categoryName: "Đồng hồ xa xỉ",
    status: "upcoming", // upcoming auction
    featured: false,
    startingBid: 1500000,
    currentBid: 1500000,
    bidIncrement: 25000,
    totalBids: 0,
    reserveMet: false,
    endTime: Date.now() + (24 * 3600 + 0 * 60 + 0) * 1000,
    image: "https://images.unsplash.com/photo-1547996160-01c1782698e9?auto=format&fit=crop&q=80&w=1000",
    gallery: [
      "https://images.unsplash.com/photo-1547996160-01c1782698e9?auto=format&fit=crop&q=80&w=1000"
    ],
    seller: {
      name: "Geneva Vintage Time",
      rating: 4.95,
      verified: true,
      salesCount: 110
    },
    description: "Mẫu Rolex Daytona Paul Newman 6239 huyền thoại mặt số Exotic Dial nguyên bản sản xuất năm 1968.",
    specification: [
      { label: "Thương hiệu", value: "Rolex" },
      { label: "Mặt số", value: "Exotic Paul Newman Dial" },
      { label: "Năm", value: "1968" }
    ],
    bids: []
  }
];

export const INITIAL_USERS = [
  {
    id: "usr-1",
    name: "Alex Vance",
    email: "alex@aurabid.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
    balance: 145850,
    verified: true,
    role: "System Admin",
    status: "active",
    joinedDate: "2024-01-15",
    bio: "Nhà sưu tầm đồng hồ và cố vấn chiến lược tài sản số AuraBid."
  },
  {
    id: "usr-2",
    name: "Elena Rostova",
    email: "elena@aurabid.com",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250",
    balance: 285000,
    verified: true,
    role: "Diamond Collector",
    status: "active",
    joinedDate: "2024-03-20",
    bio: "Chuyên gia đấu giá đá quý và siêu xe cổ điển Monaco."
  },
  {
    id: "usr-3",
    name: "Lord Sterling",
    email: "sterling@aurabid.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250",
    balance: 95000,
    verified: true,
    role: "VIP Bidder",
    status: "active",
    joinedDate: "2024-05-10",
    bio: "Nhà đầu tư nghệ thuật đương đại và đồ cổ thế kỷ 18."
  },
  {
    id: "usr-4",
    name: "Kaito Tanaka",
    email: "kaito@aurabid.com",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250",
    balance: 340000,
    verified: true,
    role: "Verified Seller",
    status: "active",
    joinedDate: "2024-02-01",
    bio: "Đại diện Quỹ Di sản Nghệ thuật Tokyo Vault."
  }
];

export const INITIAL_TRANSACTIONS = [
  {
    id: "tx-101",
    userId: "usr-1",
    userName: "Alex Vance",
    type: "deposit",
    amount: 50000,
    status: "completed",
    date: "16/09/2026, 10:30:00",
    description: "Nạp tiền qua Ví Chuyển khoản QR Banking (VietQR)"
  },
  {
    id: "tx-102",
    userId: "usr-1",
    userName: "Alex Vance",
    type: "bid_hold",
    amount: 14550000,
    status: "completed",
    date: "17/09/2026, 14:15:00",
    description: "Đặt giá phiên 1962 Ferrari 250 GTO Scaglietti (#3851GT)"
  },
  {
    id: "tx-103",
    userId: "usr-2",
    userName: "Elena Rostova",
    type: "deposit",
    amount: 100000,
    status: "completed",
    date: "17/09/2026, 18:45:00",
    description: "Nạp tiền USDT Crypto Wallet (ERC-20)"
  }
];

const KEYS = {
  USERS: 'aurabid_users',
  CURRENT_USER: 'aurabid_current_user',
  AUCTIONS: 'aurabid_auctions',
  TRANSACTIONS: 'aurabid_txs'
};

export const getStoredUsers = () => {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
};

export const saveStoredUsers = (users) => {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.error("Failed to save users to localStorage", e);
  }
};

export const getStoredCurrentUser = () => {
  try {
    const data = localStorage.getItem(KEYS.CURRENT_USER);
    return data !== null ? JSON.parse(data) : INITIAL_USER;
  } catch {
    return INITIAL_USER;
  }
};

export const saveStoredCurrentUser = (user) => {
  try {
    if (user) {
      localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(KEYS.CURRENT_USER);
    }
  } catch (e) {
    console.error("Failed to save current user", e);
  }
};

export const getStoredAuctions = () => {
  try {
    const data = localStorage.getItem(KEYS.AUCTIONS);
    return data ? JSON.parse(data) : INITIAL_AUCTIONS;
  } catch {
    return INITIAL_AUCTIONS;
  }
};

export const saveStoredAuctions = (auctions) => {
  try {
    localStorage.setItem(KEYS.AUCTIONS, JSON.stringify(auctions));
  } catch (e) {
    console.error("Failed to save auctions", e);
  }
};

export const getStoredTransactions = () => {
  try {
    const data = localStorage.getItem(KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : INITIAL_TRANSACTIONS;
  } catch {
    return INITIAL_TRANSACTIONS;
  }
};

export const saveStoredTransactions = (txs) => {
  try {
    localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(txs));
  } catch (e) {
    console.error("Failed to save transactions", e);
  }
};

