import React, { useState } from 'react';
import { Sparkles, ArrowUpDown, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const TrendingProducts: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchTerm, setSearchTerm, language } = useApp();
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');

  const categoryNames: Record<string, { bn: string; en: string }> = {
    watch: { bn: 'স্মার্ট ওয়াচ', en: 'Smart Watches' },
    gadgets: { bn: 'স্মার্ট গ্যাজেট', en: 'Smart Gadgets' },
    electronics: { bn: 'ইলেকট্রনিক্স', en: 'Electronics' },
    shoes: { bn: 'জুতা ও স্নিকার্স', en: 'Shoes & Sneakers' },
    lifestyle: { bn: 'লাইফস্টাইল', en: 'Lifestyle' },
  };

  // Filter products by category & search term
  let filtered = products.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const term = (searchTerm || '').trim().toLowerCase();
    const matchesSearch = !term || 
      (p.title && p.title.toLowerCase().includes(term)) || 
      (p.titleBn && p.titleBn.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term)) ||
      (p.descriptionBn && p.descriptionBn.toLowerCase().includes(term)) ||
      (p.category && p.category.toLowerCase().includes(term));
    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-high') {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered = [...filtered].sort((a, b) => b.rating - a.rating);
  }

  return (
    <section id="products-grid" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0A2342] dark:text-white flex items-center space-x-2">
            <span className="w-2.5 h-7 bg-[#D4AF37] rounded-full inline-block" />
            <span>{language === 'bn' ? 'ট্রেন্ডিং পন্যসমূহ' : 'Trending Products in Sherpur'}</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {language === 'bn' ? 'শেরপুরের সেরা মানের গ্যাজেট ও ফ্যাশন পন্য' : 'Handpicked high quality gadgets & fashion items'}
          </p>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center space-x-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-2xl text-xs font-semibold text-slate-700 dark:text-slate-200">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
          <select
            value={sortBy}
            onChange={(e: any) => setSortBy(e.target.value)}
            className="bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="default" className="dark:bg-slate-800">{language === 'bn' ? 'ডিফল্ট সাজানো' : 'Default Sorting'}</option>
            <option value="price-low" className="dark:bg-slate-800">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price-high" className="dark:bg-slate-800">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
            <option value="rating" className="dark:bg-slate-800">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rating'}</option>
          </select>
        </div>
      </div>

      {/* Active Category Indicator Badge */}
      {selectedCategory !== 'all' && (
        <div className="mb-5 flex items-center space-x-2 bg-amber-50 dark:bg-slate-800 border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-2xl text-xs w-fit shadow-sm">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            {language === 'bn' ? 'ফিল্টারড ক্যাটাগরি:' : 'Category Filter:'}
          </span>
          <span className="font-bold text-[#0A2342] dark:text-[#D4AF37]">
            {categoryNames[selectedCategory]?.[language] || selectedCategory}
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className="ml-1.5 text-slate-400 hover:text-rose-500 font-bold p-1 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700 transition-colors"
            title={language === 'bn' ? 'ফিল্টার তুলুন' : 'Clear Filter'}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Product Cards Grid: 2-col mobile / 4-col desktop */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 p-8">
          <Sparkles className="w-12 h-12 text-[#D4AF37] mx-auto mb-3 opacity-50" />
          <h4 className="text-base font-bold text-slate-800 dark:text-slate-200">
            {language === 'bn' ? 'কোন পন্য পাওয়া যায়নি' : 'No Products Found'}
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn' ? 'অন্য ক্যাটাগরি বা সার্চ টার্ম চেষ্টা করে দেখুন' : 'Try searching for a different item or category.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchTerm('');
            }}
            className="mt-4 bg-[#0A2342] text-[#D4AF37] text-xs font-bold px-4 py-2 rounded-xl"
          >
            {language === 'bn' ? 'সব পন্য দেখুন' : 'Show All Products'}
          </button>
        </div>
      )}
    </section>
  );
};
