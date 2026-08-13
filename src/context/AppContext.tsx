import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  ThemeMode, 
  Product, 
  CartItem, 
  Order, 
  HeroBanner, 
  Coupon, 
  Review, 
  SiteSettings, 
  UserProfile, 
  ShippingDetails, 
  PaymentMethod 
} from '../types';
import { 
  INITIAL_SITE_SETTINGS, 
  INITIAL_BANNERS, 
  INITIAL_COUPONS, 
  INITIAL_PRODUCTS, 
  INITIAL_REVIEWS 
} from '../lib/sampleData';
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  doc,
  getDoc,
  setDoc,
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc
} from '../lib/firebase';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  
  user: UserProfile | null;
  isAdmin: boolean;
  
  products: Product[];
  banners: HeroBanner[];
  coupons: Coupon[];
  reviews: Review[];
  siteSettings: SiteSettings;
  orders: Order[];
  
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  
  selectedProductForModal: Product | null;
  setSelectedProductForModal: (p: Product | null) => void;
  
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCategoryModalOpen: boolean;
  setIsCategoryModalOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isDashboardOpen: boolean;
  setIsDashboardOpen: (open: boolean) => void;
  isAdminPanelOpen: boolean;
  setIsAdminPanelOpen: (open: boolean) => void;
  
  currentOrderForConfirmation: Order | null;
  setCurrentOrderForConfirmation: (order: Order | null) => void;
  
  // Auth methods
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  
  // E-commerce methods
  placeOrder: (shipping: ShippingDetails, paymentMethod: PaymentMethod, senderPhone?: string, trxId?: string, couponCode?: string) => Promise<Order>;
  addReview: (productId: string, rating: number, comment: string, photo?: string, videoUrl?: string) => Promise<void>;
  
  // Admin management methods
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addBanner: (banner: Omit<HeroBanner, 'id'>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateOrderStatus: (orderId: string, orderStatus: Order['orderStatus']) => Promise<void>;
  updatePaymentStatus: (orderId: string, paymentStatus: Order['paymentStatus']) => Promise<void>;
  
  // Helpers
  t: (key: string) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('trendify_lang');
      return (saved === 'bn' || saved === 'en') ? saved : 'en';
    } catch {
      return 'en';
    }
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('trendify_theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  // Save language to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('trendify_lang', language);
    } catch (e) {
      console.error(e);
    }
  }, [language]);

  // Save theme and apply class
  useEffect(() => {
    try {
      localStorage.setItem('trendify_theme', theme);
    } catch (e) {
      console.error(e);
    }

    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
  }, [theme]);
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [orders, setOrders] = useState<Order[]>([]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('trendify_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('trendify_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [currentOrderForConfirmation, setCurrentOrderForConfirmation] = useState<Order | null>(null);

  // Sync Cart & Wishlist to localStorage
  useEffect(() => {
    localStorage.setItem('trendify_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trendify_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Firebase Auth Observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch or create user record in Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userSnap = await getDoc(userDocRef);
        
        let profileData: UserProfile;
        
        if (userSnap.exists()) {
          profileData = userSnap.data() as UserProfile;
        } else {
          // Generate unique referral code
          const refCode = 'SHERPUR-' + Math.random().toString(36).substring(2, 7).toUpperCase();
          const checkAdmin = firebaseUser.email === 'moynulislammaruf268@gmail.com' || firebaseUser.email?.includes('admin');
          profileData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Customer',
            referralCode: refCode,
            referralEarnings: 0,
            isAdmin: !!checkAdmin,
            createdAt: new Date().toISOString()
          };
          await setDoc(userDocRef, profileData);
        }
        
        setUser(profileData);
        setIsAdmin(profileData.isAdmin);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time collections
  useEffect(() => {
    // Products Listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const loaded: Product[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(loaded);
    }, (err) => console.log('Products listener:', err));

    // Banners Listener
    const unsubBanners = onSnapshot(collection(db, 'banners'), (snapshot) => {
      setBanners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroBanner)));
    }, (err) => console.log('Banners listener:', err));

    // Coupons Listener
    const unsubCoupons = onSnapshot(collection(db, 'coupons'), (snapshot) => {
      setCoupons(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Coupon)));
    }, (err) => console.log('Coupons listener:', err));

    // Site Settings Listener
    const unsubSettings = onSnapshot(collection(db, 'siteSettings'), (snapshot) => {
      if (!snapshot.empty) {
        const mainDoc = snapshot.docs[0];
        setSiteSettings(mainDoc.data() as SiteSettings);
      } else {
        setDoc(doc(db, 'siteSettings', 'config'), INITIAL_SITE_SETTINGS);
      }
    }, (err) => console.log('Settings listener:', err));

    // Reviews Listener
    const unsubReviews = onSnapshot(collection(db, 'reviews'), (snapshot) => {
      setReviews(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review)));
    }, (err) => console.log('Reviews listener:', err));

    // Orders Listener
    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const loaded: Order[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
      setOrders(loaded);
    }, (err) => console.log('Orders listener:', err));

    return () => {
      unsubProducts();
      unsubBanners();
      unsubCoupons();
      unsubSettings();
      unsubReviews();
      unsubOrders();
    };
  }, []);

  // Language translation dict
  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'bn' ? 'en' : 'bn'));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Translation function helper
  const t = (key: string): string => {
    const translations: Record<string, { bn: string; en: string }> = {
      brandName: { bn: 'ট্রেন্ডিফাই শেরপুর', en: 'Trendify Sherpur' },
      searchPlaceholder: { bn: 'শেরপুরে সেরা দামে ঘড়ি, গ্যাজেট ও ইলেকট্রনিক্স খুঁজুন...', en: 'Search watches, gadgets & electronics in Sherpur...' },
      flashSale: { bn: 'ফ্ল্যাশ সেল - বিশেষ ছাড়', en: 'Flash Sale - Huge Discounts' },
      endsIn: { bn: 'শেষ হতে বাকি:', en: 'Ends In:' },
      stockLeft: { bn: 'স্টক বাকি আছে:', en: 'Stock Left:' },
      onlyLeft: { bn: 'মাত্র বাকি ৩টি!', en: 'Only 3 left in stock!' },
      addToCart: { bn: 'কার্টে যোগ করুন', en: 'Add to Cart' },
      buyNow: { bn: 'এখনই কিনুন', en: 'Buy Now' },
      allCategories: { bn: 'সবক্যাটাগরি', en: 'All Categories' },
      watch: { bn: 'ঘড়ি (Watch)', en: 'Watches' },
      electronics: { bn: 'ইলেকট্রনিক্স', en: 'Electronics' },
      gadgets: { bn: 'স্মার্ট গ্যাজেট', en: 'Smart Gadgets' },
      shoes: { bn: 'জুতা ও স্নিকার্স', en: 'Shoes & Sneakers' },
      lifestyle: { bn: 'লাইফস্টাইল', en: 'General Lifestyle' },
      insideSherpur: { bn: 'শেরপুর সদরের ভেতরে (৳৬০)', en: 'Inside Sherpur (৳60)' },
      outsideSherpur: { bn: 'শেরপুরের বাইরে / অল বিডি (৳১২০)', en: 'Outside Sherpur (৳120)' },
      cod: { bn: 'ক্যাশ অন ডেলিভারি (COD)', en: 'Cash on Delivery (COD)' },
      bkash: { bn: 'বিকাশ পার্সোনাল (সেন্ড মানি)', en: 'bKash Personal (Send Money)' },
      nagad: { bn: 'নগদ পার্সোনাল (সেন্ড মানি)', en: 'Nagad Personal (Send Money)' },
      sendMoneyInstructions: { 
        bn: 'নিচের নম্বরে সেন্ড মানি করার পর প্রেরকের ফোন নম্বর ও Transaction ID (TrxID) ইনপুট দিন:', 
        en: 'Send money to the number below and enter Sender Phone & TrxID:' 
      },
      viewCart: { bn: 'কার্ট দেখুন', en: 'View Cart' },
      cartEmpty: { bn: 'আপনার কার্ট খালি আছে', en: 'Your cart is empty' },
      checkout: { bn: 'চেকআউট করুন', en: 'Proceed to Checkout' },
      myOrders: { bn: 'আমার অর্ডারসমূহ', en: 'My Orders' },
      adminPanel: { bn: 'অ্যাডমিন প্যানেল', en: 'Admin Panel' },
      referralTitle: { bn: 'রেফার করে আয় করুন', en: 'Refer & Earn Rewards' },
      authenticBadge: { bn: '১০০% অরিজিনাল পন্য', en: '100% Authentic Product' },
      returnBadge: { bn: '৭ দিনের ইজি রিটার্ন পলিসি', en: '7 Days Easy Return' },
    };

    if (translations[key]) {
      return translations[key][language];
    }
    return key;
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, {
          product,
          quantity,
          selectedColor: color || product.variants.colors[0],
          selectedSize: size || product.variants.sizes[0]
        }];
      }
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    setCart(prev => prev.filter(item => !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)));
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Auth Operations
  const loginWithEmail = async (e: string, p: string) => {
    await signInWithEmailAndPassword(auth, e, p);
  };

  const registerWithEmail = async (e: string, p: string, name: string) => {
    const cred = await createUserWithEmailAndPassword(auth, e, p);
    const refCode = 'SHERPUR-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    const newUserDoc: UserProfile = {
      uid: cred.user.uid,
      email: e,
      displayName: name,
      referralCode: refCode,
      referralEarnings: 0,
      isAdmin: e === 'moynulislammaruf268@gmail.com' || e.includes('admin'),
      createdAt: new Date().toISOString()
    };
    await setDoc(doc(db, 'users', cred.user.uid), newUserDoc);
    setUser(newUserDoc);
    setIsAdmin(newUserDoc.isAdmin);
  };

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setIsAdmin(false);
  };

  // Place Order
  const placeOrder = async (
    shipping: ShippingDetails, 
    paymentMethod: PaymentMethod, 
    senderPhone?: string, 
    trxId?: string, 
    couponCode?: string
  ): Promise<Order> => {
    const shippingFee = shipping.deliveryArea === 'inside' ? siteSettings.deliveryFeeInside : siteSettings.deliveryFeeOutside;
    
    // Check Coupon
    let discountAmount = 0;
    if (couponCode) {
      const activeCoupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active);
      if (activeCoupon && cartSubtotal >= activeCoupon.minSpend) {
        if (activeCoupon.discountType === 'percentage') {
          discountAmount = Math.round((cartSubtotal * activeCoupon.discountValue) / 100);
        } else {
          discountAmount = activeCoupon.discountValue;
        }
      }
    }

    const totalAmount = Math.max(0, cartSubtotal + shippingFee - discountAmount);
    const orderId = 'TS-' + Math.floor(100000 + Math.random() * 900000);

    const newOrder: Order = {
      id: orderId,
      userId: user?.uid || 'guest-' + Date.now(),
      userName: shipping.fullName,
      userEmail: user?.email || 'guest@trendifysherpur.com',
      userPhone: shipping.phone,
      shippingDetails: shipping,
      items: cart.map(item => ({
        productId: item.product.id,
        title: item.product.title,
        titleBn: item.product.titleBn,
        price: item.product.price,
        quantity: item.quantity,
        selectedColor: item.selectedColor,
        selectedSize: item.selectedSize,
        image: item.product.images[0] || '',
      })),
      subtotal: cartSubtotal,
      shippingFee,
      discountAmount,
      totalAmount,
      paymentMethod,
      senderPhone: senderPhone || '',
      trxId: trxId || '',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
      orderStatus: 'Pending',
      appliedCoupon: couponCode || '',
      referralCode: user?.referredBy || '',
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'orders', orderId), newOrder);
    clearCart();
    setCurrentOrderForConfirmation(newOrder);
    return newOrder;
  };

  // Reviews
  const addReview = async (productId: string, rating: number, comment: string, photo?: string, videoUrl?: string) => {
    const revId = 'rev-' + Date.now();
    const newRev: Review = {
      id: revId,
      productId,
      userId: user?.uid || 'guest',
      userName: user?.displayName || 'Customer',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
      rating,
      comment,
      photo,
      videoUrl,
      createdAt: new Date().toISOString().split('T')[0],
    };
    await setDoc(doc(db, 'reviews', revId), newRev);
  };

  // Admin Actions
  const addProduct = async (prodData: Omit<Product, 'id'>) => {
    const newId = 'prod-' + Date.now();
    const fullProd: Product = { ...prodData, id: newId };
    await setDoc(doc(db, 'products', newId), fullProd);
  };

  const updateProduct = async (id: string, prodData: Partial<Product>) => {
    await updateDoc(doc(db, 'products', id), prodData);
  };

  const deleteProduct = async (id: string) => {
    await deleteDoc(doc(db, 'products', id));
  };

  const addBanner = async (bannerData: Omit<HeroBanner, 'id'>) => {
    const newId = 'banner-' + Date.now();
    await setDoc(doc(db, 'banners', newId), { ...bannerData, id: newId });
  };

  const deleteBanner = async (id: string) => {
    await deleteDoc(doc(db, 'banners', id));
  };

  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const newId = 'coupon-' + Date.now();
    await setDoc(doc(db, 'coupons', newId), { ...couponData, id: newId });
  };

  const deleteCoupon = async (id: string) => {
    await deleteDoc(doc(db, 'coupons', id));
  };

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...settings };
    await setDoc(doc(db, 'siteSettings', 'config'), updated);
    setSiteSettings(updated);
  };

  const updateOrderStatus = async (orderId: string, orderStatus: Order['orderStatus']) => {
    await updateDoc(doc(db, 'orders', orderId), { orderStatus });
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: Order['paymentStatus']) => {
    await updateDoc(doc(db, 'orders', orderId), { paymentStatus });
  };

  return (
    <AppContext.Provider value={{
      language,
      setLanguage,
      toggleLanguage,
      theme,
      toggleTheme,
      user,
      isAdmin,
      products,
      banners,
      coupons,
      reviews,
      siteSettings,
      orders,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartSubtotal,
      cartCount,
      wishlist,
      toggleWishlist,
      isInWishlist,
      searchTerm,
      setSearchTerm,
      selectedCategory,
      setSelectedCategory,
      selectedProductForModal,
      setSelectedProductForModal,
      isCartOpen,
      setIsCartOpen,
      isCategoryModalOpen,
      setIsCategoryModalOpen,
      isCheckoutOpen,
      setIsCheckoutOpen,
      isAuthOpen,
      setIsAuthOpen,
      isDashboardOpen,
      setIsDashboardOpen,
      isAdminPanelOpen,
      setIsAdminPanelOpen,
      currentOrderForConfirmation,
      setCurrentOrderForConfirmation,
      loginWithEmail,
      registerWithEmail,
      loginWithGoogle,
      logout,
      placeOrder,
      addReview,
      addProduct,
      updateProduct,
      deleteProduct,
      addBanner,
      deleteBanner,
      addCoupon,
      deleteCoupon,
      updateSiteSettings,
      updateOrderStatus,
      updatePaymentStatus,
      t,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
