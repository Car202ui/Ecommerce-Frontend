
export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  frequent?: boolean;
  roles?: Role[];
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
    stock?: number;
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


export interface Role {
  id: number;
  name: string;
}

export interface User {
  id: number; username: string; email: string;
  firstName: string; lastName: string; frequent: boolean; roles: Role[];
}


export interface Role { id: number; name: string; }

export interface UserUpdate {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  frequent?: boolean;
  roles?: Role[]; 
}


export interface AuditLog {
  id: number;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | string;
  entityName: string;
  entityId: number;
  changedBy: string;
  changeTimestamp: string; 
  details: string;         
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;   
}
