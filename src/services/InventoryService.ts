import { apiClient } from './ProductService';

export interface InventoryDto {
  productId: number;
  quantity: number;
}

const InventoryService = {

  getByProduct(productId: number) {
    return apiClient.get<InventoryDto>(`/inventory/${productId}`);
  },


  setQuantity(productId: number, quantity: number) {
    return apiClient.post(`/inventory/${productId}`, null, { params: { quantity } });
  },


  adjust(productId: number, quantityChange: number) {
    return apiClient.put(`/inventory/${productId}`, null, { params: { quantityChange } });
  }
};

export default InventoryService;
