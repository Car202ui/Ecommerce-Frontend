import { apiClient } from './ProductService';
import type { CartItem } from '@/types';

interface OrderItemRequest { productId: number; quantity: number; }
interface CreateOrderRequest { items: OrderItemRequest[]; randomOrder: boolean; }


export interface OrderDto {
  id: number; orderDate: string; status: string;
  totalAmount: number | string; discountApplied: number | string; finalAmount: number | string;
  items: { productId:number; productName:string; quantity:number; pricePerUnit:number|string }[];
}

class OrderService {
  createOrder(cartItems: CartItem[]) {
    const body: CreateOrderRequest = {
      items: cartItems.map(i => ({ productId: i.id, quantity: i.quantity })),
      randomOrder: false,
    };
    return apiClient.post<OrderDto>('/orders/create', body);
  }

  getOrdersForCurrentUser() {
    return apiClient.get<OrderDto[]>('/orders/my-orders'); 
  }
}
export default new OrderService();
