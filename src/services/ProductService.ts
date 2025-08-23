// src/services/ProductService.ts
import axios from 'axios';
import type { Product } from '@/types';

export const apiClient = axios.create({
  baseURL: 'http://localhost:9091/api', // ajusta si usas otro host/puerto
  headers: { 'Content-Type': 'application/json' }
});

/** INTERCEPTOR: adjunta el JWT a TODAS las requests */
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // o desde tu store si lo guardas allí
  if (token) {
    config.headers = config.headers ?? {};
    (config.headers as any).Authorization = `Bearer ${token}`;
  }
  return config;
});

export type ProductSearchFilters = {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  active?: boolean | null; // null = todos
  id?: number;
};

const toNumber = (v: unknown) => {
  if (v === null || v === undefined) return undefined;
  if (typeof v === 'number') return isNaN(v) ? undefined : v;
  if (typeof v === 'string') {
    const cleaned = v.replace(/\s/g, '').replace(/,/g, '');
    const num = Number(cleaned);
    return isNaN(num) ? undefined : num;
  }
  return undefined;
};

const sanitize = (filters: Record<string, any>) => {
  const params: Record<string, any> = {};
  for (const [k, v] of Object.entries(filters)) {
    if (v === '' || v === null || v === undefined) continue;

    if (k === 'minPrice' || k === 'maxPrice' || k === 'id') {
      const n = toNumber(v);
      if (n !== undefined) params[k] = n;
      continue;
    }

    if (k === 'active') {
      if (v === true || v === false) params[k] = v;
      else if (typeof v === 'string') {
        if (v.toLowerCase() === 'true') params[k] = true;
        if (v.toLowerCase() === 'false') params[k] = false;
      }
      continue;
    }

    params[k] = v;
  }
  return params;
};

const ProductService = {

  getAllProducts() {
    return apiClient.get<Product[]>('/products');
  },


  search(filters: ProductSearchFilters) {
    return apiClient.get<Product[]>('/products/search', { params: sanitize(filters) });
  },


  searchProductsByName(name: string) {
    return apiClient.get<Product[]>('/products/search', { params: { q: name } });
  },

 
  createProduct(payload: Partial<Product>) {
    return apiClient.post<Product>('/products', payload);
  },
  updateProduct(id: number, payload: Partial<Product>) {
    return apiClient.put<Product>(`/products/${id}`, payload);
  },
  deleteProduct(id: number) {
    return apiClient.delete<void>(`/products/${id}`);
  }
};

export default ProductService;
