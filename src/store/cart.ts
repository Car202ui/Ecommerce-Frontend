// Archivo: src/store/cart.ts

import { defineStore } from 'pinia';
import type { Product, CartItem } from '@/types';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),

  getters: {
    totalAmount: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    itemCount: (state) => {
      return state.items.reduce((count, item) => count + item.quantity, 0);
    }
  },

  actions: {
    addItem(product: Product) {
      const existingItem = this.items.find(item => item.id === product.id);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    
    
    removeItem(productId: number) {
      this.items = this.items.filter(item => item.id !== productId);
    },

    updateQuantity(productId: number, quantity: number) {
      const item = this.items.find(item => item.id === productId);
      if (item) {
        if (quantity > 0) {
          item.quantity = quantity;
        } else {
    
          this.removeItem(productId);
        }
      }
    },
   

    clearCart() {
      this.items = [];
    },
  },
});