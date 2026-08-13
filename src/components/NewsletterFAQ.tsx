import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Mail, HelpCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NewsletterFAQ: React.FC = () => {
  const { language } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const faqs = [
    {
      qBn: 'শেরপুর সদরে কত সময়ে ডেলিভারি পাওয়া যায়?',
      qEn: 'How fast is delivery in Sherpur?',
      aBn: 'শেরপুর সদরের ভেতরে মাত্র ২৪ থেকে ৪৮ ঘণ্টার মধ্যে ক্যাশ অন ডেলিভারিতে হোম ডেলিভারি দেওয়া হয়। ডেলিভারি চার্জ মাত্র ৬০ টাকা।',
      aEn: 'Home delivery inside Sherpur Sadar is completed within 24-48 hours. Delivery charge is ৳60.'
    },
    {
      qBn: 'পেমেন্ট কিভাবে করতে হয়?',
      qEn: 'What payment methods are available?',
      aBn: 'আপনি ক্যাশ অন ডেলিভারি (COD) ছাড়াও বিকাশ পার্সোনাল (01954833730) এবং নগদ পার্সোনাল (01954833730) এর মাধ্যমে সেন্ড মানি করে পেমেন্ট করতে পারবেন।',
      aEn: 'We support Cash on Delivery (COD) as well as bKash Personal (01954833730) and Nagad Personal (01954833730) Send Money.'
    },
    {
      qBn: 'পন্য পছন্দ না হলে কি রিটার্ন করা যাবে?',
      qEn: 'What is the return policy?',
      aBn: 'জি! কোনো পন্যে ট্রুটি থাকলে বা ডেলিভারির সময় দেখে পছন্দ না হলে ৭ দিনের মধ্যে সহজ রিটার্ন সুবিধা রয়েছে (টার্মস সাপেক্ষে)।',
      aEn: 'Yes, we offer a 7-day easy return policy if there are any defects or issues with your item.'
    },
    {
      qBn: 'অর্ডার ট্র্যাকিং ও বিকাশ পেমেন্ট ট্র্যাকিং কিভাবে চেক করব?',
      qEn: 'How to check order and payment status?',
      aBn: 'অর্ডার করার পর আপনার ড্যাশবোর্ড থেকে রিয়েল-টাইমে স্ট্যাটাস (পেন্ডিং, প্রসেসিং, শিপড, ডেলিভারড) চেক করতে পারবেন। বিকাশ/নগদ TrxID অ্যাপ্রুভ হলেই স্ট্যাটাস আপডেট হবে।',
      aEn: 'You can track order status (Pending, Processing, Shipped, Delivered) in real-time from your Customer Dashboard.'
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput('');
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* FAQ Accordion Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center space-x-2 mb-6">
          <HelpCircle className="w-6 h-6 text-[#D4AF37]" />
          <h3 className="text-xl sm:text-2xl font-black text-[#0A2342] dark:text-white">
            {language === 'bn' ? 'সাধারণ জিজ্ঞাসা (FAQ)' : 'Frequently Asked Questions'}
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left font-bold text-sm sm:text-base text-slate-800 dark:text-slate-100 flex justify-between items-center bg-slate-50 dark:bg-slate-800/80 hover:bg-amber-50 dark:hover:bg-slate-700/50"
                >
                  <span>{language === 'bn' ? faq.qBn : faq.qEn}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-[#D4AF37]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {isOpen && (
                  <div className="p-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                    {language === 'bn' ? faq.aBn : faq.aEn}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter Box */}
      <div className="bg-gradient-to-r from-[#0A2342] via-[#0E2F56] to-[#0A2342] rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/40 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div className="max-w-xl">
          <div className="flex items-center space-x-2 text-[#D4AF37] font-bold text-xs uppercase mb-2">
            <Mail className="w-4 h-4" />
            <span>{language === 'bn' ? 'ডিসকাউন্ট আপডেট পান' : 'Stay Updated'}</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {language === 'bn' ? 'শেরপুরের স্পেশাল অফার ও ফ্ল্যাশ সেলের খবর পেতে সাবস্ক্রাইব করুন' : 'Subscribe for Sherpur Exclusive Offers'}
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            {language === 'bn' ? 'নতুন পন্যের রিলিজ ও কুপন কোড সরাসরি ইমেইলে পান।' : 'Get secret coupon codes and instant deal notifications.'}
          </p>
        </div>

        {subscribed ? (
          <div className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-xs text-center animate-fadeIn">
            ✓ {language === 'bn' ? 'ধন্যবাদ! আপনি সফলভাবে সাবস্ক্রাইব করেছেন।' : 'Thank you for subscribing!'}
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto items-center space-x-2">
            <input 
              type="email" 
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder={language === 'bn' ? 'আপনার ইমেইল এড্রেস দিন...' : 'Enter your email...'}
              className="bg-[#0E2F56] border border-[#D4AF37]/40 text-white placeholder-slate-400 text-xs px-4 py-3 rounded-2xl focus:outline-none focus:border-[#D4AF37] w-full md:w-64"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-[#D4AF37] to-[#E8C76A] text-[#0A2342] font-black px-5 py-3 rounded-2xl text-xs flex items-center space-x-1 shrink-0 shadow-lg hover:brightness-110"
            >
              <span>{language === 'bn' ? 'জয়ন' : 'Subscribe'}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
