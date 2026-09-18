import React, { useState } from 'react';
import { X, PlusCircle, Image as ImageIcon, DollarSign, Clock, Tag } from 'lucide-react';
import { CATEGORIES } from '../mockData';

export default function CreateAuctionModal({ onClose, onCreateAuction }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('watches');
  const [startingBid, setStartingBid] = useState('');
  const [bidIncrement, setBidIncrement] = useState('');
  const [durationHours, setDurationHours] = useState('24');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !startingBid || !image) {
      alert('Vui lòng điền đầy đủ Tên sản phẩm, Giá khởi điểm và Hình ảnh minh họa.');
      return;
    }

    const catObj = CATEGORIES.find(c => c.id === category) || CATEGORIES[1];

    const newAuction = {
      id: `auc-new-${Date.now()}`,
      title,
      category,
      categoryName: catObj.name,
      status: 'live',
      featured: false,
      startingBid: Number(startingBid),
      currentBid: Number(startingBid),
      bidIncrement: Number(bidIncrement) || 50,
      totalBids: 0,
      reserveMet: true,
      endTime: Date.now() + Number(durationHours) * 3600 * 1000,
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000',
      gallery: [image],
      seller: {
        name: "Alex Vance",
        rating: 5.0,
        verified: true,
        salesCount: 1
      },
      description: description || "Sản phẩm được niêm yết bởi người bán đã qua xác minh.",
      specification: [
        { label: "Trạng thái", value: "Niêm yết mới" },
        { label: "Nguồn gốc", value: "Chính hãng Verified" }
      ],
      bids: []
    };

    onCreateAuction(newAuction);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content max-w-2xl relative" onClick={(e) => e.stopPropagation()}>
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/80 border border-white/10 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading">Đăng Sản Phẩm Đấu Giá Mới</h2>
              <p className="text-xs text-gray-400">Niêm yết tài sản của bạn tới hàng triệu nhà sưu tầm trên toàn cầu</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            
            {/* Title Input */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold block">Tên Sản Phẩm / Vật Phẩm *</label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Đồng hồ Rolex Submariner Date 126610LN..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#101623] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Category Select & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Danh Mục Sản Phẩm</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#101623] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Thời Gian Diễn Ra (Giờ)</label>
                <select
                  value={durationHours}
                  onChange={(e) => setDurationHours(e.target.value)}
                  className="w-full bg-[#101623] border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="6">6 Giờ</option>
                  <option value="12">12 Giờ</option>
                  <option value="24">24 Giờ (1 Ngày)</option>
                  <option value="48">48 Giờ (2 Ngày)</option>
                  <option value="72">72 Giờ (3 Ngày)</option>
                </select>
              </div>
            </div>

            {/* Price Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Giá Khởi Điểm ($ USD) *</label>
                <input
                  type="number"
                  required
                  placeholder="5000"
                  value={startingBid}
                  onChange={(e) => setStartingBid(e.target.value)}
                  className="w-full bg-[#101623] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-300 font-semibold block">Bước Giá Tối Thúy ($ USD)</label>
                <input
                  type="number"
                  placeholder="100"
                  value={bidIncrement}
                  onChange={(e) => setBidIncrement(e.target.value)}
                  className="w-full bg-[#101623] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Image URL Input */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold block">Link Hình Ảnh Minh Họa (URL Image) *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/photo-..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full bg-[#101623] border border-white/15 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-gray-300 font-semibold block">Mô Tả Sản Phẩm & Tình Trạng</label>
              <textarea
                rows={3}
                placeholder="Mô tả chi tiết xuất xứ, chứng nhận giấy tờ đi kèm..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#101623] border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              ></textarea>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary text-xs py-2.5 px-5"
              >
                Hủy Bỏ
              </button>
              <button
                type="submit"
                className="btn-primary text-xs py-2.5 px-6"
              >
                Tạo Phân Đấu Giá Ngay
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}
