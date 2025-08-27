import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent, isSupported } from 'firebase/analytics';
import { getFirestore, collection, getDocs, doc, getDoc, query, orderBy, limit, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCR9hrbs7pYA5wlJoRPa9KdOno3PByn4eM",
  authDomain: "kaysha-designs.firebaseapp.com",
  projectId: "kaysha-designs",
  storageBucket: "kaysha-designs.firebasestorage.app",
  messagingSenderId: "347447857229",
  appId: "1:347447857229:web:ed19ab30ba2677749bcc04",
  measurementId: "G-HH8GQB1LKC"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;

if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export const trackEvent = (eventName: string, parameters?: Record<string, string | number>) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: window.location.href,
  });
};

export const trackProductView = (productId: string, productName: string) => {
  trackEvent('view_item', {
    item_id: productId,
    item_name: productName,
  });
};

export const trackAddToCart = (productId: string, productName: string, price: number) => {
  trackEvent('add_to_cart', {
    item_id: productId,
    item_name: productName,
    value: price,
  });
};

export const trackPurchaseIntent = (productId: string, productName: string, price: number, method: 'buy_now' | 'cart') => {
  trackEvent('purchase_intent', {
    item_id: productId,
    item_name: productName,
    value: price,
    method: method,
  });
};

export const trackShare = (productId: string, productName: string, method: 'copy' | 'whatsapp' | 'facebook' | 'twitter') => {
  trackEvent('share', {
    item_id: productId,
    item_name: productName,
    method: method,
  });
};

export const trackFavorite = (productId: string, productName: string, action: 'add' | 'remove') => {
  trackEvent('add_to_wishlist', {
    item_id: productId,
    item_name: productName,
    action: action,
  });
};

export const trackImageView = (productId: string, imageIndex: number, totalImages: number) => {
  trackEvent('view_item_image', {
    item_id: productId,
    image_index: imageIndex,
    total_images: totalImages,
  });
};

export const trackImageModal = (productId: string, action: 'open' | 'close') => {
  trackEvent('image_modal', {
    item_id: productId,
    action: action,
  });
};

export const trackImageAutoScroll = (productId: string, imageIndex: number) => {
  trackEvent('image_auto_scroll', {
    item_id: productId,
    image_index: imageIndex,
  });
};

export type Product = {
  id: string;
  name: string;
  descriptionSuits?: string;
  sellingPrice: number;
  discountedPrice?: number;
  category: string;
  subCategory?: string;
  size: string[];
  color?: string;
  bestSellerNumber: number;
  mainImageLink: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export type Suit = {
  id: string;
  productId: string;
  suitsId: string;
  sold: number;
  price: number;
  size: string;
  createdAt: string;
  updatedAt: string;
};

export { analytics };