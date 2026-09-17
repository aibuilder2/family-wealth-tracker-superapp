'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFamilyStore } from '@/lib/store/familyStore';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import {
  Utensils,
  ChefHat,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Send,
  MapPin,
  Phone,
  Clock,
  Sparkles,
  Search,
  CheckCircle2,
  ArrowRight,
  Receipt,
  X,
  CreditCard,
  Bike,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { KitchenBusinessProfile, KitchenMenuItem, KitchenDailyOrder } from '@/types';

function MenuContent() {
  const searchParams = useSearchParams();
  const kitchenParamId = searchParams.get('k');

  const { kitchenProfiles, addKitchenDailyOrder } = useFamilyStore();

  // Find targeted kitchen or default to first
  const activeKitchen: KitchenBusinessProfile | null = useMemo(() => {
    if (kitchenParamId) {
      const matched = kitchenProfiles.find(k => k.id === kitchenParamId);
      if (matched) return matched;
    }
    return kitchenProfiles[0] || null;
  }, [kitchenProfiles, kitchenParamId]);

  // Cart State: { [itemId: string]: { item: KitchenMenuItem; quantity: number } }
  const [cart, setCart] = useState<{ [itemId: string]: { item: KitchenMenuItem; quantity: number } }>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Checkout Fields
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');
  const [applyGst, setApplyGst] = useState(false);
  const [gstPercent, setGstPercent] = useState<number>(5);
  const [paymentMode, setPaymentMode] = useState<'cod' | 'upi'>('cod');
  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState('');

  // Sync initial GST settings from active kitchen if configured
  useEffect(() => {
    if (activeKitchen) {
      if (activeKitchen.enable_gst) {
        setApplyGst(true);
        setGstPercent(activeKitchen.gst_percentage || 5);
      }
    }
  }, [activeKitchen]);

  // Items from kitchen profile or demo fallback
  const menuItems: KitchenMenuItem[] = useMemo(() => {
    if (activeKitchen && activeKitchen.menu_items && activeKitchen.menu_items.length > 0) {
      return activeKitchen.menu_items;
    }
    // Fallback demo items if kitchen has no items
    return [
      {
        id: 'demo-1',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Special Dal-Tadka & Paneer Veg Thali',
        category: 'thali',
        price: 120,
        is_today_special: true,
        is_available: true,
        description: '4 Butter Tawa Roti, Shahi Paneer, Dal Tadka, Jeera Rice, Salad & Sweet'
      },
      {
        id: 'demo-2',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Gharelu Indori Poha & Jalebi Plate',
        category: 'nasta_snack',
        price: 45,
        is_today_special: true,
        is_available: true,
        description: 'Barik sev, pyaz, nimbu aur garam rasili jalebi'
      },
      {
        id: 'demo-3',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Ghar Ka Sada Tiffin (Daily Diet)',
        category: 'thali',
        price: 80,
        is_today_special: false,
        is_available: true,
        description: '4 Roti, 1 Hari Sabji, Dal, Chawal'
      },
      {
        id: 'demo-4',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Aloo Pyaz Paratha (2 Pcs)',
        category: 'roti_bread',
        price: 70,
        is_today_special: false,
        is_available: true,
        description: 'Taza makkhan, dahi aur hari chutney ke sath'
      },
      {
        id: 'demo-5',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Kadhai Paneer Masala (Full)',
        category: 'sabji',
        price: 140,
        is_today_special: false,
        is_available: true,
        description: 'Shimla mirch aur taza paneer gravy'
      },
      {
        id: 'demo-6',
        kitchen_id: activeKitchen?.id || 'demo',
        item_name: 'Gulab Jamun (2 Pieces)',
        category: 'dessert',
        price: 40,
        is_today_special: false,
        is_available: true,
        description: 'Shuddh desi ghee me bane garam gulab jamun'
      }
    ];
  }, [activeKitchen]);

  // Cart operations
  const handleAddToCart = (item: KitchenMenuItem) => {
    setCart(prev => {
      const current = prev[item.id];
      const newQty = (current?.quantity || 0) + 1;
      return {
        ...prev,
        [item.id]: { item, quantity: newQty }
      };
    });
  };

  const handleDecreaseQty = (itemId: string) => {
    setCart(prev => {
      const current = prev[itemId];
      if (!current) return prev;
      if (current.quantity <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return {
        ...prev,
        [itemId]: { ...current, quantity: current.quantity - 1 }
      };
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  // Cart Totals
  const cartItemsList = useMemo(() => Object.values(cart), [cart]);

  const totalItemCount = useMemo(() => {
    return cartItemsList.reduce((sum, entry) => sum + entry.quantity, 0);
  }, [cartItemsList]);

  const subtotal = useMemo(() => {
    return cartItemsList.reduce((sum, entry) => sum + (entry.item.price * entry.quantity), 0);
  }, [cartItemsList]);

  const gstAmount = useMemo(() => {
    if (!applyGst) return 0;
    return Math.round((subtotal * (gstPercent / 100)) * 100) / 100;
  }, [applyGst, gstPercent, subtotal]);

  const deliveryFee = useMemo(() => {
    if (deliveryType === 'pickup') return 0;
    return activeKitchen?.default_delivery_charge ?? 30;
  }, [deliveryType, activeKitchen]);

  const grandTotal = useMemo(() => {
    return Math.round((subtotal + gstAmount + deliveryFee) * 100) / 100;
  }, [subtotal, gstAmount, deliveryFee]);

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.item_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  // Categories list
  const categories = [
    { key: 'all', label: '🍽️ Sabhi (All)' },
    { key: 'thali', label: '🍛 Thali' },
    { key: 'sabji', label: '🥘 Sabji' },
    { key: 'roti_bread', label: '🫓 Roti / Paratha' },
    { key: 'rice', label: '🍚 Chawal' },
    { key: 'nasta_snack', label: '🥟 Nasta' },
    { key: 'dessert', label: '🍮 Meetha' },
    { key: 'beverage', label: '☕ Drinks' },
  ];

  // Submit Order via WhatsApp & Record in Kitchen
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItemsList.length === 0) return;
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Kripya apna naam aur phone number dalein.');
      return;
    }
    if (deliveryType === 'delivery' && !deliveryAddress.trim()) {
      alert('Delivery ke liye pata (address) likhna zaroori hai.');
      return;
    }

    const orderNum = `ORD-${Date.now().toString().slice(-4)}`;
    const itemsSummary = cartItemsList.map(ci => `${ci.quantity}x ${ci.item.item_name}`).join(', ');

    // 1. Auto-save in Kitchen Daily Orders if kitchen exists
    if (activeKitchen) {
      addKitchenDailyOrder(activeKitchen.id, {
        order_number: orderNum,
        date: new Date().toISOString().split('T')[0],
        time_slot: 'lunch',
        customer_name: customerName.trim(),
        customer_phone: customerPhone.trim(),
        delivery_address: deliveryType === 'delivery' ? deliveryAddress.trim() : 'Self Pickup / Counter',
        items_summary: itemsSummary,
        plate_count: totalItemCount,
        total_amount: grandTotal,
        payment_status: paymentMode === 'upi' ? 'paid' : 'pending_cod',
        source: 'whatsapp',
        order_type: deliveryType,
        subtotal: subtotal,
        gst_amount: gstAmount,
        delivery_charge: deliveryFee,
        special_notes: specialNotes.trim() || undefined,
        notes: `Order via Digital Menu (${deliveryType.toUpperCase()})`
      });
    }

    // 2. Format Beautiful WhatsApp Message
    const kitchenTitle = activeKitchen?.kitchen_name || 'Kitchen';
    let waMsg = `🛎️ *NAYA FOOD ORDER #${orderNum}* 🛎️\n`;
    waMsg += `🏪 *${kitchenTitle.toUpperCase()}*\n\n`;
    waMsg += `👤 *Grahak Ka Naam:* ${customerName.trim()}\n`;
    waMsg += `📱 *Phone:* ${customerPhone.trim()}\n`;
    waMsg += `🛵 *Order Mode:* ${deliveryType === 'delivery' ? 'Ghar/Office Delivery' : 'Self Pickup (Takeaway)'}\n`;
    if (deliveryType === 'delivery') {
      waMsg += `📍 *Delivery Pata:* ${deliveryAddress.trim()}\n`;
    }
    if (specialNotes.trim()) {
      waMsg += `📝 *Special Note:* ${specialNotes.trim()}\n`;
    }
    waMsg += `\n📋 *ITEMS ORDERED:*\n`;
    cartItemsList.forEach(ci => {
      waMsg += `• ${ci.quantity}x ${ci.item.item_name} - ₹${ci.item.price * ci.quantity}\n`;
    });

    waMsg += `\n💰 *BILL HISAB:*\n`;
    waMsg += `- Items Subtotal: ₹${subtotal.toFixed(2)}\n`;
    if (applyGst && gstAmount > 0) {
      waMsg += `- Food GST (${gstPercent}%): ₹${gstAmount.toFixed(2)}\n`;
    } else {
      waMsg += `- GST: Plain / Zero Tax Bill\n`;
    }
    if (deliveryType === 'delivery') {
      waMsg += `- Delivery Charge: ₹${deliveryFee.toFixed(2)}\n`;
    }
    waMsg += `---------------------------------\n`;
    waMsg += `⭐ *KUL RASHI (GRAND TOTAL): ₹${grandTotal.toFixed(2)}*\n`;
    waMsg += `💳 *Payment Mode:* ${paymentMode === 'upi' ? 'UPI / Online Payment' : 'Cash on Delivery (COD)'}\n\n`;
    waMsg += `Kripya mera order confirm karein aur delivery samay batayein! Dhanyawad 🙏`;

    const targetPhone = activeKitchen?.whatsapp_number || '919876543210';
    const cleanPhone = targetPhone.replace(/\D/g, '');
    const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;

    const waUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(waMsg)}`;

    setLastOrderNumber(orderNum);
    setOrderSubmitted(true);
    confetti({ particleCount: 60, spread: 70 });

    // Open WhatsApp
    window.open(waUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-paper text-ink font-sans pb-32">
      {/* Top Banner / Restaurant Info Header */}
      <header className="bg-gradient-to-b from-paper-sub to-paper border-b border-paper-dim sticky top-0 z-30 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gold/15 text-gold flex items-center justify-center shadow-xs shrink-0">
                <ChefHat size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-xl font-extrabold text-ink tracking-tight">
                    {activeKitchen?.kitchen_name || 'Annapurna Rasoi & Tiffin Service'}
                  </h1>
                  <span className="text-[10px] sm:text-xs px-2 py-0.5 rounded-full font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Pure Veg
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-ink-muted mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gold" />
                    {activeKitchen?.address_city || 'City Location'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone size={12} className="text-emerald-600" />
                    {activeKitchen?.whatsapp_number || '9876543210'}
                  </span>
                  {activeKitchen?.fssai_number && (
                    <span className="text-[11px] text-ink-muted font-mono bg-paper px-1.5 py-0.5 rounded border border-paper-dim">
                      FSSAI: {activeKitchen.fssai_number}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery vs Pickup Top Switcher */}
            <div className="bg-paper border border-paper-dim p-1 rounded-xl flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setDeliveryType('delivery')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  deliveryType === 'delivery'
                    ? 'bg-gold text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Bike size={13} />
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setDeliveryType('pickup')}
                className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1 ${
                  deliveryType === 'pickup'
                    ? 'bg-gold text-white shadow-xs'
                    : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Store size={13} />
                Pickup
              </button>
            </div>
          </div>

          {/* Live Search & Filter Bar */}
          <div className="mt-3 relative">
            <Search size={16} className="absolute left-3 top-2.5 text-ink-muted" />
            <input
              type="text"
              placeholder="Khana dhoondhein... (e.g. Paneer Thali, Roti, Poha, Dal)"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-paper border border-paper-dim text-xs sm:text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:border-gold shadow-xs"
            />
          </div>

          {/* Horizontal Category Scroll */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-1 no-scrollbar text-xs">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors border ${
                  selectedCategory === cat.key
                    ? 'bg-gold text-white border-gold shadow-xs'
                    : 'bg-paper text-ink-muted border-paper-dim hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Menu Listing */}
      <main className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-paper-sub rounded-2xl border border-paper-dim space-y-2">
            <Utensils size={32} className="mx-auto text-ink-muted" />
            <div className="text-sm font-semibold text-ink">Koi item nahi mila</div>
            <p className="text-xs text-ink-muted">Dusra naam search karein ya category filter change karein.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {filteredItems.map(item => {
              const inCart = cart[item.id];
              const qty = inCart?.quantity || 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    item.is_today_special
                      ? 'bg-amber-50/40 border-gold/40 shadow-xs'
                      : 'bg-paper border-paper-dim shadow-xs hover:border-gold/30'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-full border-2 border-emerald-600 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                          </span>
                          <h3 className="font-bold text-ink text-sm sm:text-base">{item.item_name}</h3>
                        </div>
                        {item.is_today_special && (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-gold text-white px-2 py-0.5 rounded-full font-semibold mt-1">
                            <Sparkles size={10} /> Aaj Ka Khas (Special)
                          </span>
                        )}
                      </div>
                      <div className="text-base sm:text-lg font-extrabold text-emerald-700 whitespace-nowrap">
                        ₹<Mono>{item.price}</Mono>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  {/* Add to Cart Stepper */}
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-paper-dim text-xs">
                    <span className="text-[11px] text-ink-muted uppercase font-medium">
                      {item.category.replace('_', ' ')}
                    </span>

                    {qty === 0 ? (
                      <Button
                        onClick={() => handleAddToCart(item)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-3.5 py-1 rounded-xl flex items-center gap-1 shadow-xs"
                      >
                        <Plus size={14} /> Add
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-300 rounded-xl px-2 py-0.5">
                        <button
                          type="button"
                          onClick={() => handleDecreaseQty(item.id)}
                          className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 font-bold"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-bold text-emerald-800 text-sm px-1.5">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-700 font-bold"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Bottom Cart Bar */}
      {totalItemCount > 0 && !isCartOpen && (
        <div className="fixed bottom-4 left-4 right-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom duration-200">
          <div className="bg-ink text-paper p-3.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 border border-ink/20">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gold/20 text-gold flex items-center justify-center font-bold text-sm">
                <ShoppingBag size={20} />
              </div>
              <div>
                <div className="text-xs text-paper-dim">
                  {totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'} chune gaye
                </div>
                <div className="text-base font-extrabold text-gold">
                  ₹<Mono>{subtotal.toLocaleString('en-IN')}</Mono>
                </div>
              </div>
            </div>

            <Button
              onClick={() => setIsCartOpen(true)}
              className="bg-gold hover:bg-gold/90 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              Cart & Bill Dekhein <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Slide-over / Modal Cart & Checkout Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 border-b border-paper-dim flex items-center justify-between bg-paper-sub">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="text-base font-bold text-ink">Aapka Order & Billing Hisab</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-paper-dim"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs sm:text-sm">
              {orderSubmitted ? (
                <div className="py-8 text-center space-y-3">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-lg font-bold text-ink">Order WhatsApp Par Bheja Gaya!</h3>
                  <p className="text-xs text-ink-muted max-w-xs mx-auto">
                    Order No: <span className="font-mono font-bold text-ink">{lastOrderNumber}</span>. Kitchen jaldi hi aapka order confirm karega.
                  </p>
                  <Button
                    onClick={() => {
                      setCart({});
                      setOrderSubmitted(false);
                      setIsCartOpen(false);
                    }}
                    className="bg-gold text-white text-xs mt-2"
                  >
                    Naya Order Banayein
                  </Button>
                </div>
              ) : (
                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  {/* Cart Items List */}
                  <div className="space-y-2 bg-paper-sub p-3 rounded-2xl border border-paper-dim">
                    <div className="text-xs font-bold text-ink flex items-center justify-between border-b border-paper-dim pb-1.5">
                      <span>Chune Gaye Items ({totalItemCount})</span>
                      <span className="text-ink-muted font-normal">Quantity badhayein ya ghatayein</span>
                    </div>

                    <div className="divide-y divide-paper-dim">
                      {cartItemsList.map(({ item, quantity }) => (
                        <div key={item.id} className="py-2 flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-bold text-ink">{item.item_name}</div>
                            <div className="text-[11px] text-ink-muted">
                              ₹{item.price} × {quantity} = <span className="font-semibold text-ink">₹{item.price * quantity}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <div className="flex items-center bg-paper border border-paper-dim rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleDecreaseQty(item.id)}
                                className="w-6 h-6 flex items-center justify-center text-ink hover:bg-paper-dim rounded-l-lg font-bold"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-xs">{quantity}</span>
                              <button
                                type="button"
                                onClick={() => handleAddToCart(item)}
                                className="w-6 h-6 flex items-center justify-center text-ink hover:bg-paper-dim rounded-r-lg font-bold"
                              >
                                +
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-rose-500 hover:text-rose-700 p-1"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Delivery vs Pickup Switcher */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryType('delivery')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                        deliveryType === 'delivery'
                          ? 'bg-gold/15 border-gold text-gold shadow-xs'
                          : 'bg-paper-sub border-paper-dim text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Bike size={18} />
                      Ghar / Office Delivery (+₹{activeKitchen?.default_delivery_charge ?? 30})
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryType('pickup')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-all ${
                        deliveryType === 'pickup'
                          ? 'bg-gold/15 border-gold text-gold shadow-xs'
                          : 'bg-paper-sub border-paper-dim text-ink-muted hover:text-ink'
                      }`}
                    >
                      <Store size={18} />
                      Self Pickup (Free / ₹0)
                    </button>
                  </div>

                  {/* Customer Information Form */}
                  <div className="space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-ink font-medium mb-1">Aapka Naam *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Ramesh Sharma"
                          value={customerName}
                          onChange={e => setCustomerName(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                        />
                      </div>
                      <div>
                        <label className="block text-ink font-medium mb-1">Mobile No. *</label>
                        <input
                          type="tel"
                          required
                          placeholder="9876543210"
                          value={customerPhone}
                          onChange={e => setCustomerPhone(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    {deliveryType === 'delivery' && (
                      <div>
                        <label className="block text-ink font-medium mb-1">Delivery Address & Landmark *</label>
                        <input
                          type="text"
                          required
                          placeholder="Flat no, building, landmark, road"
                          value={deliveryAddress}
                          onChange={e => setDeliveryAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-ink font-medium mb-1">Special Cooking Note (Khas Nirdesh)</label>
                      <input
                        type="text"
                        placeholder="e.g. Mirchi kam rakhna, dal me pyaz nahi, garam bhejna"
                        value={specialNotes}
                        onChange={e => setSpecialNotes(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                      />
                    </div>
                  </div>

                  {/* Billing Calculation Box with Optional GST Toggle */}
                  <div className="bg-paper-sub p-3 rounded-2xl border border-paper-dim space-y-2">
                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Items Subtotal</span>
                      <span className="font-bold text-ink">₹<Mono>{subtotal.toFixed(2)}</Mono></span>
                    </div>

                    {/* GST Option Toggle */}
                    <div className="flex items-center justify-between py-1 border-t border-b border-paper-dim">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="checkbox"
                          id="gstToggle"
                          checked={applyGst}
                          onChange={e => setApplyGst(e.target.checked)}
                          className="w-4 h-4 rounded text-gold focus:ring-gold"
                        />
                        <label htmlFor="gstToggle" className="text-ink font-medium cursor-pointer">
                          Food GST ({gstPercent}%)
                        </label>
                      </div>
                      <span className="font-mono text-ink">
                        {applyGst ? `+₹${gstAmount.toFixed(2)}` : 'Plain / No Tax (₹0)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-ink-muted">
                      <span>Delivery Charge</span>
                      <span className="font-mono text-ink">
                        {deliveryType === 'pickup' ? 'Free (Pickup)' : `+₹${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-base font-extrabold text-ink pt-1 border-t border-paper-dim">
                      <span>Kul Rashi (Grand Total)</span>
                      <span className="text-emerald-700 text-lg">
                        ₹<Mono>{grandTotal.toFixed(2)}</Mono>
                      </span>
                    </div>
                  </div>

                  {/* Payment Mode Selector */}
                  <div>
                    <label className="block text-ink font-medium mb-1">Bhugtan Ka Tarika (Payment)</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'cod' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-paper-sub border-paper-dim text-ink-muted'
                      }`}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMode === 'cod'}
                          onChange={() => setPaymentMode('cod')}
                          className="text-emerald-600"
                        />
                        <span className="font-semibold text-xs">💵 Cash On Delivery (COD)</span>
                      </label>

                      <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                        paymentMode === 'upi' ? 'bg-emerald-50 border-emerald-400 text-emerald-800' : 'bg-paper-sub border-paper-dim text-ink-muted'
                      }`}>
                        <input
                          type="radio"
                          name="pay"
                          checked={paymentMode === 'upi'}
                          onChange={() => setPaymentMode('upi')}
                          className="text-emerald-600"
                        />
                        <span className="font-semibold text-xs">📱 UPI Online Payment</span>
                      </label>
                    </div>

                    {paymentMode === 'upi' && activeKitchen?.upi_id && (
                      <div className="text-[11px] text-ink-muted bg-paper p-2 rounded-xl border border-paper-dim mt-1.5 flex items-center justify-between">
                        <span>UPI ID: <span className="font-mono font-bold text-ink">{activeKitchen.upi_id}</span></span>
                        <span className="text-emerald-600 font-medium">WhatsApp par QR milega</span>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp Order Action Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base py-3 rounded-2xl flex items-center justify-center gap-2 shadow-lg transition-all"
                    >
                      <Send size={18} />
                      WhatsApp Par Order Bhejein (₹{grandTotal.toFixed(2)})
                    </Button>
                    <div className="text-[11px] text-center text-ink-muted mt-1.5">
                      Yeh click karte hi order bill seedhe kitchen ke WhatsApp par bhej diya jayega.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CustomerMenuPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-ink-muted">Menu load ho raha hai...</div>}>
      <MenuContent />
    </Suspense>
  );
}
