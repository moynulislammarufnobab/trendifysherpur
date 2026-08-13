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
  Save 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product, HeroBanner, Coupon, SiteSettings } from '../types';
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
    addProduct,
    updateProduct,
    deleteProduct,
    addBanner,
    deleteBanner,
    addCoupon,
    deleteCoupon,
    updateSiteSettings,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'kpi' | 'payments' | 'products' | 'banners' | 'coupons' | 'settings'>('kpi');

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
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
            <span>Verify Payments ({pendingPaymentsCount})</span>
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

          {/* TAB 2: MANUAL PAYMENT VERIFICATION */}
          {activeTab === 'payments' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-400">
                Customer Payment Verification Queue (bKash / Nagad TrxID)
              </h4>

              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b dark:border-slate-700 pb-2 gap-2">
                      <div>
                        <span className="text-xs font-mono font-black text-[#D4AF37]">Order: {order.id}</span>
                        <span className="ml-2 text-xs font-bold uppercase px-2 py-0.5 rounded bg-[#0A2342] text-white">{order.paymentMethod}</span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updatePaymentStatus(order.id, 'Approved')}
                          className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 hover:bg-emerald-700"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve Payment</span>
                        </button>

                        <button
                          onClick={() => updatePaymentStatus(order.id, 'Rejected')}
                          className="bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl flex items-center space-x-1 hover:bg-rose-700"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div><span className="text-slate-400">Customer:</span> <p className="font-bold">{order.userName}</p></div>
                      <div><span className="text-slate-400">Sender Phone:</span> <p className="font-mono font-bold text-[#D4AF37]">{order.senderPhone || 'N/A'}</p></div>
                      <div><span className="text-slate-400">TrxID:</span> <p className="font-mono font-bold text-[#D4AF37]">{order.trxId || 'N/A'}</p></div>
                      <div><span className="text-slate-400">Amount:</span> <p className="font-black">৳{order.totalAmount}</p></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400">No pending orders found.</p>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCT MANAGEMENT */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-bold uppercase text-slate-400">Manage Store Products</h4>
                <button
                  onClick={() => setShowAddProductModal(true)}
                  className="bg-[#0A2342] text-[#D4AF37] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center space-x-1 border border-[#D4AF37]/40"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
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
