import React from 'react';
import { Watch, Tv, Smartphone, Footprints, ShoppingBag, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const QuickCategories: React.FC = () => {
  const { language, selectedCategory, setSelectedCategory } = useApp();

  const categories = [
    { id: 'all', nameBn: 'সব পন্য', nameEn: 'All Items', icon: Sparkles, color: 'from-amber-500 to-yellow-600' },
    { id: 'watch', nameBn: 'স্মার্ট ওয়াচ', nameEn: 'Watches', icon: Watch, color: 'from-blue-600 to-indigo-800' },
    { id: 'gadgets', nameBn: 'স্মার্ট গ্যাজেট', nameEn: 'Gadgets', icon: Smartphone, color: 'from-purple-600 to-pink-700' },
    { id: 'electronics', nameBn: 'ইলেকট্রনিক্স', nameEn: 'Electronics', icon: Tv, color: 'from-emerald-600 to-teal-800' },
    { id: 'shoes', nameBn: 'জুতা ও স্নিকার্স', nameEn: 'Shoes', icon: Footprints, color: 'from-rose-600 to-orange-700' },
    { id: 'lifestyle', nameBn: 'লাইফস্টাইল', nameEn: 'Lifestyle', icon: ShoppingBag, color: 'from-cyan-600 to-blue-800' },
  ];

  return (
    <section id="categories-section" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base sm:text-xl font-black text-[#0A2342] dark:text-white flex items-center space-x-2">
          <span className="w-2 h-5 sm:w-2.5 sm:h-6 bg-[#D4AF37] rounded-full inline-block" />
          <span>{language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}</span>
        </h3>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                const grid = document.getElementById('products-grid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-300 active:scale-95 cursor-pointer ${
                isSelected
                  ? 'bg-[#0A2342] text-white shadow-lg scale-102 border-2 border-[#D4AF37]'
                  : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-amber-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 shadow-sm'
              }`}
            >
              <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md mb-1.5 sm:mb-2`}>
                <Icon className="w-4 h-4 sm:w-6 sm:h-6" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-center line-clamp-1 leading-tight">
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
