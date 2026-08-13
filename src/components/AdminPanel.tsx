import React, { useState } from 'react';
import { 
  X, 
  LayoutDashboard, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  Tag, 
  Image as ImageIcon, 
  Settings, 
  ShieldAlert, 
  Save,
  Globe,
  Copy,
  Search,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Package,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, HeroBanner, Coupon, SiteSettings, Order } from '../types';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const AdminPanel: React.FC = () => {
  const { 
    isAdminPanelOpen, 
    setIsAdminPanelOpen, 
    orders, 
    products, 
    banners, 
    coupons, 
    siteSettings, 
    updatePaymentStatus, 
    updateOrderStatus,
    deleteOrder,
    addProduct,
    updateProduct,
    deleteProduct,
    clearAllProducts,
    addBanner,
    deleteBanner,
    addCoupon,
    deleteCoupon,
    updateSiteSettings,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpi' | 'payments' | 'products' | 'banners' | 'coupons' | 'settings'>('kpi');

  // Search and Filter for Orders
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | Order['orderStatus']>('all');

  // New Product Form State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdTitleBn, setNewProdTitleBn] = useState('');
  const [newProdPrice, setNewProdPrice] = useState(1500);
  const [newProdOrigPrice, setNewProdOrigPrice] = useState(2200);
  const [newProdCategory, setNewProdCategory] = useState<'watch' | 'electronics' | 'gadgets' | 'shoes' | 'lifestyle'>('gadgets');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdStock, setNewProdStock] = useState(10);
  const [newProdIsFlash, setNewProdIsFlash] = useState(false);

  // New Banner Form State
  const [showAddBannerModal, setShowAddBannerModal] = useState(false);
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerSubtitle, setNewBannerSubtitle] = useState('');
  const [newBannerTag, setNewBannerTag] = useState<'Smart Choice' | 'Trendy Choice'>('Smart Choice');
  const [newBannerImage, setNewBannerImage] = useState('');

  // New Coupon Form State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');

  // Editable Site Settings
  const [editInsideFee, setEditInsideFee] = useState(siteSettings.deliveryFeeInside);
  const [editOutsideFee, setEditOutsideFee] = useState(siteSettings.deliveryFeeOutside);
  const [editBkash, setEditBkash] = useState(siteSettings.bkashNumber);
  const [editNagad, setEditNagad] = useState(siteSettings.nagadNumber);

  if (!isAdminPanelOpen) return null;

  // KPIs
  const totalSales = orders.filter(o => o.paymentStatus === 'Approved').reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingPaymentsCount = orders.filter(o => o.paymentStatus === 'Pending' && o.paymentMethod !== 'cod').length;

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdTitle || !newProdImage) return;

    await addProduct({
      title: newProdTitle,
      titleBn: newProdTitleBn || newProdTitle,
      price: Number(newProdPrice),
      originalPrice: Number(newProdOrigPrice),
      category: newProdCategory,
      images: [cleanImageUrl(newProdImage)],
      description: newProdDesc || 'Premium product available in Sherpur.',
      descriptionBn: newProdDesc || 'শেরপুরে দ্রুততম ডেলিভারিসহ প্রিমিয়াম পন্য।',
      inStock: true,
      stockCount: Number(newProdStock),
      isFlashSale: newProdIsFlash,
      variants: { colors: ['Standard'], sizes: ['Standard'] },
      rating: 5.0,
      reviewCount: 1,
    });

    setShowAddProductModal(false);
    setNewProdTitle('');
    setNewProdImage('');
  };

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle || !newBannerImage) return;

    await addBanner({
      title: newBannerTitle,
      titleBn: newBannerTitle,
      subtitle: newBannerSubtitle || 'Exclusive Offer in Sherpur',
      subtitleBn: 'শেরপুরে সেরা অফার',
      tag: newBannerTag,
      image: cleanImageUrl(newBannerImage),
      active: true,
    });

    setShowAddBannerModal(false);
    setNewBannerTitle('');
    setNewBannerImage('');
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode) return;

    await addCoupon({
      code: newCouponCode.toUpperCase(),
      discountType: newCouponType,
      discountValue: Number(newCouponValue),
      minSpend: 500,
      active: true,
    });

    setShowAddCouponModal(false);
    setNewCouponCode('');
  };

  const handleSaveSettings = async () => {
    await updateSiteSettings({
      deliveryFeeInside: Number(editInsideFee),
      deliveryFeeOutside: Number(editOutsideFee),
      bkashNumber: editBkash,
      nagadNumber: editNagad,
    });
    alert('Settings updated successfully!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A2342] text-white px-6 py-4 flex justify-between items-center border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-2">
            <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-black tracking-tight text-[#E8C76A]">
              Trendify Sherpur Admin Dashboard
            </h3>
          </div>
          <button 
            onClick={() => setIsAdminPanelOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Links */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('kpi')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'kpi' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <DollarSign className="w-4 h-4 text-emerald-500" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'payments' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Package className="w-4 h-4 text-amber-500" />
            <span>Orders & IP ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'products' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#D4AF37]" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'banners' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-500" />
            <span>Hero Banners</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'coupons' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Tag className="w-4 h-4 text-rose-500" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 whitespace-nowrap ${
              activeTab === 'settings' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Site Config</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: OVERVIEW KPI */}
          {activeTab === 'kpi' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[11px] font-bold uppercase text-emerald-600">Total Approved Sales</span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">৳{totalSales.toLocaleString()}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
                  <span className="text-[11px] font-bold uppercase text-amber-600">Total Orders</span>
                  <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{orders.length}</p>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[11px] font-bold uppercase text-rose-600">Pending Payments</span>
                  <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1">{pendingPaymentsCount}</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30">
                  <span className="text-[11px] font-bold uppercase text-indigo-600">Total Catalog Items</span>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">{products.length}</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS & CUSTOMER DETAILS (WITH IP ADDRESS) */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-400">
                    Customer Orders & IP Address Management
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    অর্ডারকারীর সব ডিটেইলস, ডেলিভারি ঠিকানা, আইপি এবং পেমেন্ট ভেরিফিকেশন।
                  </p>
                </div>

                {/* Filter & Search Bar */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-60">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search ID, Name, Phone, IP..."
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value as any)}
                    className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold focus:outline-none"
                  >
                    <option value="all">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Order Cards */}
              {(() => {
                const filtered = orders.filter(order => {
                  const matchTerm = 
                    order.id.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                    order.userName.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                    order.userPhone.toLowerCase().includes(orderSearchTerm.toLowerCase()) ||
                    (order.ipAddress && order.ipAddress.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
                    (order.trxId && order.trxId.toLowerCase().includes(orderSearchTerm.toLowerCase())) ||
                    (order.shippingDetails?.address && order.shippingDetails.address.toLowerCase().includes(orderSearchTerm.toLowerCase()));

                  const matchStatus = orderStatusFilter === 'all' || order.orderStatus === orderStatusFilter;

                  return matchTerm && matchStatus;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                      <Package className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                      <p className="text-xs font-bold text-slate-500">কোনো অর্ডার পাওয়া যায়নি। / No orders match your filter.</p>
                    </div>
                  );
                }

                return filtered.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 shadow-sm hover:border-[#D4AF37]/50 transition-colors">
                    
                    {/* Header Row */}
                    <div className="flex flex-col lg:flex-row justify-between lg:items-center border-b dark:border-slate-700 pb-3 gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-mono font-black text-[#D4AF37]">Order ID: {order.id}</span>
                          
                          {/* IP Address Badge */}
                          <div className="flex items-center space-x-1.5 bg-indigo-500/10 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[11px] font-mono px-2.5 py-1 rounded-lg border border-indigo-500/30">
                            <Globe className="w-3.5 h-3.5 text-indigo-500" />
                            <span className="font-bold">IP: {order.ipAddress || 'Not recorded'}</span>
                            <button
                              onClick={() => {
                                if (order.ipAddress) {
                                  navigator.clipboard.writeText(order.ipAddress);
                                  alert(`IP copied to clipboard: ${order.ipAddress}`);
                                }
                              }}
                              className="p-0.5 hover:text-indigo-900 dark:hover:text-white"
                              title="Copy IP Address"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>

                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#0A2342] text-white">
                            {order.paymentMethod}
                          </span>
                        </div>

                        <p className="text-[10px] text-slate-400">
                          Date: {new Date(order.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {/* Status & Actions Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order Status Selector */}
                        <div className="flex items-center space-x-1">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                          <select
                            value={order.orderStatus}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold px-2 py-1 focus:outline-none text-slate-800 dark:text-slate-200"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>

                        {/* Payment Status Buttons */}
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => updatePaymentStatus(order.id, 'Approved')}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors ${
                              order.paymentStatus === 'Approved' ? 'bg-emerald-600 text-white' : 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-600 hover:text-white'
                            }`}
                            title="Approve Payment"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>

                          <button
                            onClick={() => updatePaymentStatus(order.id, 'Rejected')}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center space-x-1 transition-colors ${
                              order.paymentStatus === 'Rejected' ? 'bg-rose-600 text-white' : 'bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white'
                            }`}
                            title="Reject Payment"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </div>

                        {/* Delete Order */}
                        <button
                          onClick={async () => {
                            if (confirm(`অর্ডারটি (${order.id}) কি মুছে ফেলতে চান?`)) {
                              await deleteOrder(order.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700/60">
                      
                      {/* Customer Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#D4AF37] block">Customer Details</span>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{order.userName}</p>
                        <p className="text-slate-600 dark:text-slate-300 flex items-center">
                          <Phone className="w-3 h-3 mr-1 text-slate-400" />
                          <span className="font-mono font-bold">{order.userPhone}</span>
                        </p>
                        <p className="text-slate-500 text-[11px] flex items-center truncate">
                          <Mail className="w-3 h-3 mr-1 text-slate-400" />
                          {order.userEmail}
                        </p>
                        <p className="text-[10px] text-slate-400">UID: <span className="font-mono">{order.userId}</span></p>
                      </div>

                      {/* Shipping Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#D4AF37] block">Delivery Address</span>
                        <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                          <MapPin className="w-3 h-3 inline mr-1 text-rose-500" />
                          {order.shippingDetails?.address || 'No address provided'}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Thana/District: <span className="font-semibold text-slate-700 dark:text-slate-300">{order.shippingDetails?.thana || 'N/A'}, {order.shippingDetails?.district || 'Sherpur'}</span>
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Area: <span className="font-bold text-slate-700 dark:text-slate-300">{order.shippingDetails?.deliveryArea === 'inside' ? 'Inside Sherpur Sadar' : 'Outside Sherpur'}</span>
                        </p>
                        {order.shippingDetails?.notes && (
                          <p className="text-[10px] italic text-amber-600 dark:text-amber-400">
                            Notes: {order.shippingDetails.notes}
                          </p>
                        )}
                      </div>

                      {/* Payment Info */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-[#D4AF37] block">Payment Info</span>
                        <p className="font-bold text-slate-800 dark:text-slate-200 uppercase">
                          Method: {order.paymentMethod}
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          Sender Phone: <span className="font-mono font-bold text-[#D4AF37]">{order.senderPhone || 'N/A'}</span>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300">
                          TrxID: <span className="font-mono font-bold text-[#D4AF37]">{order.trxId || 'N/A'}</span>
                        </p>
                        <p className="text-[11px]">
                          Payment Status: <span className={`font-bold ${order.paymentStatus === 'Approved' ? 'text-emerald-500' : order.paymentStatus === 'Rejected' ? 'text-rose-500' : 'text-amber-500'}`}>{order.paymentStatus}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items Table */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-black uppercase text-slate-400 block">Purchased Products ({order.items.length})</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center space-x-2.5 p-2 rounded-xl bg-white dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60 text-xs">
                            <img src={cleanImageUrl(item.image)} alt={item.title} referrerPolicy="no-referrer" onError={handleImageError} className="w-9 h-9 object-cover rounded-lg border border-slate-200 dark:border-slate-700" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold truncate text-slate-800 dark:text-slate-200">{item.title}</p>
                              <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                                <span>Qty: {item.quantity} x ৳{item.price}</span>
                                {item.selectedColor && <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Color: {item.selectedColor}</span>}
                                {item.selectedSize && <span className="bg-slate-100 dark:bg-slate-800 px-1 rounded">Size: {item.selectedSize}</span>}
                              </div>
                            </div>
                            <span className="font-black text-[#D4AF37]">৳{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2 border-t dark:border-slate-700 text-xs font-black text-slate-700 dark:text-slate-200 gap-1">
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                        <span>Subtotal: ৳{order.subtotal}</span>
                        <span>Delivery Fee: ৳{order.shippingFee}</span>
                        {order.discountAmount > 0 && <span className="text-emerald-600">Discount: -৳{order.discountAmount}</span>}
                      </div>

                      <div className="text-sm text-[#0A2342] dark:text-[#E8C76A] font-black">
                        Grand Total: ৳{order.totalAmount.toLocaleString()}
                      </div>
                    </div>

                  </div>
                ));
              })()}
            </div>
          )}

          {/* TAB 3: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-slate-400">Manage Store Products</h4>
                <div className="flex items-center space-x-2">
                  {products.length > 0 && (
                    <button
                      onClick={async () => {
                        if (confirm('সব প্রোডাক্ট মুছে ফেলতে চান? / Are you sure you want to delete all products?')) {
                          await clearAllProducts();
                        }
                      }}
                      className="bg-rose-600 text-white font-bold text-xs px-3 py-2 rounded-xl flex items-center space-x-1 hover:bg-rose-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete All ({products.length})</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="bg-[#0A2342] text-[#D4AF37] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 border border-[#D4AF37]/40"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Product</span>
                  </button>
                </div>
              </div>

              {/* Add Product Form Modal */}
              {showAddProductModal && (
                <form onSubmit={handleCreateProduct} className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-[#D4AF37]/40 space-y-3">
                  <h5 className="text-xs font-black uppercase text-[#0A2342] dark:text-[#E8C76A]">Add Product</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <input type="text" required placeholder="Title (EN)" value={newProdTitle} onChange={e => setNewProdTitle(e.target.value)} className="p-2 border rounded-xl" />
                    <input type="text" placeholder="Title (BN)" value={newProdTitleBn} onChange={e => setNewProdTitleBn(e.target.value)} className="p-2 border rounded-xl" />
                    <input type="number" required placeholder="Price (BDT)" value={newProdPrice} onChange={e => setNewProdPrice(Number(e.target.value))} className="p-2 border rounded-xl" />
                    <input type="number" required placeholder="Original Price" value={newProdOrigPrice} onChange={e => setNewProdOrigPrice(Number(e.target.value))} className="p-2 border rounded-xl" />
                    <input type="url" required placeholder="Image URL" value={newProdImage} onChange={e => setNewProdImage(e.target.value)} className="p-2 border rounded-xl col-span-2" />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={() => setShowAddProductModal(false)} className="px-3 py-1.5 text-xs border rounded-xl">Cancel</button>
                    <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-[#0A2342] text-[#D4AF37] rounded-xl">Save Product</button>
                  </div>
                </form>
              )}

              {/* Product List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map(p => (
                  <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={cleanImageUrl(p.images[0])} alt={p.title} referrerPolicy="no-referrer" onError={handleImageError} className="w-12 h-12 object-cover rounded-lg" />
                      <div>
                        <h5 className="text-xs font-bold truncate max-w-[180px]">{p.title}</h5>
                        <p className="text-xs font-black text-[#D4AF37]">৳{p.price}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteProduct(p.id)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BANNER MANAGER */}
          {activeTab === 'banners' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-slate-400">Hero Slider Manager</h4>
                <button onClick={() => setShowAddBannerModal(true)} className="bg-[#0A2342] text-[#D4AF37] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Add Slider Banner</span>
                </button>
              </div>

              {showAddBannerModal && (
                <form onSubmit={handleCreateBanner} className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border space-y-3">
                  <input type="text" required placeholder="Banner Title" value={newBannerTitle} onChange={e => setNewBannerTitle(e.target.value)} className="w-full p-2 text-xs border rounded-xl" />
                  <input type="url" required placeholder="Image URL" value={newBannerImage} onChange={e => setNewBannerImage(e.target.value)} className="w-full p-2 text-xs border rounded-xl" />
                  <button type="submit" className="px-4 py-2 text-xs font-bold bg-[#0A2342] text-[#D4AF37] rounded-xl">Save Banner</button>
                </form>
              )}

              <div className="space-y-2">
                {banners.map(b => (
                  <div key={b.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img src={cleanImageUrl(b.image)} alt={b.title} referrerPolicy="no-referrer" onError={handleImageError} className="w-16 h-10 object-cover rounded-lg" />
                      <span className="text-xs font-bold">{b.title}</span>
                    </div>
                    <button onClick={() => deleteBanner(b.id)} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-slate-400">Voucher & Coupon Codes</h4>
                <button onClick={() => setShowAddCouponModal(true)} className="bg-[#0A2342] text-[#D4AF37] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1">
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              {showAddCouponModal && (
                <form onSubmit={handleCreateCoupon} className="p-4 bg-amber-50 dark:bg-slate-800 rounded-2xl space-y-2">
                  <input type="text" required placeholder="Coupon Code (e.g. SHERPUR100)" value={newCouponCode} onChange={e => setNewCouponCode(e.target.value)} className="p-2 border rounded-xl text-xs uppercase" />
                  <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-[#0A2342] text-[#D4AF37] rounded-xl">Save Coupon</button>
                </form>
              )}

              <div className="grid grid-cols-2 gap-3">
                {coupons.map(c => (
                  <div key={c.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border flex items-center justify-between">
                    <div>
                      <span className="font-mono font-black text-[#D4AF37] text-sm">{c.code}</span>
                      <p className="text-[10px] text-slate-400">Value: {c.discountValue}{c.discountType === 'percentage' ? '%' : ' BDT'}</p>
                    </div>
                    <button onClick={() => deleteCoupon(c.id)} className="text-rose-500 p-1"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SITE CONFIG */}
          {activeTab === 'settings' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">Edit Delivery Charges & Gateways</h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block mb-1 font-bold">Inside Sherpur Fee (BDT)</label>
                  <input type="number" value={editInsideFee} onChange={e => setEditInsideFee(Number(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Outside Sherpur Fee (BDT)</label>
                  <input type="number" value={editOutsideFee} onChange={e => setEditOutsideFee(Number(e.target.value))} className="w-full p-2 border rounded-xl" />
                </div>
                <div>
                  <label className="block mb-1 font-bold">bKash Number</label>
                  <input type="text" value={editBkash} onChange={e => setEditBkash(e.target.value)} className="w-full p-2 border rounded-xl font-mono" />
                </div>
                <div>
                  <label className="block mb-1 font-bold">Nagad Number</label>
                  <input type="text" value={editNagad} onChange={e => setEditNagad(e.target.value)} className="w-full p-2 border rounded-xl font-mono" />
                </div>
              </div>

              <button onClick={handleSaveSettings} className="bg-[#0A2342] text-[#D4AF37] font-black py-2.5 px-6 rounded-xl text-xs flex items-center space-x-1 shadow">
                <Save className="w-4 h-4" />
                <span>Save Site Settings</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
