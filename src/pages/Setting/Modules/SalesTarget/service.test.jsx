import { SalesTargetService } from '@services/SalesTargetService';

test('requests use the supported filters, numeric IDs, full payloads and comma-separated disable IDs', () => {
  const service = new SalesTargetService();
  jest.spyOn(service, 'setHeader').mockImplementation(() => {});
  ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => jest.spyOn(service, method).mockResolvedValue({}));
  service.list({ locationId: '1 & 2', status: 'INACTIVE', targetType: 'MONTHLY', year: 2026, limit: 20, offset: 40, search: 'ignored' });
  expect(service.GET.mock.calls[0][0].params).toEqual({ locationId: '1 & 2', status: 'INACTIVE', targetType: 'MONTHLY', year: 2026, limit: 20, offset: 40 });
  const payload = { locationId: '1', targetType: 'YEARLY', year: 2026, month: null, quarter: null, targetRevenue: 15000, status: 'INACTIVE' };
  service.save({ ...payload, id: 12, createdAt: 'ignored' });
  expect(service.POST.mock.calls[0][0].data).toEqual(payload);
  service.save({ ...payload, id: 12 }, 12);
  expect(service.PUT.mock.calls[0][0]).toMatchObject({ url: `${service.baseUrl}/sales-targets/12`, data: payload });
  service.getById(12);
  expect(service.GET).toHaveBeenLastCalledWith({ url: `${service.baseUrl}/sales-targets/12`, headers: service.header });
  service.disable([12, 13]);
  expect(service.DELETE).toHaveBeenCalledWith({ url: `${service.baseUrl}/sales-targets/12,13`, headers: service.header });
});
