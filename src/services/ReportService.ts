import { apiClient } from './ProductService';
import type { TopSoldProductDto, TopCustomerDto } from '@/types';

class ReportService {
  getActiveProductsReport() {
    return apiClient.get('/reports/products/active');
  }

  getTopSellingProductsReport() {
    return apiClient.get<TopSoldProductDto[]>('/reports/products/top-selling');
  }

  getTopFrequentCustomersReport() {
    return apiClient.get<TopCustomerDto[]>('/reports/customers/top-frequent');
  }
}

export default new ReportService();