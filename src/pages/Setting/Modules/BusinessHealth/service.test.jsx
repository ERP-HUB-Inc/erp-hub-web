import { BusinessHealthPolicyService } from '@services/BusinessHealthPolicyService';

test('request options whitelist fields and put the disable version in the query', () => {
  const service = new BusinessHealthPolicyService('http://localhost/business-health-policies');
  jest.spyOn(service, 'setHeader').mockImplementation(() => {});
  ['GET', 'POST', 'PUT', 'DELETE'].forEach(method => jest.spyOn(service, method).mockResolvedValue({}));
  const thresholds = { healthyCoveragePercent: 110, criticalBelowCoveragePercent: 60 };
  service.get();
  service.add({ ...thresholds, enabled: true, version: 'ignored', businessId: 'ignored' });
  service.update({ ...thresholds, expectedVersion: 'v2', version: 'ignored', enabled: true });
  service.disable('v3 & next');
  expect(service.GET).toHaveBeenCalledWith({ url: service.baseUrl, headers: service.header });
  expect(service.POST.mock.calls[0][0].data).toEqual(thresholds);
  expect(service.PUT.mock.calls[0][0].data).toEqual({ ...thresholds, expectedVersion: 'v2' });
  expect(service.DELETE).toHaveBeenCalledWith({ url: service.baseUrl, headers: service.header, params: { expectedVersion: 'v3 & next' } });
  expect(service.setHeader).toHaveBeenCalledTimes(4);
});
