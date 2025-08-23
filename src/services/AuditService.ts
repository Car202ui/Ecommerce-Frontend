import { apiClient } from './ProductService';
import type { AuditLog, Page } from '@/types';

class AuditService {
  recent(size = 10) {
    return apiClient.get<AuditLog[]>(`/audit/recent`, { params: { size } });
  }

  byEntity(params: { entity: string; entityId: number; page?: number; size?: number; sort?: string }) {
    const { entity, entityId, page = 0, size = 10, sort = 'changeTimestamp,desc' } = params;
    return apiClient.get<Page<AuditLog>>(`/audit`, { params: { entity, entityId, page, size, sort } });
  }

  get(id: number) {
    return apiClient.get<AuditLog>(`/audit/${id}`);
  }
}

export default new AuditService();
