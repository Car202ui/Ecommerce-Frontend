
import { apiClient } from './ProductService'; 
import type { CartItem } from '@/types';


interface OrderItemRequest {
    productId: number;
    quantity: number;
}

interface CreateOrderRequest {
    items: OrderItemRequest[];
    isRandomOrder: boolean;
}

class OrderService {
    createOrder(cartItems: CartItem[]) {
        const orderRequest: CreateOrderRequest = {
            items: cartItems.map(item => ({
                productId: item.id,
                quantity: item.quantity,
            })),
            isRandomOrder: false 
        };
       return apiClient.post('orders/create', orderRequest);
    }

     getOrdersForCurrentUser() {
        return apiClient.get('orders/my-orders');
    }
}

export default new OrderService();