
export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
}

export interface LoginResponse {
    accessToken: string;
}


export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    active: boolean;
}


export interface CartItem extends Product {
    quantity: number;
}

export interface OrderItemDto {
  productId: number;
  quantity: number;
  pricePerUnit: number; 
  productName: string;
}

export interface OrderDto {
  id: number;
  userId: number;
  username: string;
  orderDate: string;
  status: string;
  totalAmount: number; 
  discountApplied: number;
  finalAmount: number; 
  items: OrderItemDto[]; 
}


export interface TopSoldProductDto {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface TopCustomerDto {
  userId: number;
  username: string;
  orderCount: number;
}