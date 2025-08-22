
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