'use client';

import Link from 'next/link';

import React, { useState, useMemo } from 'react';
import { useFamilyStore } from '@/lib/store/familyStore';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Mono } from '@/components/ui/Mono';
import { Button } from '@/components/ui/Button';
import {
  Utensils,
  ChefHat,
  Plus,
  Trash2,
  Share2,
  DollarSign,
  TrendingUp,
  Calculator,
  Calendar,
  Phone,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Coffee,
  ShoppingBag,
  Users,
  Send,
  Sparkles,
  ArrowRight,
  Flame,
  Check,
  CreditCard,
  Edit2,
  ExternalLink,
  Copy,
  Camera,
  ShoppingBag as ShoppingBagIcon,
  Bike,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  KitchenBusinessProfile,
  KitchenBusinessType,
  KitchenBOMRecipe,
  KitchenBOMIngredient,
  KitchenMenuItem,
  KitchenCustomerTiffin,
  KitchenDailyOrder,
  KitchenExpenseItem
} from '@/types';

export default function KitchenBusinessPage() {
  const {
    kitchenProfiles,
    addKitchenProfile,
    deleteKitchenProfile,
    addKitchenRecipeBOM,
    deleteKitchenRecipeBOM,
    addKitchenMenuItem,
    updateKitchenMenuItem,
    deleteKitchenMenuItem,
    addKitchenTiffinSubscriber,
    recordTiffinDeliveryTally,
    recordTiffinPayment,
    deleteKitchenTiffinSubscriber,
    addKitchenDailyOrder,
    updateKitchenOrderStatus,
    deleteKitchenDailyOrder,
    addKitchenExpense,
    deleteKitchenExpense,
    recordKitchenDrawingToFamily,
    members,
    currentUserId
  } = useFamilyStore();

  const [selectedKitchenId, setSelectedKitchenId] = useState<string>(kitchenProfiles[0]?.id || '');

  // Keep selectedKitchenId in sync
  const activeKitchen = useMemo(() => {
    return kitchenProfiles.find(k => k.id === selectedKitchenId) || kitchenProfiles[0] || null;
  }, [kitchenProfiles, selectedKitchenId]);

  const [activeTab, setActiveTab] = useState<'overview' | 'tiffin' | 'bom' | 'menu' | 'expenses'>('overview');

  // Modals state
  const [isNewKitchenOpen, setIsNewKitchenOpen] = useState(false);
  const [isNewOrderOpen, setIsNewOrderOpen] = useState(false);
  const [isNewSubOpen, setIsNewSubOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedSubForPayment, setSelectedSubForPayment] = useState<KitchenCustomerTiffin | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');

  const [isNewBOMOpen, setIsNewBOMOpen] = useState(false);
  const [isNewMenuItemOpen, setIsNewMenuItemOpen] = useState(false);
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);
  const [isDrawingOpen, setIsDrawingOpen] = useState(false);
  const [menuCopied, setMenuCopied] = useState(false);
  const [digitalLinkCopied, setDigitalLinkCopied] = useState(false);
  const [isPOSCartOpen, setIsPOSCartOpen] = useState(false);
  const [isPhotoScannerOpen, setIsPhotoScannerOpen] = useState(false);
  const [posCart, setPosCart] = useState<{ [itemId: string]: number }>({});
  const [posDeliveryType, setPosDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [posCustomerName, setPosCustomerName] = useState('');
  const [posCustomerPhone, setPosCustomerPhone] = useState('');
  const [posAddress, setPosAddress] = useState('');
  const [posNotes, setPosNotes] = useState('');
  const [posApplyGst, setPosApplyGst] = useState(false);
  const [posGstPercent, setPosGstPercent] = useState(5);
  const [posPaymentMode, setPosPaymentMode] = useState<'paid' | 'pending_cod' | 'khata'>('paid');

  // New Kitchen Form State
  const [kitchenName, setKitchenName] = useState('');
  const [kitchenModel, setKitchenModel] = useState<KitchenBusinessType>('cloud_kitchen');
  const [kitchenOwnerId, setKitchenOwnerId] = useState(currentUserId || '');
  const [kitchenPhone, setKitchenPhone] = useState('9876543210');
  const [kitchenCity, setKitchenCity] = useState('Ghar / Shahr');
  const [kitchenUpi, setKitchenUpi] = useState('kitchen@upi');
  const [kitchenFssai, setKitchenFssai] = useState('');

  // New Daily Order Form State
  const [orderCustName, setOrderCustName] = useState('');
  const [orderPhone, setOrderPhone] = useState('');
  const [orderAddress, setOrderAddress] = useState('');
  const [orderTimeSlot, setOrderTimeSlot] = useState<'lunch' | 'dinner' | 'nasta' | 'party'>('lunch');
  const [orderSource, setOrderSource] = useState<'whatsapp' | 'call_walkin' | 'tiffin_subscription' | 'other'>('whatsapp');
  const [orderItemsSummary, setOrderItemsSummary] = useState('');
  const [orderPlateCount, setOrderPlateCount] = useState('1');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderStatus, setOrderStatus] = useState<'paid' | 'pending_cod' | 'khata'>('paid');

  // New Tiffin Subscriber State
  const [subName, setSubName] = useState('');
  const [subPhone, setSubPhone] = useState('');
  const [subAddress, setSubAddress] = useState('');
  const [subMealPlan, setSubMealPlan] = useState<'lunch_only' | 'dinner_only' | 'both_lunch_dinner'>('both_lunch_dinner');
  const [subBillingCycle, setSubBillingCycle] = useState<'monthly' | 'per_meal'>('monthly');
  const [subMonthlyRate, setSubMonthlyRate] = useState('3000');
  const [subPricePerMeal, setSubPricePerMeal] = useState('60');

  // New BOM Recipe Form State
  const [recipeName, setRecipeName] = useState('');
  const [recipeMealType, setRecipeMealType] = useState<'thali_plate' | 'tiffin' | 'nasta_snack' | 'sweet_dessert' | 'beverage'>('thali_plate');
  const [recipeSellingPrice, setRecipeSellingPrice] = useState('120');
  const [recipeNotes, setRecipeNotes] = useState('');
  const [bomIngredients, setBomIngredients] = useState<KitchenBOMIngredient[]>([
    { id: 'ing-1', name: 'Aata (Wheat Flour)', quantity: 150, unit: 'gram', rate_per_unit: 40, cost: 6 },
    { id: 'ing-2', name: 'Paneer / Dairy', quantity: 70, unit: 'gram', rate_per_unit: 360, cost: 25.2 },
    { id: 'ing-3', name: 'Arhar Dal', quantity: 60, unit: 'gram', rate_per_unit: 160, cost: 9.6 },
    { id: 'ing-4', name: 'Rice / Chawal', quantity: 100, unit: 'gram', rate_per_unit: 50, cost: 5 },
    { id: 'ing-5', name: 'Tel & Masale (Spices/Oil)', quantity: 30, unit: 'ml', rate_per_unit: 140, cost: 4.2 },
    { id: 'ing-6', name: 'Packaging Dabba & Silver Foil', quantity: 1, unit: 'piece', rate_per_unit: 6, cost: 6 }
  ]);

  // Temp Ingredient inputs
  const [newIngName, setNewIngName] = useState('');
  const [newIngQty, setNewIngQty] = useState('');
  const [newIngUnit, setNewIngUnit] = useState<'gram' | 'kg' | 'ml' | 'litre' | 'piece' | 'portion'>('gram');
  const [newIngRate, setNewIngRate] = useState('');

  // New Menu Item State
  const [menuItemName, setMenuItemName] = useState('');
  const [menuCategory, setMenuCategory] = useState<'thali' | 'sabji' | 'roti_bread' | 'rice' | 'nasta_snack' | 'dessert' | 'beverage'>('thali');
  const [menuPrice, setMenuPrice] = useState('100');
  const [menuIsSpecial, setMenuIsSpecial] = useState(false);
  const [menuDesc, setMenuDesc] = useState('');

  // New Expense State
  const [expCategory, setExpCategory] = useState<'mandi_sabji' | 'dairy_milk_paneer' | 'grocery_ration' | 'gas_cylinder' | 'packaging_material' | 'delivery_fuel' | 'staff_helper' | 'other'>('mandi_sabji');
  const [expItemName, setExpItemName] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expVendor, setExpVendor] = useState('');
  const [expMode, setExpMode] = useState<'cash' | 'upi' | 'credit_khata'>('cash');
  const [expNote, setExpNote] = useState('');

  // Family Drawing State
  const [drawAmount, setDrawAmount] = useState('');
  const [drawMemberId, setDrawMemberId] = useState('all_members');
  const [drawNote, setDrawNote] = useState('Kitchen Munafa Hissa');

  // Calculations for current active kitchen
  const todayStr = new Date().toISOString().split('T')[0];
  const todayOrders = useMemo(() => {
    if (!activeKitchen) return [];
    return (activeKitchen.daily_orders || []).filter(o => o.date === todayStr);
  }, [activeKitchen, todayStr]);

  const todayRevenue = useMemo(() => {
    return todayOrders.filter(o => o.payment_status === 'paid').reduce((sum, o) => sum + o.total_amount, 0);
  }, [todayOrders]);

  const todayExpenses = useMemo(() => {
    if (!activeKitchen) return 0;
    return (activeKitchen.expenses || [])
      .filter(e => e.date === todayStr)
      .reduce((sum, e) => sum + e.amount, 0);
  }, [activeKitchen, todayStr]);

  const availableProfit = useMemo(() => {
    if (!activeKitchen) return 0;
    const net = (activeKitchen.lifetime_revenue || 0) - (activeKitchen.lifetime_expenses || 0);
    return Math.max(0, net - (activeKitchen.total_drawings_paid || 0));
  }, [activeKitchen]);

  // Handle Add Ingredient to BOM
  const handleAddIngredient = () => {
    if (!newIngName.trim() || !newIngQty || !newIngRate) return;
    const q = parseFloat(newIngQty) || 0;
    const r = parseFloat(newIngRate) || 0;

    let computedCost = 0;
    if (newIngUnit === 'gram' || newIngUnit === 'ml') {
      computedCost = Math.round((q * (r / 1000)) * 100) / 100;
    } else {
      computedCost = Math.round((q * r) * 100) / 100;
    }

    const item: KitchenBOMIngredient = {
      id: `ing-${Date.now()}`,
      name: newIngName.trim(),
      quantity: q,
      unit: newIngUnit,
      rate_per_unit: r,
      cost: computedCost
    };

    setBomIngredients(prev => [...prev, item]);
    setNewIngName('');
    setNewIngQty('');
    setNewIngRate('');
  };

  const handleRemoveIngredient = (id: string) => {
    setBomIngredients(prev => prev.filter(i => i.id !== id));
  };

  const totalBOMCost = useMemo(() => {
    return Math.round(bomIngredients.reduce((sum, i) => sum + i.cost, 0) * 100) / 100;
  }, [bomIngredients]);

  const bomSellingPriceNum = parseFloat(recipeSellingPrice) || 0;
  const bomProfit = Math.round((bomSellingPriceNum - totalBOMCost) * 100) / 100;
  const bomMargin = bomSellingPriceNum > 0 ? Math.round((bomProfit / bomSellingPriceNum) * 100) : 0;

  // Handle Create Kitchen
  const handleCreateKitchen = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kitchenName.trim()) return;

    const created = addKitchenProfile({
      kitchen_name: kitchenName.trim(),
      business_model: kitchenModel,
      owner_member_id: kitchenOwnerId,
      whatsapp_number: kitchenPhone.trim(),
      address_city: kitchenCity.trim(),
      upi_id: kitchenUpi.trim(),
      fssai_number: kitchenFssai.trim() || undefined
    });

    setSelectedKitchenId(created.id);
    setIsNewKitchenOpen(false);
    confetti({ particleCount: 40, spread: 60 });
  };

  // Quick Starter Sample Data
  const handleLoadSampleKitchen = () => {
    const created = addKitchenProfile({
      kitchen_name: 'Annapurna Rasoi & Tiffin Service',
      business_model: 'tiffin_service',
      owner_member_id: currentUserId || members[0]?.id,
      whatsapp_number: '9876543210',
      address_city: 'Civil Lines, Raipur',
      upi_id: 'annapurna@upi',
      fssai_number: '21524000001234'
    });

    setSelectedKitchenId(created.id);

    // Add Sample Menu Items
    addKitchenMenuItem(created.id, {
      item_name: 'Special Dal-Tadka & Paneer Veg Thali',
      category: 'thali',
      price: 120,
      is_today_special: true,
      is_available: true,
      description: '4 Butter Tawa Roti, Matar Paneer, Dal Tadka, Jeera Rice, Salad & Achar'
    });
    addKitchenMenuItem(created.id, {
      item_name: 'Gharelu Indori Poha & Jalebi Plate',
      category: 'nasta_snack',
      price: 45,
      is_today_special: true,
      is_available: true,
      description: 'Ratnami sev, barik pyaz aur nimbu ke sath'
    });
    addKitchenMenuItem(created.id, {
      item_name: 'Regular Ghar Ka Tiffin (Lunch/Dinner)',
      category: 'thali',
      price: 80,
      is_today_special: false,
      is_available: true,
      description: '4 Roti, 1 Seasonal Sabji, Dal, Chawal'
    });

    // Add Sample Recipe BOM
    addKitchenRecipeBOM(created.id, {
      recipe_name: 'Special Veg Thali (Full Plate)',
      meal_type: 'thali_plate',
      ingredients: [
        { id: 'i1', name: 'Shuddh Aata (4 Roti)', quantity: 120, unit: 'gram', rate_per_unit: 38, cost: 4.56 },
        { id: 'i2', name: 'Matar Paneer Gravy', quantity: 150, unit: 'gram', rate_per_unit: 140, cost: 21 },
        { id: 'i3', name: 'Arhar Dal Tadka', quantity: 120, unit: 'ml', rate_per_unit: 120, cost: 14.4 },
        { id: 'i4', name: 'Jeera Rice', quantity: 100, unit: 'gram', rate_per_unit: 55, cost: 5.5 },
        { id: 'i5', name: 'Salad + Achar + Chutney', quantity: 1, unit: 'portion', rate_per_unit: 5, cost: 5 },
        { id: 'i6', name: 'Dabba + Aluminium Foil Paper', quantity: 1, unit: 'piece', rate_per_unit: 7, cost: 7 }
      ],
      total_cost_per_plate: 57.46,
      selling_price_per_plate: 120,
      profit_per_plate: 62.54,
      margin_percentage: 52,
      notes: 'COGS is ₹57.46, gives ₹62.54 gross margin per plate!'
    });

    // Add Sample Tiffin Customer
    addKitchenTiffinSubscriber(created.id, {
      customer_name: 'Amit Sharma (HDFC Bank)',
      phone: '9826112233',
      delivery_address: 'HDFC Bank, 2nd Floor, Civil Lines',
      meal_plan: 'both_lunch_dinner',
      billing_cycle: 'monthly',
      monthly_rate: 3200,
      start_date: todayStr,
      status: 'active',
      notes: 'No onion on Tuesday'
    });

    // Add Sample Expense
    addKitchenExpense(created.id, {
      date: todayStr,
      category: 'mandi_sabji',
      item_name: 'Sabji Mandi Kharidari (Palak, Matar, Pyaz, Tamatar)',
      amount: 650,
      vendor_name: 'Ramu Mandi Wale',
      payment_mode: 'cash'
    });

    // Add Sample Order
    addKitchenDailyOrder(created.id, {
      order_number: `ORD-101`,
      date: todayStr,
      time_slot: 'lunch',
      customer_name: 'Dr. Verma Clinic',
      customer_phone: '9988776655',
      delivery_address: 'City Hospital Campus',
      items_summary: '3x Special Veg Thali + 2x Lassi',
      plate_count: 3,
      total_amount: 420,
      payment_status: 'paid',
      source: 'whatsapp'
    });

    confetti({ particleCount: 50, spread: 70 });
  };

  // Handle Save BOM Recipe
  const handleSaveBOM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !recipeName.trim() || bomIngredients.length === 0) return;

    addKitchenRecipeBOM(activeKitchen.id, {
      recipe_name: recipeName.trim(),
      meal_type: recipeMealType,
      ingredients: bomIngredients,
      total_cost_per_plate: totalBOMCost,
      selling_price_per_plate: bomSellingPriceNum,
      profit_per_plate: bomProfit,
      margin_percentage: bomMargin,
      notes: recipeNotes.trim() || undefined
    });

    setIsNewBOMOpen(false);
    setRecipeName('');
    setRecipeSellingPrice('120');
    setRecipeNotes('');
    confetti({ particleCount: 30 });
  };

  // Handle Create Order
  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !orderCustName.trim() || !orderAmount) return;

    addKitchenDailyOrder(activeKitchen.id, {
      order_number: `ORD-${Date.now().toString().slice(-4)}`,
      date: todayStr,
      time_slot: orderTimeSlot,
      customer_name: orderCustName.trim(),
      customer_phone: orderPhone.trim() || undefined,
      delivery_address: orderAddress.trim() || undefined,
      items_summary: orderItemsSummary.trim() || 'Food Order',
      plate_count: parseInt(orderPlateCount) || 1,
      total_amount: parseFloat(orderAmount) || 0,
      payment_status: orderStatus,
      source: orderSource
    });

    setIsNewOrderOpen(false);
    setOrderCustName('');
    setOrderPhone('');
    setOrderAddress('');
    setOrderItemsSummary('');
    setOrderAmount('');
    confetti({ particleCount: 30 });
  };

  // Handle Create Tiffin Subscriber
  const handleCreateSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !subName.trim()) return;

    addKitchenTiffinSubscriber(activeKitchen.id, {
      customer_name: subName.trim(),
      phone: subPhone.trim(),
      delivery_address: subAddress.trim(),
      meal_plan: subMealPlan,
      billing_cycle: subBillingCycle,
      monthly_rate: parseFloat(subMonthlyRate) || 0,
      price_per_meal: parseFloat(subPricePerMeal) || 0,
      start_date: todayStr,
      status: 'active'
    });

    setIsNewSubOpen(false);
    setSubName('');
    setSubPhone('');
    setSubAddress('');
    confetti({ particleCount: 30 });
  };

  // Handle Record Tiffin Payment
  const handleRecordTiffinPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !selectedSubForPayment || !paymentAmount) return;

    const amt = parseFloat(paymentAmount) || 0;
    if (amt <= 0) return;

    recordTiffinPayment(activeKitchen.id, selectedSubForPayment.id, amt, paymentNote.trim() || 'Monthly Tiffin Fee');
    setIsPaymentModalOpen(false);
    setSelectedSubForPayment(null);
    setPaymentAmount('');
    setPaymentNote('');
    confetti({ particleCount: 35 });
  };

  // Handle Create Menu Item
  const handleCreateMenuItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !menuItemName.trim() || !menuPrice) return;

    addKitchenMenuItem(activeKitchen.id, {
      item_name: menuItemName.trim(),
      category: menuCategory,
      price: parseFloat(menuPrice) || 0,
      is_today_special: menuIsSpecial,
      is_available: true,
      description: menuDesc.trim() || undefined
    });

    setIsNewMenuItemOpen(false);
    setMenuItemName('');
    setMenuPrice('100');
    setMenuDesc('');
    setMenuIsSpecial(false);
  };

  // Handle Create Expense
  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !expItemName.trim() || !expAmount) return;

    addKitchenExpense(activeKitchen.id, {
      date: todayStr,
      category: expCategory,
      item_name: expItemName.trim(),
      amount: parseFloat(expAmount) || 0,
      vendor_name: expVendor.trim() || undefined,
      payment_mode: expMode,
      notes: expNote.trim() || undefined
    });

    setIsNewExpenseOpen(false);
    setExpItemName('');
    setExpAmount('');
    setExpVendor('');
    setExpNote('');
  };

  // Handle Transfer Profit to Family
  const handleTransferToFamily = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen || !drawAmount) return;
    const amt = parseFloat(drawAmount) || 0;
    if (amt <= 0) return;

    recordKitchenDrawingToFamily(activeKitchen.id, {
      amount: amt,
      credited_to_member_id: drawMemberId,
      note: drawNote.trim() || 'Kitchen P&L Munafa Payout'
    });

    setIsDrawingOpen(false);
    setDrawAmount('');
    confetti({ particleCount: 60, spread: 80 });
  };

  // Generate WhatsApp Menu Text
  const generateWhatsAppMenuText = () => {
    if (!activeKitchen) return '';
    const specials = (activeKitchen.menu_items || []).filter(m => m.is_today_special && m.is_available);
    const regulars = (activeKitchen.menu_items || []).filter(m => !m.is_today_special && m.is_available);

    let text = `🍽️ *${activeKitchen.kitchen_name.toUpperCase()}* 🍽️\n`;
    text += `📍 ${activeKitchen.address_city} | 📱 WhatsApp Order: ${activeKitchen.whatsapp_number}\n\n`;

    if (specials.length > 0) {
      text += `✨ *AAJ KA SPECIAL (TODAY'S SPECIAL)* ✨\n`;
      specials.forEach(s => {
        text += `👉 *${s.item_name}* - ₹${s.price}\n`;
        if (s.description) text += `   _${s.description}_\n`;
      });
      text += `\n`;
    }

    if (regulars.length > 0) {
      text += `📋 *DAILY MENU / REGULAR ITEMS* 📋\n`;
      regulars.forEach(r => {
        text += `• ${r.item_name}: ₹${r.price}\n`;
      });
      text += `\n`;
    }

    text += `🛵 *Ghar / Office Par Garam Delivery Uplabdh!*\n`;
    text += `📲 Apna Order & Address yahan reply karein ya call karein. Dhanyawad! 🙏`;

    return text;
  };

  const handleCopyDigitalMenuLink = () => {
    if (!activeKitchen) return;
    const url = typeof window !== 'undefined'
      ? `${window.location.origin}/menu?k=${activeKitchen.id}`
      : `/menu?k=${activeKitchen.id}`;
    navigator.clipboard.writeText(url);
    setDigitalLinkCopied(true);
    setTimeout(() => setDigitalLinkCopied(false), 2500);
  };

  const handlePOSAddToCart = (itemId: string) => {
    setPosCart(prev => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const handlePOSDecreaseQty = (itemId: string) => {
    setPosCart(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemId];
        return next;
      }
      return { ...prev, [itemId]: current - 1 };
    });
  };

  const handlePOSSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeKitchen) return;
    const selectedEntries = Object.entries(posCart).filter(([_, qty]) => qty > 0);
    if (selectedEntries.length === 0) {
      alert('Kripya kam se kam 1 item chunein.');
      return;
    }
    if (!posCustomerName.trim()) {
      alert('Grahak ka naam likhna zaroori hai.');
      return;
    }

    const itemsSummary = selectedEntries.map(([id, qty]) => {
      const item = (activeKitchen.menu_items || []).find(m => m.id === id);
      return `${qty}x ${item ? item.item_name : 'Item'}`;
    }).join(', ');

    const subtotal = selectedEntries.reduce((sum, [id, qty]) => {
      const item = (activeKitchen.menu_items || []).find(m => m.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);

    const gst = posApplyGst ? Math.round(subtotal * (posGstPercent / 100) * 100) / 100 : 0;
    const delivery = posDeliveryType === 'delivery' ? (activeKitchen.default_delivery_charge ?? 30) : 0;
    const grandTotal = subtotal + gst + delivery;
    const totalPlates = selectedEntries.reduce((sum, [_, q]) => sum + q, 0);

    const orderNum = `ORD-${Date.now().toString().slice(-4)}`;

    addKitchenDailyOrder(activeKitchen.id, {
      order_number: orderNum,
      date: todayStr,
      time_slot: 'lunch',
      customer_name: posCustomerName.trim(),
      customer_phone: posCustomerPhone.trim() || undefined,
      delivery_address: posDeliveryType === 'delivery' ? (posAddress.trim() || undefined) : 'Self Pickup',
      items_summary: itemsSummary,
      plate_count: totalPlates,
      total_amount: grandTotal,
      payment_status: posPaymentMode,
      source: 'call_walkin',
      order_type: posDeliveryType,
      subtotal: subtotal,
      gst_amount: gst,
      delivery_charge: delivery,
      special_notes: posNotes.trim() || undefined,
      notes: 'Counter POS order'
    });

    setIsPOSCartOpen(false);
    setPosCart({});
    setPosCustomerName('');
    setPosCustomerPhone('');
    setPosAddress('');
    setPosNotes('');
    confetti({ particleCount: 50, spread: 70 });
  };
  const handleCopyMenu = () => {
    const text = generateWhatsAppMenuText();
    navigator.clipboard.writeText(text);
    setMenuCopied(true);
    setTimeout(() => setMenuCopied(false), 2500);
  };

  const handleOpenWhatsAppMenu = () => {
    const text = encodeURIComponent(generateWhatsAppMenuText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6 pb-24">
      {/* Screen Header */}
      <ScreenHeader
        title="Cloud Kitchen, Tiffin & Plate System"
        subtitle="Daily Sales, Mandi Kharcha, Recipe BOM Laagat, Tiffin Customer Khata aur Parivar Munafa Transfer"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsNewKitchenOpen(true)}
              className="flex items-center gap-1.5 text-xs sm:text-sm border-gold/40 text-gold hover:bg-gold/10"
            >
              <Plus size={16} />
              + Naya Kitchen Jodein
            </Button>
          </div>
        }
      />

      {/* No Kitchen State */}
      {(!kitchenProfiles || kitchenProfiles.length === 0) ? (
        <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-gold/10 text-gold rounded-full flex items-center justify-center mx-auto">
            <Utensils size={32} />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-bold text-ink">Apna Food Business Shuru Karein</h3>
            <p className="text-sm text-ink-muted mt-1">
              Cloud kitchen, ghar se chalne wala tiffin delivery, nasta & snacks counter ya thali plate bhojanalaya ka purn hisab-kitab yahan karein.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              onClick={() => setIsNewKitchenOpen(true)}
              className="bg-gold text-white font-semibold flex items-center gap-2"
            >
              <Plus size={16} />
              Naya Kitchen / Counter Banayein
            </Button>
            <Button
              variant="outline"
              onClick={handleLoadSampleKitchen}
              className="border-gold/50 text-gold flex items-center gap-2 hover:bg-gold/10"
            >
              <Sparkles size={16} />
              🌟 Example Kitchen Load Karein (Demo)
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Top Kitchen Switcher Banner & P&L Cards */}
          <div className="bg-paper p-4 sm:p-5 rounded-2xl border border-paper-dim shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-paper-dim pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0">
                  <ChefHat size={26} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <select
                      value={activeKitchen?.id}
                      onChange={(e) => setSelectedKitchenId(e.target.value)}
                      className="text-base sm:text-lg font-bold text-ink bg-transparent border-b border-dashed border-ink/30 pb-0.5 focus:outline-none cursor-pointer"
                    >
                      {kitchenProfiles.map(k => (
                        <option key={k.id} value={k.id}>{k.kitchen_name}</option>
                      ))}
                    </select>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-gold font-medium">
                      {activeKitchen?.business_model === 'tiffin_service' && '🍱 Tiffin Service'}
                      {activeKitchen?.business_model === 'cloud_kitchen' && '☁️ Cloud Kitchen'}
                      {activeKitchen?.business_model === 'plate_thali' && '🍛 Thali Bhojanalaya'}
                      {activeKitchen?.business_model === 'nasta_snack' && '🥟 Gharelu Nasta'}
                      {activeKitchen?.business_model === 'event_catering' && '🎉 Event Catering'}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {activeKitchen?.address_city || 'City'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone size={12} /> {activeKitchen?.whatsapp_number}
                    </span>
                    {activeKitchen?.fssai_number && (
                      <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded font-mono">
                        FSSAI: {activeKitchen.fssai_number}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={() => setIsDrawingOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-sm text-xs sm:text-sm"
                >
                  <DollarSign size={16} />
                  💰 Parivar Me Munafa Bhejein
                </Button>

                <Button
                  onClick={() => setIsPOSCartOpen(true)}
                  className="bg-gold hover:bg-gold/90 text-white flex items-center gap-1.5 shadow-sm text-xs sm:text-sm"
                >
                  <ShoppingBagIcon size={16} />
                  🛒 POS / Counter Quick Order
                </Button>

                <Link
                  href={`/menu?k=${activeKitchen?.id}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-blue-500 text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <ExternalLink size={15} />
                  🌐 Live Digital Menu
                </Link>

                <Button
                  variant="outline"
                  onClick={handleCopyDigitalMenuLink}
                  className="border-paper-dim text-ink text-xs sm:text-sm flex items-center gap-1.5"
                >
                  {digitalLinkCopied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
                  {digitalLinkCopied ? 'Link Copied!' : '📋 Menu Link Copy'}
                </Button>

                <Button
                  variant="outline"
                  onClick={handleOpenWhatsAppMenu}
                  className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Share2 size={16} />
                  WhatsApp Catalog
                </Button>
              </div>
            </div>

            {/* Financial Summary Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim">
                <div className="text-xs text-ink-muted flex items-center gap-1">
                  <ShoppingBag size={13} className="text-blue-500" />
                  Aaj Ke Orders
                </div>
                <div className="text-lg font-bold text-ink mt-1">
                  {todayOrders.length} <span className="text-xs font-normal text-ink-muted">orders</span>
                </div>
                <div className="text-[11px] text-ink-muted">
                  {todayOrders.reduce((sum, o) => sum + o.plate_count, 0)} plates/tiffins
                </div>
              </div>

              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim">
                <div className="text-xs text-ink-muted flex items-center gap-1">
                  <TrendingUp size={13} className="text-emerald-500" />
                  Aaj Ki Vikray (Sales)
                </div>
                <div className="text-lg font-bold text-emerald-600 mt-1">
                  ₹<Mono>{todayRevenue.toLocaleString('en-IN')}</Mono>
                </div>
                <div className="text-[11px] text-ink-muted">Direct business revenue</div>
              </div>

              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim">
                <div className="text-xs text-ink-muted flex items-center gap-1">
                  <Flame size={13} className="text-rose-500" />
                  Aaj Ka Mandi/Kharcha
                </div>
                <div className="text-lg font-bold text-rose-600 mt-1">
                  ₹<Mono>{todayExpenses.toLocaleString('en-IN')}</Mono>
                </div>
                <div className="text-[11px] text-ink-muted">Mandi, dairy, cylinder</div>
              </div>

              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim">
                <div className="text-xs text-ink-muted flex items-center gap-1">
                  <ChefHat size={13} className="text-gold" />
                  Kitchen Uplabdh Munafa
                </div>
                <div className="text-lg font-bold text-gold mt-1">
                  ₹<Mono>{availableProfit.toLocaleString('en-IN')}</Mono>
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">Ready to draw to family</div>
              </div>

              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim col-span-2 sm:col-span-1">
                <div className="text-xs text-ink-muted flex items-center gap-1">
                  <Users size={13} className="text-indigo-500" />
                  Parivar Me Bheja Munafa
                </div>
                <div className="text-lg font-bold text-indigo-600 mt-1">
                  ₹<Mono>{(activeKitchen?.total_drawings_paid || 0).toLocaleString('en-IN')}</Mono>
                </div>
                <div className="text-[11px] text-ink-muted">
                  {(activeKitchen?.drawings || []).length} bar batwara hua
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-paper-dim">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-dim/40'
              }`}
            >
              <Utensils size={15} />
              Aaj Ka Hisab & Orders ({todayOrders.length})
            </button>

            <button
              onClick={() => setActiveTab('tiffin')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tiffin'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-dim/40'
              }`}
            >
              <Users size={15} />
              Tiffin Customer Khata ({(activeKitchen?.tiffin_subscribers || []).length})
            </button>

            <button
              onClick={() => setActiveTab('bom')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'bom'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-dim/40'
              }`}
            >
              <Calculator size={15} />
              Recipe BOM & Laagat Costing ({(activeKitchen?.recipes_bom || []).length})
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-dim/40'
              }`}
            >
              <Coffee size={15} />
              Digital Menu & WhatsApp Catalog ({(activeKitchen?.menu_items || []).length})
            </button>

            <button
              onClick={() => setActiveTab('expenses')}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'expenses'
                  ? 'bg-gold text-white shadow-sm'
                  : 'text-ink-muted hover:text-ink hover:bg-paper-dim/40'
              }`}
            >
              <Flame size={15} />
              Mandi & Kitchen Kharcha ({(activeKitchen?.expenses || []).length})
            </button>
          </div>

          {/* TAB 1: OVERVIEW & ORDERS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Actions Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Daily Sales & Customer Orders</h3>
                  <p className="text-xs text-ink-muted">
                    WhatsApp, phone call, walk-in counter ya daily tiffin orders record karein
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewOrderOpen(true)}
                  className="bg-gold hover:bg-gold/90 text-white flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Plus size={16} />
                  + Naya Order / Plate Sale Likhein
                </Button>
              </div>

              {/* Order List */}
              {(!activeKitchen?.daily_orders || activeKitchen.daily_orders.length === 0) ? (
                <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-paper-sub text-ink-muted flex items-center justify-center mx-auto">
                    <ShoppingBag size={24} />
                  </div>
                  <div className="text-sm font-semibold text-ink">Abhi tak koi order darj nahi hua</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Aapke kitchen se bikne wali thali, nasta, ya tiffin ka order yahan likhein jisse roz ki sahi aamdani track ho sake.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewOrderOpen(true)}
                    className="border-gold text-gold text-xs"
                  >
                    + Pehla Order Darj Karein
                  </Button>
                </div>
              ) : (
                <div className="bg-paper rounded-2xl border border-paper-dim overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-paper-sub border-b border-paper-dim text-ink-muted">
                          <th className="p-3 font-semibold">Order / Time</th>
                          <th className="p-3 font-semibold">Grahak (Customer)</th>
                          <th className="p-3 font-semibold">Items & Thali Details</th>
                          <th className="p-3 font-semibold text-right">Rashi (Amount)</th>
                          <th className="p-3 font-semibold text-center">Bhugtan (Payment)</th>
                          <th className="p-3 font-semibold text-center">Receipt & Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-paper-dim">
                        {(activeKitchen?.daily_orders || []).map(order => {
                          const isPaid = order.payment_status === 'paid';
                          const isCod = order.payment_status === 'pending_cod';

                          const receiptMessage = encodeURIComponent(
                            `Namaste ${order.customer_name}! 🙏\n${activeKitchen.kitchen_name} se aapka order taiyar hai:\n🍽️ ${order.items_summary} (${order.plate_count} Plates)\n💰 Kul Rashi: ₹${order.total_amount}\n📌 Payment: ${isPaid ? 'PAID (Chukta)' : isCod ? 'COD (Delivery Par Dena Hai)' : 'Khata (Udhar)'}\nDhanyawad!`
                          );

                          return (
                            <tr key={order.id} className="hover:bg-paper-sub/50 transition-colors">
                              <td className="p-3 whitespace-nowrap">
                                <div className="font-mono font-bold text-ink">{order.order_number}</div>
                                <div className="text-[11px] text-ink-muted flex items-center gap-1">
                                  <Clock size={11} /> {order.date} • {order.time_slot.toUpperCase()}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="font-semibold text-ink">{order.customer_name}</div>
                                {order.customer_phone && (
                                  <div className="text-[11px] text-ink-muted flex items-center gap-1">
                                    <Phone size={10} /> {order.customer_phone}
                                  </div>
                                )}
                                {order.delivery_address && (
                                  <div className="text-[11px] text-ink-muted flex items-center gap-1">
                                    <MapPin size={10} /> {order.delivery_address}
                                  </div>
                                )}
                              </td>
                              <td className="p-3">
                                <div className="font-medium text-ink">{order.items_summary}</div>
                                <div className="text-[11px] text-ink-muted">
                                  {order.plate_count} plate(s) • Source: {order.source || 'Direct'}
                                </div>
                              </td>
                              <td className="p-3 text-right whitespace-nowrap">
                                <div className="font-bold text-ink text-sm sm:text-base">
                                  ₹<Mono>{order.total_amount.toLocaleString('en-IN')}</Mono>
                                </div>
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <select
                                  value={order.payment_status}
                                  onChange={(e) => updateKitchenOrderStatus(activeKitchen.id, order.id, e.target.value as any)}
                                  className={`text-xs px-2 py-1 rounded-full font-medium border cursor-pointer focus:outline-none ${
                                    isPaid
                                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                                      : isCod
                                      ? 'bg-amber-50 text-amber-700 border-amber-300'
                                      : 'bg-rose-50 text-rose-700 border-rose-300'
                                  }`}
                                >
                                  <option value="paid">✓ Paid (Jama)</option>
                                  <option value="pending_cod">⏳ Pending COD</option>
                                  <option value="khata">📝 Khata (Udhar)</option>
                                </select>
                              </td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2">
                                  {order.customer_phone && (
                                    <a
                                      href={`https://wa.me/91${order.customer_phone.replace(/\D/g, '')}?text=${receiptMessage}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                                      title="WhatsApp Receipt Bhejein"
                                    >
                                      <Send size={15} />
                                    </a>
                                  )}
                                  <button
                                    onClick={() => deleteKitchenDailyOrder(activeKitchen.id, order.id)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                                    title="Order Delete Karein"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Drawings History (Transferred to Family) */}
              <div className="bg-paper p-4 sm:p-5 rounded-2xl border border-paper-dim shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-ink">Parivar Me Bheja Gaya Munafa (Family Drawings Log)</h4>
                    <p className="text-xs text-ink-muted">
                      Business se nikal kar ghar ke bank khate ya sadasyon me transfer kiya gaya hisab
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setIsDrawingOpen(true)}
                    className="border-emerald-600 text-emerald-600 text-xs hover:bg-emerald-50"
                  >
                    + Naya Batwara / Drawing
                  </Button>
                </div>

                {(!activeKitchen?.drawings || activeKitchen.drawings.length === 0) ? (
                  <div className="text-xs text-ink-muted bg-paper-sub p-3 rounded-xl text-center">
                    Abhi tak kitchen se parivar me koi munafa transfer nahi kiya gaya hai.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activeKitchen.drawings.map(d => {
                      const memberName = d.credited_to_member_id === 'all_members'
                        ? 'Sabhi Sadasyon Me Barabar Batwara'
                        : members.find(m => m.id === d.credited_to_member_id)?.name || 'Member';

                      return (
                        <div key={d.id} className="flex items-center justify-between p-2.5 rounded-xl bg-paper-sub border border-paper-dim text-xs">
                          <div>
                            <div className="font-semibold text-ink">{memberName}</div>
                            <div className="text-[11px] text-ink-muted">
                              {d.date} • {d.note || 'Kitchen Profit Drawing'}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-emerald-600 text-sm">
                              +₹<Mono>{d.amount.toLocaleString('en-IN')}</Mono>
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: TIFFIN SUBSCRIBERS KHATA */}
          {activeTab === 'tiffin' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Tiffin Customer Khata & Daily Dabba Tally</h3>
                  <p className="text-xs text-ink-muted">
                    Mahine ke grahak, delivered tiffin counter, advance jama aur baki rashi hisab
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewSubOpen(true)}
                  className="bg-gold hover:bg-gold/90 text-white flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Plus size={16} />
                  + Naya Tiffin Grahak Jodein
                </Button>
              </div>

              {(!activeKitchen?.tiffin_subscribers || activeKitchen.tiffin_subscribers.length === 0) ? (
                <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-paper-sub text-ink-muted flex items-center justify-center mx-auto">
                    <Users size={24} />
                  </div>
                  <div className="text-sm font-semibold text-ink">Abhi tak koi tiffin grahak nahi joda gaya</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Ghar ya office me monthly tiffin lene wale grahak ka khata banayein, roz 1-click se delivery tally karein.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewSubOpen(true)}
                    className="border-gold text-gold text-xs"
                  >
                    + Naya Customer Jodein
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(activeKitchen?.tiffin_subscribers || []).map(sub => {
                    const hasDues = sub.pending_dues > 0;
                    const waReminderMsg = encodeURIComponent(
                      `Namaste ${sub.customer_name} ji! 🙏\n${activeKitchen.kitchen_name} se aapke ab tak kul ${sub.total_tiffins_delivered} tiffin deliver ho chuke hain.\n💰 Kul Baki Rashi: ₹${sub.pending_dues}\nKripya UPI (${activeKitchen.upi_id || '9876543210@upi'}) ya cash se bhugtan karein.\nDhanyawad!`
                    );

                    return (
                      <div key={sub.id} className="bg-paper p-4 rounded-2xl border border-paper-dim shadow-sm space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-bold text-ink text-sm sm:text-base">{sub.customer_name}</h4>
                              <div className="text-xs text-ink-muted flex items-center gap-1 mt-0.5">
                                <Phone size={11} /> {sub.phone}
                              </div>
                            </div>
                            <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-paper-sub text-ink-muted border border-paper-dim">
                              {sub.meal_plan === 'lunch_only' && '☀️ Lunch Only'}
                              {sub.meal_plan === 'dinner_only' && '🌙 Dinner Only'}
                              {sub.meal_plan === 'both_lunch_dinner' && '🍱 Lunch + Dinner'}
                            </span>
                          </div>

                          <div className="text-xs text-ink-muted flex items-center gap-1 bg-paper-sub p-2 rounded-xl">
                            <MapPin size={12} className="shrink-0 text-gold" />
                            <span className="line-clamp-1">{sub.delivery_address || 'Delivery Address'}</span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center pt-1">
                            <div className="bg-paper-sub p-2 rounded-xl border border-paper-dim">
                              <div className="text-[10px] text-ink-muted">Rate / Mahina</div>
                              <div className="text-xs font-bold text-ink">
                                {sub.billing_cycle === 'per_meal'
                                  ? `₹${sub.price_per_meal}/dabba`
                                  : `₹${sub.monthly_rate}/mo`}
                              </div>
                            </div>
                            <div className="bg-paper-sub p-2 rounded-xl border border-paper-dim">
                              <div className="text-[10px] text-ink-muted">Delivered Tally</div>
                              <div className="text-xs font-bold text-blue-600">
                                {sub.total_tiffins_delivered} dabba
                              </div>
                            </div>
                            <div className={`p-2 rounded-xl border ${hasDues ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
                              <div className="text-[10px] opacity-80">Baki Rashi</div>
                              <div className="text-xs font-bold">
                                ₹<Mono>{sub.pending_dues.toLocaleString('en-IN')}</Mono>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Quick Tally & Payment Buttons */}
                        <div className="space-y-2 pt-2 border-t border-paper-dim">
                          <Button
                            onClick={() => recordTiffinDeliveryTally(activeKitchen.id, sub.id, 1)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <Plus size={14} />
                            +1 Tiffin Deliver Hua (Tally)
                          </Button>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setSelectedSubForPayment(sub);
                                setPaymentAmount(sub.pending_dues > 0 ? String(sub.pending_dues) : '1000');
                                setIsPaymentModalOpen(true);
                              }}
                              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs py-1"
                            >
                              <CreditCard size={13} className="mr-1" />
                              Fees Jama
                            </Button>

                            {hasDues ? (
                              <a
                                href={`https://wa.me/91${sub.phone.replace(/\D/g, '')}?text=${waReminderMsg}`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center justify-center gap-1 text-xs border border-emerald-500 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors py-1"
                              >
                                <Send size={12} />
                                Baki Reminder
                              </a>
                            ) : (
                              <button
                                onClick={() => deleteKitchenTiffinSubscriber(activeKitchen.id, sub.id)}
                                className="text-xs text-rose-500 hover:bg-rose-50 rounded-lg py-1 transition-colors flex items-center justify-center gap-1"
                              >
                                <Trash2 size={12} />
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECIPE BOM & COSTING */}
          {activeTab === 'bom' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Bill of Materials (BOM) & Per-Plate Costing</h3>
                  <p className="text-xs text-ink-muted">
                    Thali, Nasta ya Tiffin banane me kitna aata, sabji, dal, tel, gas aur packaging lagta hai — asli laagat (COGS) aur munafa janiye
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewBOMOpen(true)}
                  className="bg-gold hover:bg-gold/90 text-white flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Calculator size={16} />
                  + Nayi Recipe BOM Calculator
                </Button>
              </div>

              {(!activeKitchen?.recipes_bom || activeKitchen.recipes_bom.length === 0) ? (
                <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-paper-sub text-ink-muted flex items-center justify-center mx-auto">
                    <Calculator size={24} />
                  </div>
                  <div className="text-sm font-semibold text-ink">Abhi tak koi Recipe BOM nahi bani</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    1 thali ya plate banane ka raw material hisab jodiye jisse pata chale ki kitna munafa ho raha hai.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewBOMOpen(true)}
                    className="border-gold text-gold text-xs"
                  >
                    + Pehli Recipe BOM Banayein
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(activeKitchen?.recipes_bom || []).map(recipe => {
                    const isHighMargin = recipe.margin_percentage >= 40;
                    const isMedMargin = recipe.margin_percentage >= 20 && recipe.margin_percentage < 40;

                    return (
                      <div key={recipe.id} className="bg-paper p-4 rounded-2xl border border-paper-dim shadow-sm space-y-4">
                        <div className="flex items-start justify-between gap-2 border-b border-paper-dim pb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-ink text-base">{recipe.recipe_name}</h4>
                              <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                                isHighMargin
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isMedMargin
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-rose-100 text-rose-800'
                              }`}>
                                {recipe.margin_percentage}% Margin
                              </span>
                            </div>
                            <div className="text-xs text-ink-muted capitalize mt-0.5">
                              Meal Type: {recipe.meal_type.replace('_', ' ')}
                            </div>
                          </div>
                          <button
                            onClick={() => deleteKitchenRecipeBOM(activeKitchen.id, recipe.id)}
                            className="text-ink-muted hover:text-rose-600 p-1"
                            title="Delete BOM"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Ingredients Breakdown */}
                        <div className="space-y-1.5">
                          <div className="text-xs font-semibold text-ink-muted">Raw Material Laagat (Per Plate):</div>
                          <div className="bg-paper-sub p-2.5 rounded-xl space-y-1 text-xs max-h-40 overflow-y-auto">
                            {recipe.ingredients.map(ing => (
                              <div key={ing.id} className="flex items-center justify-between text-ink-muted">
                                <span>
                                  {ing.name} ({ing.quantity} {ing.unit})
                                </span>
                                <span className="font-mono font-medium text-ink">
                                  ₹{ing.cost.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Costing Summary Cards */}
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-paper-sub p-2 rounded-xl border border-paper-dim">
                            <div className="text-[10px] text-ink-muted">Kul Laagat (COGS)</div>
                            <div className="text-xs font-bold text-rose-600">
                              ₹<Mono>{recipe.total_cost_per_plate.toFixed(2)}</Mono>
                            </div>
                          </div>
                          <div className="bg-paper-sub p-2 rounded-xl border border-paper-dim">
                            <div className="text-[10px] text-ink-muted">Vikray Mulya</div>
                            <div className="text-xs font-bold text-ink">
                              ₹<Mono>{recipe.selling_price_per_plate}</Mono>
                            </div>
                          </div>
                          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2 rounded-xl">
                            <div className="text-[10px] opacity-80">Per Plate Munafa</div>
                            <div className="text-xs font-bold">
                              ₹<Mono>{recipe.profit_per_plate.toFixed(2)}</Mono>
                            </div>
                          </div>
                        </div>

                        {recipe.notes && (
                          <div className="text-[11px] text-ink-muted bg-paper-sub p-2 rounded-lg italic">
                            💡 {recipe.notes}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DIGITAL MENU & WHATSAPP CATALOG */}
          {activeTab === 'menu' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Digital Food Menu & WhatsApp Share</h3>
                  <p className="text-xs text-ink-muted">
                    Aaj ka special khana, regular items, price aur 1-click se customer ko bhejne yogya WhatsApp menu
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsPhotoScannerOpen(true)}
                    className="border-purple-300 text-purple-700 bg-purple-50 hover:bg-purple-100 text-xs flex items-center gap-1.5 font-semibold"
                  >
                    <Camera size={15} />
                    📸 Photo Se Menu Banayein (AI Vision)
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCopyMenu}
                    className="border-paper-dim text-xs flex items-center gap-1.5"
                  >
                    {menuCopied ? <Check size={14} className="text-emerald-600" /> : <Share2 size={14} />}
                    {menuCopied ? 'Menu Copied!' : 'Copy Menu Text'}
                  </Button>
                  <Button
                    onClick={() => setIsNewMenuItemOpen(true)}
                    className="bg-gold hover:bg-gold/90 text-white flex items-center gap-1.5 text-xs sm:text-sm"
                  >
                    <Plus size={16} />
                    + Naya Item Jodein
                  </Button>
                </div>
              </div>

              {/* Menu Items Grid */}
              {(!activeKitchen?.menu_items || activeKitchen.menu_items.length === 0) ? (
                <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-paper-sub text-ink-muted flex items-center justify-center mx-auto">
                    <Coffee size={24} />
                  </div>
                  <div className="text-sm font-semibold text-ink">Menu me abhi koi item nahi hai</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Apni thali, sabji, roti, nasta, chawal aur beverages menu me jodiye.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewMenuItemOpen(true)}
                    className="border-gold text-gold text-xs"
                  >
                    + Pehla Dish / Item Jodein
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(activeKitchen?.menu_items || []).map(item => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-2xl border shadow-sm transition-all flex flex-col justify-between ${
                        item.is_today_special
                          ? 'bg-amber-50/50 border-gold/40'
                          : 'bg-paper border-paper-dim'
                      }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-ink text-sm sm:text-base flex items-center gap-1.5">
                            {item.item_name}
                            {item.is_today_special && (
                              <span className="text-[10px] bg-gold text-white px-1.5 py-0.2 rounded font-semibold">
                                Special
                              </span>
                            )}
                          </h4>
                          <span className="font-bold text-emerald-600 text-sm whitespace-nowrap">
                            ₹{item.price}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-xs text-ink-muted line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-paper-dim text-xs">
                        <span className="text-[11px] text-ink-muted uppercase font-medium">
                          {item.category.replace('_', ' ')}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateKitchenMenuItem(activeKitchen.id, item.id, { is_today_special: !item.is_today_special })}
                            className={`text-[11px] px-2 py-0.5 rounded-full border transition-colors ${
                              item.is_today_special
                                ? 'bg-gold/15 text-gold border-gold/30'
                                : 'bg-paper-sub text-ink-muted border-paper-dim'
                            }`}
                          >
                            {item.is_today_special ? '★ Special' : '☆ Normal'}
                          </button>
                          <button
                            onClick={() => deleteKitchenMenuItem(activeKitchen.id, item.id)}
                            className="text-ink-muted hover:text-rose-600 p-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MANDI & KITCHEN EXPENSES */}
          {activeTab === 'expenses' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-ink">Daily Kitchen Kharcha (Raw Materials & Utilities)</h3>
                  <p className="text-xs text-ink-muted">
                    Sabji Mandi, Doodh/Paneer, Kirana Ration, Commercial Gas Cylinder, Packaging Dabba aur Staff Helper
                  </p>
                </div>
                <Button
                  onClick={() => setIsNewExpenseOpen(true)}
                  className="bg-rose-600 hover:bg-rose-700 text-white flex items-center gap-1.5 text-xs sm:text-sm"
                >
                  <Plus size={16} />
                  + Naya Kharcha Likhein
                </Button>
              </div>

              {(!activeKitchen?.expenses || activeKitchen.expenses.length === 0) ? (
                <div className="bg-paper p-8 rounded-2xl border border-paper-dim text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-paper-sub text-ink-muted flex items-center justify-center mx-auto">
                    <Flame size={24} />
                  </div>
                  <div className="text-sm font-semibold text-ink">Abhi tak koi kharcha nahi likha gaya</div>
                  <p className="text-xs text-ink-muted max-w-sm mx-auto">
                    Aaj ki mandi sabji, ration, cylinder ya packaging ka kharcha yahan likhein.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setIsNewExpenseOpen(true)}
                    className="border-rose-600 text-rose-600 text-xs"
                  >
                    + Kharcha Likhein
                  </Button>
                </div>
              ) : (
                <div className="bg-paper rounded-2xl border border-paper-dim overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm">
                      <thead>
                        <tr className="bg-paper-sub border-b border-paper-dim text-ink-muted">
                          <th className="p-3 font-semibold">Date & Category</th>
                          <th className="p-3 font-semibold">Item & Details</th>
                          <th className="p-3 font-semibold">Vyapari / Dukan (Vendor)</th>
                          <th className="p-3 font-semibold">Mode</th>
                          <th className="p-3 font-semibold text-right">Kharcha Rashi</th>
                          <th className="p-3 font-semibold text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-paper-dim">
                        {(activeKitchen?.expenses || []).map(exp => (
                          <tr key={exp.id} className="hover:bg-paper-sub/50 transition-colors">
                            <td className="p-3 whitespace-nowrap">
                              <div className="font-semibold text-ink">{exp.date}</div>
                              <div className="text-[11px] text-ink-muted capitalize">
                                {exp.category.replace(/_/g, ' ')}
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="font-medium text-ink">{exp.item_name}</div>
                              {exp.notes && (
                                <div className="text-[11px] text-ink-muted italic">{exp.notes}</div>
                              )}
                            </td>
                            <td className="p-3 text-ink-muted">
                              {exp.vendor_name || '—'}
                            </td>
                            <td className="p-3 whitespace-nowrap uppercase font-mono text-[11px] text-ink-muted">
                              {exp.payment_mode}
                            </td>
                            <td className="p-3 text-right whitespace-nowrap font-bold text-rose-600 text-sm">
                              ₹<Mono>{exp.amount.toLocaleString('en-IN')}</Mono>
                            </td>
                            <td className="p-3 text-center whitespace-nowrap">
                              <button
                                onClick={() => deleteKitchenExpense(activeKitchen.id, exp.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* MODAL: NAYA KITCHEN / COUNTER */}
      {isNewKitchenOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-lg rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-bold text-ink">Naya Food Counter / Kitchen Shuru Karein</h3>
              <button onClick={() => setIsNewKitchenOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateKitchen} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-ink font-medium mb-1">Kitchen / Business Ka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maa Ki Rasoi Cloud Kitchen, Annapurna Tiffin"
                  value={kitchenName}
                  onChange={e => setKitchenName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Business Model Type *</label>
                <select
                  value={kitchenModel}
                  onChange={e => setKitchenModel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                >
                  <option value="cloud_kitchen">☁️ Cloud Kitchen (Delivery / Online Only)</option>
                  <option value="tiffin_service">🍱 Gharelu & Office Tiffin Supply (Subscriptions)</option>
                  <option value="plate_thali">🍛 Thali & Plate System (Dine-in / Bhojanalaya)</option>
                  <option value="nasta_snack">🥟 Gharelu Nasta & Snacks Center</option>
                  <option value="event_catering">🎉 Event & Party Catering</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Owner / Sambhalne Wale</label>
                  <select
                    value={kitchenOwnerId}
                    onChange={e => setKitchenOwnerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    {members.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">WhatsApp / Order Phone *</label>
                  <input
                    type="tel"
                    required
                    value={kitchenPhone}
                    onChange={e => setKitchenPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">City / Area Address</label>
                  <input
                    type="text"
                    value={kitchenCity}
                    onChange={e => setKitchenCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">UPI ID (QR / Payment)</label>
                  <input
                    type="text"
                    placeholder="e.g. mobile@upi"
                    value={kitchenUpi}
                    onChange={e => setKitchenUpi(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">FSSAI License No. (Yadi Hai Toh)</label>
                <input
                  type="text"
                  placeholder="14-digit FSSAI Number"
                  value={kitchenFssai}
                  onChange={e => setKitchenFssai(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewKitchenOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold text-white font-semibold">
                  Kitchen Banayein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PARIVAR ME MUNAFA BHEJEIN (DRAWINGS) */}
      {isDrawingOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div>
                <h3 className="text-base font-bold text-ink">💰 Parivar Me Munafa Bhejein</h3>
                <p className="text-xs text-ink-muted">Kitchen ki bachat ko parivar ke aamdani khate me jodein</p>
              </div>
              <button onClick={() => setIsDrawingOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs space-y-1">
              <div className="font-semibold">Kitchen Mein Uplabdh Munafa:</div>
              <div className="text-lg font-bold">
                ₹<Mono>{availableProfit.toLocaleString('en-IN')}</Mono>
              </div>
              <div className="text-[11px] opacity-80">
                Yeh rashi kitchen ke kharche nikalne ke baad uplabdh shuddh munafa hai.
              </div>
            </div>

            <form onSubmit={handleTransferToFamily} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-ink font-medium mb-1">Transfer Rashi (₹) *</label>
                <input
                  type="number"
                  required
                  max={availableProfit > 0 ? availableProfit : undefined}
                  placeholder={`Max ₹${availableProfit}`}
                  value={drawAmount}
                  onChange={e => setDrawAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Kin Sadasya Ke Khate Me Jama Karein? *</label>
                <select
                  value={drawMemberId}
                  onChange={e => setDrawMemberId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-emerald-500"
                >
                  <option value="all_members">👥 Sabhi Sadasyon Me Barabar Batwara (Equal Split)</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>👤 {m.name} ({m.relationship || 'Member'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Vivran / Note</label>
                <input
                  type="text"
                  value={drawNote}
                  onChange={e => setDrawNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsDrawingOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Transfer Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NAYA ORDER / PLATE SALE */}
      {isNewOrderOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-lg rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-bold text-ink">+ Naya Order / Plate Bikri Darj Karein</h3>
              <button onClick={() => setIsNewOrderOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateOrder} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Customer Ka Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={orderCustName}
                    onChange={e => setOrderCustName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={orderPhone}
                    onChange={e => setOrderPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Delivery Pata (Address)</label>
                <input
                  type="text"
                  placeholder="Ghar / Office Pata"
                  value={orderAddress}
                  onChange={e => setOrderAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Time Slot</label>
                  <select
                    value={orderTimeSlot}
                    onChange={e => setOrderTimeSlot(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="lunch">☀️ Lunch (Dopahar)</option>
                    <option value="dinner">🌙 Dinner (Raat)</option>
                    <option value="nasta">🥟 Nasta / Snacks</option>
                    <option value="party">🎉 Party / Bulk Order</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Order Source</label>
                  <select
                    value={orderSource}
                    onChange={e => setOrderSource(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="whatsapp">📱 WhatsApp Order</option>
                    <option value="call_walkin">📞 Phone Call / Counter Walk-in</option>
                    <option value="tiffin_subscription">🍱 Daily Tiffin</option>
                    <option value="other">📌 Anya (Other)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Kya Saman Bika? (Item Details) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2x Special Thali + 1x Lassi"
                  value={orderItemsSummary}
                  onChange={e => setOrderItemsSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Plate Count</label>
                  <input
                    type="number"
                    min="1"
                    value={orderPlateCount}
                    onChange={e => setOrderPlateCount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Kul Rashi (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="₹ 240"
                    value={orderAmount}
                    onChange={e => setOrderAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Payment Status</label>
                  <select
                    value={orderStatus}
                    onChange={e => setOrderStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="paid">✓ Paid (Jama)</option>
                    <option value="pending_cod">⏳ Pending COD</option>
                    <option value="khata">📝 Khata (Udhar)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewOrderOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold text-white font-semibold">
                  Order Save Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NAYA TIFFIN GRAHAK */}
      {isNewSubOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-lg rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-bold text-ink">+ Naya Tiffin Grahak (Monthly Subscriber)</h3>
              <button onClick={() => setIsNewSubOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateSub} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Grahak Ka Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={subName}
                    onChange={e => setSubName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    value={subPhone}
                    onChange={e => setSubPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Delivery Pata (Ghar / Office) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SBI Branch, Room 204, Main Road"
                  value={subAddress}
                  onChange={e => setSubAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Meal Plan</label>
                  <select
                    value={subMealPlan}
                    onChange={e => setSubMealPlan(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="both_lunch_dinner">🍱 Lunch + Dinner (Dono Time)</option>
                    <option value="lunch_only">☀️ Lunch Only (Dopahar)</option>
                    <option value="dinner_only">🌙 Dinner Only (Raat)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Billing Type</label>
                  <select
                    value={subBillingCycle}
                    onChange={e => setSubBillingCycle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="monthly">Monthly Fixed Rate</option>
                    <option value="per_meal">Per Dabba / Meal Rate</option>
                  </select>
                </div>
              </div>

              {subBillingCycle === 'monthly' ? (
                <div>
                  <label className="block text-ink font-medium mb-1">Mahine Ka Shulk (Monthly Rate ₹) *</label>
                  <input
                    type="number"
                    required
                    value={subMonthlyRate}
                    onChange={e => setSubMonthlyRate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-gold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-ink font-medium mb-1">Prati Dabba Shulk (Rate Per Meal ₹) *</label>
                  <input
                    type="number"
                    required
                    value={subPricePerMeal}
                    onChange={e => setSubPricePerMeal(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-gold"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewSubOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold text-white font-semibold">
                  Customer Save Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECORD TIFFIN PAYMENT */}
      {isPaymentModalOpen && selectedSubForPayment && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-sm rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div>
                <h3 className="text-base font-bold text-ink">Tiffin Shulk Jama Karein</h3>
                <p className="text-xs text-ink-muted">{selectedSubForPayment.customer_name}</p>
              </div>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleRecordTiffinPaymentSubmit} className="space-y-3 text-xs sm:text-sm">
              <div className="bg-paper-sub p-3 rounded-xl border border-paper-dim">
                <div className="text-xs text-ink-muted">Baki Rashi (Pending Dues):</div>
                <div className="text-base font-bold text-rose-600">
                  ₹<Mono>{selectedSubForPayment.pending_dues.toLocaleString('en-IN')}</Mono>
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Jama Rashi (₹) *</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Note (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Cash diya / Google Pay se aaya"
                  value={paymentNote}
                  onChange={e => setPaymentNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Jama Darj Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RECIPE BOM CALCULATOR */}
      {isNewBOMOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-2xl rounded-2xl p-5 shadow-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div>
                <h3 className="text-base font-bold text-ink">Recipe BOM & Costing Calculator</h3>
                <p className="text-xs text-ink-muted">1 plate / dabba banane ka raw material hisab aur munafa nikalein</p>
              </div>
              <button onClick={() => setIsNewBOMOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleSaveBOM} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Recipe / Dish Ka Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special Veg Thali (4 Roti + Paneer + Dal)"
                    value={recipeName}
                    onChange={e => setRecipeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Meal Category</label>
                  <select
                    value={recipeMealType}
                    onChange={e => setRecipeMealType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="thali_plate">🍛 Thali Plate</option>
                    <option value="tiffin">🍱 Tiffin Dabba</option>
                    <option value="nasta_snack">🥟 Nasta & Snacks</option>
                    <option value="sweet_dessert">🍮 Sweet / Dessert</option>
                    <option value="beverage">☕ Beverage / Chai / Lassi</option>
                  </select>
                </div>
              </div>

              {/* Ingredient Builder Box */}
              <div className="bg-paper-sub p-3.5 rounded-2xl border border-paper-dim space-y-3">
                <div className="font-bold text-ink flex items-center justify-between">
                  <span>Samagri (Ingredients) List</span>
                  <span className="text-xs text-ink-muted font-normal">Add raw materials per plate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Saman (e.g. Aata, Paneer, Gas)"
                    value={newIngName}
                    onChange={e => setNewIngName(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink text-xs focus:outline-none"
                  />
                  <div className="flex gap-1">
                    <input
                      type="number"
                      placeholder="Matra (Qty)"
                      value={newIngQty}
                      onChange={e => setNewIngQty(e.target.value)}
                      className="w-20 px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink text-xs focus:outline-none"
                    />
                    <select
                      value={newIngUnit}
                      onChange={e => setNewIngUnit(e.target.value as any)}
                      className="flex-1 px-1 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink text-xs focus:outline-none"
                    >
                      <option value="gram">gram</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="litre">litre</option>
                      <option value="piece">piece</option>
                      <option value="portion">portion</option>
                    </select>
                  </div>
                  <input
                    type="number"
                    placeholder="Rate/Unit (₹/kg ya ₹/pc)"
                    value={newIngRate}
                    onChange={e => setNewIngRate(e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg bg-paper border border-paper-dim text-ink text-xs focus:outline-none"
                  />
                  <Button
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-gold text-white text-xs py-1.5 flex items-center justify-center gap-1"
                  >
                    <Plus size={14} /> Jodein
                  </Button>
                </div>

                {/* Ingredients Table */}
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {bomIngredients.map(ing => (
                    <div key={ing.id} className="flex items-center justify-between p-1.5 rounded-lg bg-paper text-xs">
                      <span className="font-medium text-ink">{ing.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-ink-muted">
                          {ing.quantity} {ing.unit} @ ₹{ing.rate_per_unit}
                        </span>
                        <span className="font-bold text-ink">₹{ing.cost.toFixed(2)}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(ing.id)}
                          className="text-rose-500 hover:text-rose-700"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Costing Results Banner */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-paper p-3 rounded-xl border border-paper-dim text-center">
                <div>
                  <div className="text-[10px] text-ink-muted">Kul Laagat (COGS)</div>
                  <div className="text-sm sm:text-base font-bold text-rose-600">
                    ₹{totalBOMCost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-ink font-semibold">Vikray Mulya (₹) *</div>
                  <input
                    type="number"
                    required
                    value={recipeSellingPrice}
                    onChange={e => setRecipeSellingPrice(e.target.value)}
                    className="w-20 mx-auto mt-0.5 px-2 py-0.5 rounded border border-paper-dim bg-paper-sub text-center font-bold text-ink"
                  />
                </div>
                <div>
                  <div className="text-[10px] text-ink-muted">Per Plate Munafa</div>
                  <div className="text-sm sm:text-base font-bold text-emerald-600">
                    ₹{bomProfit.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-ink-muted">Gross Margin %</div>
                  <div className={`text-sm sm:text-base font-bold ${bomMargin >= 40 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {bomMargin}%
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Notes / Vishesh Vivran</label>
                <input
                  type="text"
                  placeholder="e.g. 1 cylinder se lagbhag 150 thali banti hai"
                  value={recipeNotes}
                  onChange={e => setRecipeNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewBOMOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold text-white font-semibold">
                  Recipe BOM Save Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NAYA MENU ITEM */}
      {isNewMenuItemOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-bold text-ink">+ Naya Menu Item Jodein</h3>
              <button onClick={() => setIsNewMenuItemOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateMenuItem} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-ink font-medium mb-1">Item / Dish Ka Naam *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Special Veg Thali, Dal Fry, Poha"
                  value={menuItemName}
                  onChange={e => setMenuItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Category</label>
                  <select
                    value={menuCategory}
                    onChange={e => setMenuCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  >
                    <option value="thali">🍛 Thali</option>
                    <option value="sabji">🥘 Sabji Gravy</option>
                    <option value="roti_bread">🫓 Roti / Paratha</option>
                    <option value="rice">🍚 Rice / Pulao</option>
                    <option value="nasta_snack">🥟 Nasta / Snacks</option>
                    <option value="dessert">🍮 Sweet / Dessert</option>
                    <option value="beverage">☕ Beverage / Drink</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={menuPrice}
                    onChange={e => setMenuPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Description / Saman</label>
                <input
                  type="text"
                  placeholder="e.g. 4 Butter Roti, Dal, Paneer, Chawal, Salad"
                  value={menuDesc}
                  onChange={e => setMenuDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={menuIsSpecial}
                  onChange={e => setMenuIsSpecial(e.target.checked)}
                  className="w-4 h-4 rounded text-gold focus:ring-gold"
                />
                <span className="text-ink font-medium">Aaj Ka Special (Special Highlight)</span>
              </label>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewMenuItemOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-gold text-white font-semibold">
                  Menu Me Jodein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NAYA MANDI / KITCHEN EXPENSE */}
      {isNewExpenseOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-md rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <h3 className="text-base font-bold text-ink">+ Naya Kitchen Kharcha Likhein</h3>
              <button onClick={() => setIsNewExpenseOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Kharcha Category *</label>
                  <select
                    value={expCategory}
                    onChange={e => setExpCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-rose-500"
                  >
                    <option value="mandi_sabji">🥬 Sabji Mandi</option>
                    <option value="dairy_milk_paneer">🥛 Doodh, Dahi, Paneer</option>
                    <option value="grocery_ration">🌾 Kirana / Ration Aata Chawal</option>
                    <option value="gas_cylinder">🔥 Gas Cylinder (Commercial)</option>
                    <option value="packaging_material">📦 Packaging Dabba & Foil</option>
                    <option value="delivery_fuel">🛵 Delivery Petrol / Fuel</option>
                    <option value="staff_helper">👨‍🍳 Staff & Helper Vetan</option>
                    <option value="other">📌 Anya Kharcha</option>
                  </select>
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Rashi (Amount ₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="₹ 850"
                    value={expAmount}
                    onChange={e => setExpAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink font-bold focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Item / Vivran *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5kg Pyaz, 3kg Tamatar, Palak"
                  value={expItemName}
                  onChange={e => setExpItemName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Vyapari / Dukan (Vendor)</label>
                  <input
                    type="text"
                    placeholder="e.g. Sharma Kirana Store"
                    value={expVendor}
                    onChange={e => setExpVendor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Payment Mode</label>
                  <select
                    value={expMode}
                    onChange={e => setExpMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-rose-500"
                  >
                    <option value="cash">💵 Cash (Rokad)</option>
                    <option value="upi">📱 UPI / Online</option>
                    <option value="credit_khata">📝 Udhar Khata</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-ink font-medium mb-1">Note (Optional)</label>
                <input
                  type="text"
                  value={expNote}
                  onChange={e => setExpNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsNewExpenseOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-semibold">
                  Kharcha Save Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL: POS MULTI-ITEM QUICK COUNTER ORDER */}
      {isPOSCartOpen && activeKitchen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-2xl rounded-3xl p-5 shadow-2xl space-y-4 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBagIcon size={20} className="text-gold" />
                <div>
                  <h3 className="text-base font-bold text-ink">🛒 POS / Counter Quick Multi-Item Order</h3>
                  <p className="text-xs text-ink-muted">Call ya counter par sunte-sunte turant 20-30 items me se chunein</p>
                </div>
              </div>
              <button onClick={() => setIsPOSCartOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <form onSubmit={handlePOSSubmitOrder} className="overflow-y-auto space-y-4 text-xs sm:text-sm flex-1 pr-1">
              {/* Items Picker Grid */}
              <div className="space-y-2">
                <div className="font-bold text-ink flex items-center justify-between">
                  <span>Menu Se Items Chunein (+ / -)</span>
                  <span className="text-xs text-gold font-normal">
                    {Object.values(posCart).reduce((a, b) => a + b, 0)} Items Selected
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-paper-sub rounded-2xl border border-paper-dim">
                  {(activeKitchen.menu_items || []).map(item => {
                    const qty = posCart[item.id] || 0;
                    return (
                      <div key={item.id} className="p-2 bg-paper rounded-xl border border-paper-dim flex items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-ink line-clamp-1">{item.item_name}</div>
                          <div className="text-[11px] text-emerald-700 font-semibold">₹{item.price}</div>
                        </div>

                        {qty === 0 ? (
                          <button
                            type="button"
                            onClick={() => handlePOSAddToCart(item.id)}
                            className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 rounded-lg text-xs font-bold"
                          >
                            + Add
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 rounded-lg px-1.5 py-0.5">
                            <button
                              type="button"
                              onClick={() => handlePOSDecreaseQty(item.id)}
                              className="w-5 h-5 bg-emerald-600 text-white rounded font-bold flex items-center justify-center"
                            >
                              -
                            </button>
                            <span className="font-bold text-emerald-900 text-xs px-1">{qty}</span>
                            <button
                              type="button"
                              onClick={() => handlePOSAddToCart(item.id)}
                              className="w-5 h-5 bg-emerald-600 text-white rounded font-bold flex items-center justify-center"
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery Type & Details */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPosDeliveryType('delivery')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold ${
                    posDeliveryType === 'delivery'
                      ? 'bg-gold/15 border-gold text-gold'
                      : 'bg-paper-sub border-paper-dim text-ink-muted'
                  }`}
                >
                  <Bike size={16} />
                  Ghar / Office Delivery (+₹{activeKitchen.default_delivery_charge ?? 30})
                </button>
                <button
                  type="button"
                  onClick={() => setPosDeliveryType('pickup')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-semibold ${
                    posDeliveryType === 'pickup'
                      ? 'bg-gold/15 border-gold text-gold'
                      : 'bg-paper-sub border-paper-dim text-ink-muted'
                  }`}
                >
                  <Store size={16} />
                  Counter Takeaway / Pickup (₹0)
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-ink font-medium mb-1">Grahak Ka Naam *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Patel"
                    value={posCustomerName}
                    onChange={e => setPosCustomerName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
                <div>
                  <label className="block text-ink font-medium mb-1">Mobile No.</label>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    value={posCustomerPhone}
                    onChange={e => setPosCustomerPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              </div>

              {posDeliveryType === 'delivery' && (
                <div>
                  <label className="block text-ink font-medium mb-1">Delivery Address</label>
                  <input
                    type="text"
                    placeholder="Ghar / Office Pata"
                    value={posAddress}
                    onChange={e => setPosAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                  />
                </div>
              )}

              <div>
                <label className="block text-ink font-medium mb-1">Special Cooking Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Kam mirchi, butter tawa roti, jaldi bhejna"
                  value={posNotes}
                  onChange={e => setPosNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-paper-sub border border-paper-dim text-ink focus:outline-none focus:border-gold"
                />
              </div>

              {/* Tax, Delivery & Payment Status */}
              <div className="bg-paper-sub p-3 rounded-2xl border border-paper-dim space-y-2">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={posApplyGst}
                      onChange={e => setPosApplyGst(e.target.checked)}
                      className="w-4 h-4 rounded text-gold focus:ring-gold"
                    />
                    <span className="font-semibold text-ink">Food GST Lagayein (5%)</span>
                  </label>
                  <span className="text-ink font-mono font-medium">
                    {posApplyGst ? '5% Tax Added' : 'Plain / No Tax (0%)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-paper-dim">
                  <div>
                    <label className="block text-ink-muted text-[11px] mb-1">Payment Status</label>
                    <select
                      value={posPaymentMode}
                      onChange={e => setPosPaymentMode(e.target.value as any)}
                      className="w-full px-2 py-1.5 rounded-xl bg-paper border border-paper-dim text-xs font-semibold focus:outline-none"
                    >
                      <option value="paid">✓ Paid (Chukta)</option>
                      <option value="pending_cod">⏳ Pending COD</option>
                      <option value="khata">📝 Khata (Udhar)</option>
                    </select>
                  </div>
                  <div className="text-right flex flex-col justify-end">
                    <span className="text-[11px] text-ink-muted">Grand Total:</span>
                    <span className="text-base font-extrabold text-emerald-700">
                      ₹{(() => {
                        const sub = Object.entries(posCart).reduce((sum, [id, qty]) => {
                          const item = (activeKitchen.menu_items || []).find(m => m.id === id);
                          return sum + (item ? item.price * qty : 0);
                        }, 0);
                        const gst = posApplyGst ? sub * 0.05 : 0;
                        const del = posDeliveryType === 'delivery' ? (activeKitchen.default_delivery_charge ?? 30) : 0;
                        return (sub + gst + del).toFixed(2);
                      })()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-paper-dim">
                <Button type="button" variant="outline" onClick={() => setIsPOSCartOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                  Order Save & Record Karein
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PHOTO SE DIGITAL MENU BANAYEIN (AI VISION SCANNER) */}
      {isPhotoScannerOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-paper border border-paper-dim w-full max-w-md rounded-3xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-paper-dim pb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Camera size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">📸 Photo Se Digital Menu Banayein</h3>
                  <p className="text-xs text-purple-700 font-medium">AI Vision Menu Scanner</p>
                </div>
              </div>
              <button onClick={() => setIsPhotoScannerOpen(false)} className="text-ink-muted hover:text-ink text-sm">✕</button>
            </div>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-2 text-ink">
                <div className="font-bold flex items-center gap-1.5 text-purple-900">
                  <Sparkles size={16} /> Yeh Feature Kaise Kaam Karta Hai?
                </div>
                <p className="text-xs text-purple-800 leading-relaxed">
                  Aapke dukan ya kitchen ke printed menu card, pamphlet ya board ki photo kheench kar upload karne par, hamara AI automatically:
                </p>
                <ul className="list-disc list-inside space-y-1 text-xs text-purple-900 font-medium">
                  <li>Sabhi 20-30 dishes ke naam read kar lega</li>
                  <li>Unki sahi category (Thali, Sabji, Roti, Nasta) me divide karega</li>
                  <li>Unki prices aur vivran nikal kar live digital menu me add kar dega!</li>
                </ul>
              </div>

              <div className="border-2 border-dashed border-purple-300 rounded-2xl p-6 text-center space-y-2 bg-paper-sub hover:bg-purple-50/30 transition-colors cursor-pointer">
                <Camera size={32} className="mx-auto text-purple-500" />
                <div className="font-semibold text-ink text-xs sm:text-sm">
                  Menu Card Ki Photo Upload Karein
                </div>
                <p className="text-[11px] text-ink-muted">
                  PNG, JPG ya PDF file chunein (Mobile camera se photo le sakte hain)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => alert('AI Vision Scanner pipeline ready hai. Photo upload processing upcoming update me auto-extract karega!')}
                  className="border-purple-400 text-purple-700 text-xs mt-1"
                >
                  Photo Select Karein
                </Button>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-paper-dim">
                <Button type="button" onClick={() => setIsPhotoScannerOpen(false)} className="bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs">
                  Theek Hai (Got It)
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
