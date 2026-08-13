import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Heart, 
  MapPin, 
  Share2, 
  Download, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Gift, 
  User, 
  LogOut 
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';
import { Order } from '../types';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const CustomerDashboard: React.FC = () => {
  const { 
    isDashboardOpen, 
    setIsDashboardOpen, 
    user, 
    logout, 
    orders, 
    wishlist, 
    products, 
    language,
    setSelectedProductForModal,
    siteSettings
  } = useApp();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'referral' | 'profile'>('orders');
  const [copiedRef, setCopiedRef] = useState(false);

  if (!isDashboardOpen) return null;

  const myOrders = orders.filter(o => o.userId === user?.uid || o.userEmail === user?.email);
  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Referral URL
  const referralUrl = `${window.location.origin}?ref=${user?.referralCode || 'SHERPUR'}`;

  const copyReferral = () => {
    navigator.clipboard.writeText(referralUrl);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const generatePDFInvoice = (order: Order) => {
    const doc = new jsPDF();

    doc.setFillColor(10, 35, 66);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(212, 175, 55);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TRENDIFY SHERPUR', 14, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Customer Invoice', 14, 30);
    doc.text(`Order ID: ${order.id}`, 140, 22);

    doc.setTextColor(28, 28, 28);
    doc.setFontSize(11);
    doc.text(`Customer: ${order.userName}`, 14, 55);
    doc.text(`Phone: ${order.userPhone}`, 14, 62);
    doc.text(`Status: ${order.orderStatus} (${order.paymentStatus})`, 14, 69);

    let y = 85;
    doc.text('Items Purchased:', 14, y);
    y += 8;

    order.items.forEach(item => {
      doc.text(`- ${item.title} (x${item.quantity}) : BDT ${item.price * item.quantity}`, 18, y);
      y += 6;
    });

    y += 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Grand Total: BDT ${order.totalAmount}`, 14, y);

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A2342] text-white px-6 py-4 flex justify-between items-center border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37] text-[#0A2342] font-black flex items-center justify-center text-lg">
              {user?.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-base font-bold">{user?.displayName || 'Customer'}</h3>
              <p className="text-[11px] text-[#E8C76A]">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={() => logout()}
              className="p-2 rounded-xl bg-rose-500/20 text-rose-300 hover:bg-rose-500 hover:text-white transition-all text-xs font-bold flex items-center space-x-1"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
            <button 
              onClick={() => setIsDashboardOpen(false)}
              className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 px-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'orders' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Package className="w-4 h-4 text-[#D4AF37]" />
            <span>{language === 'bn' ? `আমার অর্ডারসমূহ (${myOrders.length})` : `My Orders (${myOrders.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'wishlist' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>{language === 'bn' ? `উইশলিস্ট (${wishlistProducts.length})` : `Wishlist (${wishlistProducts.length})`}</span>
          </button>

          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-3 font-bold text-xs sm:text-sm flex items-center space-x-1.5 border-b-2 transition-all whitespace-nowrap ${
              activeTab === 'referral' ? 'border-[#D4AF37] text-[#0A2342] dark:text-[#E8C76A]' : 'border-transparent text-slate-500'
            }`}
          >
            <Gift className="w-4 h-4 text-[#D4AF37]" />
            <span>{language === 'bn' ? 'রেফার ও ইনকাম' : 'Referral Rewards'}</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {myOrders.length > 0 ? (
                myOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b dark:border-slate-700 pb-2 gap-2">
                      <div>
                        <span className="text-xs font-mono font-black text-[#D4AF37]">ID: {order.id}</span>
                        <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleString()}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                          order.orderStatus === 'Cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                        }`}>
                          Status: {order.orderStatus}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          order.paymentStatus === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          Payment: {order.paymentStatus}
                        </span>

                        <button
                          onClick={() => generatePDFInvoice(order)}
                          className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-[#D4AF37] hover:text-[#0A2342] transition-colors"
                          title="Download Invoice PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center space-x-3 text-xs">
                          <img src={cleanImageUrl(item.image)} alt={item.title} referrerPolicy="no-referrer" onError={handleImageError} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold truncate">{item.title}</h5>
                            <span className="text-[10px] text-slate-400">Qty: {item.quantity} x ৳{item.price}</span>
                          </div>
                          <span className="font-black text-[#D4AF37]">৳{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t dark:border-slate-700 text-xs font-black">
                      <span>Total Amount Paid:</span>
                      <span className="text-base text-[#0A2342] dark:text-[#E8C76A]">৳{order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-slate-400">
                  <Package className="w-12 h-12 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold">{language === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই' : 'You have no orders yet'}</p>
                </div>
              )}
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {wishlistProducts.map(prod => (
                <div key={prod.id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-center">
                  <img src={cleanImageUrl(prod.images[0])} alt={prod.title} referrerPolicy="no-referrer" onError={handleImageError} className="w-full aspect-square object-cover rounded-xl mb-2" />
                  <h5 className="text-xs font-bold line-clamp-1">{prod.title}</h5>
                  <p className="text-xs font-black text-[#D4AF37] my-1">৳{prod.price.toLocaleString()}</p>
                  <button
                    onClick={() => {
                      setIsDashboardOpen(false);
                      setSelectedProductForModal(prod);
                    }}
                    className="w-full bg-[#0A2342] text-[#D4AF37] text-[10px] font-bold py-1.5 rounded-lg"
                  >
                    View Product
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* REFERRAL TAB */}
          {activeTab === 'referral' && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0A2342] to-[#0E2F56] text-white border border-[#D4AF37]/40 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-[#0A2342] flex items-center justify-center font-black">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-black text-[#E8C76A]">
                    {language === 'bn' ? 'বন্ধু শেয়ার করুন ও পুরষ্কার জিতুন!' : 'Invite Friends & Earn Rewards'}
                  </h4>
                  <p className="text-xs text-slate-300">
                    {language === 'bn' ? 'আপনার ইউনিক রেফারেল কোড ব্যবহার করে বন্ধু অর্ডার করলে বিশেষ ক্যাশব্যাক পাবেন।' : 'Share your unique link and earn rewards on every completed order.'}
                  </p>
                </div>
              </div>

              {/* Referral Link Box */}
              <div className="p-3 rounded-2xl bg-white/10 border border-[#D4AF37]/30 flex items-center justify-between gap-2">
                <span className="text-xs font-mono truncate text-[#E8C76A]">{referralUrl}</span>
                <button
                  onClick={copyReferral}
                  className="bg-[#D4AF37] text-[#0A2342] text-xs font-black px-3 py-1.5 rounded-xl shrink-0 flex items-center space-x-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedRef ? 'Copied!' : 'Copy Link'}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-300">Your Referral Code</span>
                  <p className="text-sm font-mono font-black text-[#D4AF37]">{user?.referralCode || 'SHERPUR-777'}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <span className="text-[10px] uppercase text-slate-300">Total Rewards Earned</span>
                  <p className="text-sm font-black text-emerald-400">৳{user?.referralEarnings || 0}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
