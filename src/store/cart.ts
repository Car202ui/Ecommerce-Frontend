// Archivo: src/store/cart.ts

import { defineStore } from 'pinia';
import type { Product, CartItem } from '@/types'; // Importamos los tipos

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[], // Le decimos que 'items' es un array de CartItem
  }),

  getters: {
    totalAmount: (state) => {
      return state.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
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
    
    clearCart() {
      this.items = [];
    },
  },
});