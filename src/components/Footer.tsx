import React from 'react';
import { 
  MapPin, 
  Mail, 
  Phone, 
  Facebook,
  ArrowUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { siteSettings, setSelectedCategory } = useApp();

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#06182E] text-slate-200 pt-10 pb-28 md:pb-12 border-t border-[#D4AF37]/30">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 space-y-8">
        
        {/* Brand & Description Section */}
        <div className="space-y-4">
          {/* Logo & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl border-2 border-[#D4AF37] bg-[#0A2342] flex items-center justify-center shadow-lg">
              <span className="text-[#D4AF37] font-black text-xl tracking-wider">TS</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight text-white">
                Trendify <span className="text-[#D4AF37]">Sherpur</span>
              </h2>
              <p className="text-[10px] font-extrabold text-[#D4AF37] tracking-widest uppercase">
                SMART CHOICE, TRENDY CHOICE
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl font-normal">
            Sherpur Sadar's premier luxury e-commerce destination. Inspired by the sleekness of Apple, the scale of Amazon, and the localization of Daraz.
          </p>

          {/* Contact Details */}
          <div className="space-y-2 text-xs font-medium text-slate-200 pt-1">
            <div className="flex items-center space-x-2.5">
              <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>Sherpur Sadar, Sherpur, Bangladesh</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="mailto:trendifysherpur@gmail.com" className="hover:text-[#D4AF37] transition-colors">
                trendifysherpur@gmail.com
              </a>
            </div>
            <div className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <a href="https://wa.me/18152349976" target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">
                WhatsApp: +18152349976
              </a>
            </div>
          </div>

          {/* Official Facebook Page Button */}
          <div className="pt-2">
            <a 
              href={siteSettings.facebookUrl || "https://www.facebook.com/share/1LptghxXW8/"} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold shadow-md transition-transform active:scale-95"
            >
              <Facebook className="w-4 h-4 fill-white text-[#1877F2]" />
              <span>Official Facebook Page</span>
            </a>
          </div>
        </div>

        {/* TOP DEPARTMENTS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
            TOP DEPARTMENTS
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li>
              <button onClick={() => handleCategoryClick('electronics')} className="hover:text-[#D4AF37] transition-colors text-left">
                Electronics & TVs
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('gadgets')} className="hover:text-[#D4AF37] transition-colors text-left">
                Apple & Android Gadgets
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('watch')} className="hover:text-[#D4AF37] transition-colors text-left">
                Luxury Watches
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('shoes')} className="hover:text-[#D4AF37] transition-colors text-left">
                Premium Sneakers & Shoes
              </button>
            </li>
            <li>
              <button onClick={() => handleCategoryClick('lifestyle')} className="hover:text-[#D4AF37] transition-colors text-left">
                Men's Silk & Panjabi
              </button>
            </li>
          </ul>
        </div>

        {/* STORE GOVERNANCE */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
            STORE GOVERNANCE
          </h3>
          <div className="space-y-2 text-xs text-slate-300 font-normal leading-relaxed">
            <p><span className="font-bold text-slate-100">Owner:</span> Moynul Islam Maruf (Nobab)</p>
            <p><span className="font-bold text-slate-100">Hub Location:</span> Sherpur Sadar</p>
            <p><span className="font-bold text-slate-100">District Coverage:</span> Nalitabari, Nakla, Sreebardi, Jhenaigati</p>
            <p><span className="font-bold text-slate-100">Delivery:</span> সারা বাংলাদেশ হোম ডেলিভারি (Nationwide Home Delivery)</p>
            <p><span className="font-bold text-slate-100">Support Hours:</span> 24/7 Online Support</p>
          </div>
        </div>

        {/* PAYMENT PARTNERS */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-[#D4AF37] uppercase tracking-wider">
            PAYMENT PARTNERS
          </h3>
          <p className="text-xs text-slate-300">
            Instant automatic TrxID verification for bKash & Nagad Send Money.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="px-4 py-1.5 rounded-xl bg-[#E2136E] text-white text-xs font-bold shadow-sm">
              bKash
            </span>
            <span className="px-4 py-1.5 rounded-xl bg-[#F7931E] text-white text-xs font-bold shadow-sm">
              Nagad
            </span>
            <span className="px-4 py-1.5 rounded-xl bg-[#D4AF37] text-[#0A2342] text-xs font-black shadow-sm">
              COD
            </span>
          </div>
        </div>

        {/* Bottom Copyright & Back to top Section */}
        <div className="pt-8 border-t border-[#D4AF37]/20 flex flex-col items-center justify-center text-center space-y-4">
          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            © 2026 <span className="font-bold text-[#D4AF37]">Trendify Sherpur</span>. All Rights Reserved. Founded by <span className="font-bold text-slate-100">Moynul Islam Maruf (Nobab)</span>.
          </p>

          <button 
            onClick={scrollToTop}
            className="inline-flex items-center space-x-1.5 px-6 py-2.5 rounded-full bg-[#06182E] border border-[#D4AF37]/60 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#0A2342] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>

      </div>
    </footer>
  );
};

