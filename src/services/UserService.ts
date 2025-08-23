import { apiClient } from './ProductService';
import type { User, UserRegister } from '@/types'; // 👈 sin UserUpdate


type UpdatePayload = {
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  frequent?: boolean;
  roles?: string[]; 
};

class UserService {
  getAllUsers() {
    return apiClient.get<User[]>('/users');
  }

  createUser(payload: UserRegister) {
    return apiClient.post<User>('/auth/register', payload);
  }

  updateUser(id: number, payload: UpdatePayload) {
    return apiClient.put<User>(`/users/${id}`, payload);
  }

  deleteUser(id: number) {
    return apiClient.delete<void>(`/users/${id}`);
  }
}

export default new UserService();
