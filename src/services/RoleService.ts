import { apiClient } from './ProductService';

export interface Role { id: number; name: string; }

const RoleService = {
  getAll() { return apiClient.get<Role[]>('/roles'); }
};

export default RoleService;
