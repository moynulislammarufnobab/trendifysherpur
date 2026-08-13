import React from 'react';
import { CheckCircle, Download, X, Printer, PackageCheck, PhoneCall } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { useApp } from '../context/AppContext';

export const OrderConfirmationModal: React.FC = () => {
  const { currentOrderForConfirmation, setCurrentOrderForConfirmation, language, siteSettings } = useApp();

  if (!currentOrderForConfirmation) return null;

  const order = currentOrderForConfirmation;

  const generatePDFInvoice = () => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(10, 35, 66); // #0A2342
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(212, 175, 55); // #D4AF37
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TRENDIFY SHERPUR', 14, 22);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('Official Order Receipt & Invoice', 14, 30);

    doc.text(`Invoice ID: ${order.id}`, 140, 22);
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 140, 30);

    // Customer & Shipping Info
    doc.setTextColor(28, 28, 28);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Customer Information:', 14, 52);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${order.userName}`, 14, 60);
    doc.text(`Phone: ${order.userPhone}`, 14, 66);
    doc.text(`Delivery Area: ${order.shippingDetails.deliveryArea === 'inside' ? 'Inside Sherpur (Sadar)' : 'Outside Sherpur / All BD'}`, 14, 72);
    doc.text(`Address: ${order.shippingDetails.address}`, 14, 78);

    doc.setFont('helvetica', 'bold');
    doc.text('Payment Details:', 120, 52);
    doc.setFont('helvetica', 'normal');
    doc.text(`Method: ${order.paymentMethod.toUpperCase()}`, 120, 60);
    doc.text(`Payment Status: ${order.paymentStatus}`, 120, 66);
    if (order.trxId) {
      doc.text(`Sender Phone: ${order.senderPhone}`, 120, 72);
      doc.text(`TrxID: ${order.trxId}`, 120, 78);
    }

    // Items Table Header
    doc.setFillColor(240, 240, 240);
    doc.rect(14, 90, 182, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Item Title', 18, 96);
    doc.text('Qty', 120, 96);
    doc.text('Price', 145, 96);
    doc.text('Total', 175, 96);

    let y = 106;
    order.items.forEach(item => {
      doc.setFont('helvetica', 'normal');
      const truncatedTitle = item.title.length > 45 ? item.title.substring(0, 42) + '...' : item.title;
      doc.text(truncatedTitle, 18, y);
      doc.text(`${item.quantity}`, 120, y);
      doc.text(`BDT ${item.price}`, 145, y);
      doc.text(`BDT ${item.price * item.quantity}`, 175, y);
      y += 8;
    });

    // Summary
    y += 10;
    doc.line(14, y, 196, y);
    y += 10;
    doc.setFont('helvetica', 'normal');
    doc.text(`Subtotal: BDT ${order.subtotal}`, 135, y);
    y += 6;
    doc.text(`Shipping Fee: BDT ${order.shippingFee}`, 135, y);
    if (order.discountAmount > 0) {
      y += 6;
      doc.text(`Discount: -BDT ${order.discountAmount}`, 135, y);
    }
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Grand Total: BDT ${order.totalAmount}`, 135, y);

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for shopping with Trendify Sherpur!', 14, 270);
    doc.text(`Helpline: ${siteSettings.bkashNumber} | WhatsApp Support Available`, 14, 276);

    doc.save(`Invoice_${order.id}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 text-slate-900 dark:text-slate-100 text-center space-y-6">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner animate-bounce">
          <PackageCheck className="w-10 h-10" />
        </div>

        <div>
          <h3 className="text-2xl font-black text-[#0A2342] dark:text-[#E8C76A]">
            {language === 'bn' ? 'অর্ডার সফলভাবে সম্পন্ন হয়েছে!' : 'Order Placed Successfully!'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'শেরপুর সদরে আপনার ডেলিভারি প্রসেসিং শুরু হয়েছে।' : 'Your order is being processed for fast delivery.'}
          </p>
        </div>

        {/* Receipt Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-left space-y-2 text-xs">
          <div className="flex justify-between border-b dark:border-slate-700 pb-2">
            <span className="font-bold text-slate-500">Order ID:</span>
            <span className="font-mono font-black text-[#D4AF37]">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Order IP Address:</span>
            <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{order.ipAddress || 'Recorded'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Customer Name:</span>
            <span className="font-bold">{order.userName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Phone:</span>
            <span className="font-bold">{order.userPhone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Address:</span>
            <span className="font-bold text-right truncate max-w-[200px]">{order.shippingDetails.address}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-bold uppercase text-[#D4AF37]">{order.paymentMethod}</span>
          </div>
          {order.trxId && (
            <div className="flex justify-between">
              <span className="text-slate-500">TrxID:</span>
              <span className="font-mono font-bold text-[#D4AF37]">{order.trxId}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-black border-t dark:border-slate-700 pt-2 text-[#0A2342] dark:text-[#E8C76A]">
            <span>Total Amount:</span>
            <span>৳{order.totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={generatePDFInvoice}
            className="bg-[#0A2342] text-[#D4AF37] font-black py-3 px-4 rounded-2xl text-xs flex items-center justify-center space-x-1.5 shadow hover:bg-[#07182E]"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span>{language === 'bn' ? 'ইনভয়েস পিডিএফ নামান' : 'Download Invoice PDF'}</span>
          </button>

          <button
            onClick={() => setCurrentOrderForConfirmation(null)}
            className="bg-gradient-to-r from-[#D4AF37] to-[#E8C76A] text-[#0A2342] font-black py-3 px-4 rounded-2xl text-xs shadow hover:brightness-110"
          >
            {language === 'bn' ? 'কেনাকাটা চালিয়ে যান' : 'Continue Shopping'}
          </button>
        </div>
      </div>
    </div>
  );
};
