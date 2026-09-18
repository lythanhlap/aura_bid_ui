import React from 'react';
import AuctionCard from './AuctionCard';
import { CATEGORIES } from '../mockData';
import { Sparkles, Watch, Car, Palette, Gem, Crown, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORY_ICONS = {
  Sparkles,
  Watch,
  Car,
  Palette,
  Gem,
  Crown
};

export default function AuctionGrid({
  auctions,
  activeCategory,
  setActiveCategory,
  activeStatus,
  setActiveStatus,
  sortBy,
  setSortBy,
  searchQuery,
  onSelectAuction,
  onQuickBid,
  watchlist,
  onToggleWatchlist
}) {
  return (
    <section className="py-8 space-y-6">
      
      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const IconComponent = CATEGORY_ICONS[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20 font-bold scale-102'
                  : 'bg-[#151d2a] text-gray-300 hover:text-white hover:bg-[#1c2738] border border-white/5'
              }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-amber-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar: Status Tabs & Sorting */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-[#151d2a]/80 p-3 rounded-2xl border border-white/10">
        
        {/* Status Tabs (Live / Upcoming / Ended) */}
        <div className="flex items-center gap-1 bg-[#0b0f17] p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setActiveStatus('live')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeStatus === 'live'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Đang Diễn Ra (LIVE)
          </button>
          <button
            onClick={() => setActiveStatus('upcoming')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeStatus === 'upcoming'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sắp Ra Mắt
          </button>
          <button
            onClick={() => setActiveStatus('watchlist')}
            className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeStatus === 'watchlist'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Đã Lưu ({watchlist.length})
          </button>
        </div>

        {/* Sorting Selection Dropdown */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <ArrowUpDown className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-gray-400 font-medium">Sắp xếp:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#0b0f17] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
          >
            <option value="endingSoon">Kết thúc sớm nhất</option>
            <option value="highestBid">Giá hiện tại cao nhất</option>
            <option value="mostBids">Nhiều lượt trả giá nhất</option>
          </select>
        </div>

      </div>

      {/* Results Header */}
      {searchQuery && (
        <div className="text-sm text-gray-400">
          Kết quả tìm kiếm cho: <strong className="text-amber-400">"{searchQuery}"</strong> ({auctions.length} kết quả)
        </div>
      )}

      {/* Auction Cards Grid */}
      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <AuctionCard
              key={auction.id}
              auction={auction}
              onSelectAuction={onSelectAuction}
              onQuickBid={onQuickBid}
              isWatchlisted={watchlist.includes(auction.id)}
              onToggleWatchlist={onToggleWatchlist}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <h3 className="text-lg font-bold text-white font-heading">Không tìm thấy vật phẩm phù hợp</h3>
          <p className="text-sm text-gray-400">
            Hãy thử tìm kiếm với từ khóa khác hoặc thay đổi bộ lọc danh mục.
          </p>
        </div>
      )}

    </section>
  );
}
