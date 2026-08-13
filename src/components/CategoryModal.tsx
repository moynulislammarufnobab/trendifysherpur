import React from 'react';
import { X, Grid, Watch, Headphones, Smartphone, Flame, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CategoryModal: React.FC = () => {
  const { 
    isCategoryModalOpen, 
    setIsCategoryModalOpen, 
    selectedCategory, 
    setSelectedCategory, 
    language,
    products 
  } = useApp();

  if (!isCategoryModalOpen) return null;

  const categories = [
    {
      id: 'all',
      nameEn: 'All Products',
      nameBn: 'সব পন্য',
      icon: Grid,
      color: 'from-amber-500 to-yellow-600',
      count: products.length,
    },
    {
      id: 'watch',
      nameEn: 'Smart Watches',
      nameBn: 'স্মার্ট ওয়াচ',
      icon: Watch,
      color: 'from-blue-500 to-indigo-600',
      count: products.filter(p => p.category === 'watch').length,
    },
    {
      id: 'gadgets',
      nameEn: 'Smart Gadgets',
      nameBn: 'স্মার্ট গ্যাজেট',
      icon: Headphones,
      color: 'from-purple-500 to-pink-600',
      count: products.filter(p => p.category === 'gadgets').length,
    },
    {
      id: 'electronics',
      nameEn: 'Electronics',
      nameBn: 'ইলেকট্রনিক্স',
      icon: Smartphone,
      color: 'from-cyan-500 to-blue-600',
      count: products.filter(p => p.category === 'electronics').length,
    },
    {
      id: 'shoes',
      nameEn: 'Shoes & Sneakers',
      nameBn: 'জুতা ও স্নিকার্স',
      icon: Flame,
      color: 'from-rose-500 to-red-600',
      count: products.filter(p => p.category === 'shoes').length,
    },
    {
      id: 'lifestyle',
      nameEn: 'Lifestyle',
      nameBn: 'লাইফস্টাইল',
      icon: ShoppingBag,
      color: 'from-emerald-500 to-teal-600',
      count: products.filter(p => p.category === 'lifestyle').length,
    },
  ];

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setIsCategoryModalOpen(false);
    setTimeout(() => {
      const grid = document.getElementById('products-grid');
      if (grid) {
        grid.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade-in">
      {/* Modal Card */}
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 bg-[#0A2342] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37]">
              <Grid className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'ক্যাটাগরি বাছাই করুন' : 'Select Category'}
              </h3>
              <p className="text-[11px] text-slate-300">
                {language === 'bn' ? 'আপনার পছন্দের ক্যাটাগরি পন্য ব্রাউজ করুন' : 'Browse products by category'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setIsCategoryModalOpen(false)}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Categories Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`relative p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between h-28 group ${
                    isSelected
                      ? 'border-[#D4AF37] bg-amber-50/70 dark:bg-slate-800 shadow-md ring-2 ring-[#D4AF37]/40'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:border-[#D4AF37]/50 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  {/* Category Header with Icon */}
                  <div className="flex items-center justify-between">
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#0A2342] flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Category Details */}
                  <div>
                    <h4 className={`text-xs font-bold ${isSelected ? 'text-[#0A2342] dark:text-[#D4AF37]' : 'text-slate-900 dark:text-white'}`}>
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {cat.count} {language === 'bn' ? 'টি পন্য' : 'items'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            onClick={() => handleSelectCategory('all')}
            className="text-xs font-bold text-[#0A2342] dark:text-[#D4AF37] hover:underline inline-flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'সব পন্য একসাথে দেখুন' : 'View All Products'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
