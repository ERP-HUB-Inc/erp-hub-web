import BaseService from './BaseService';

export class ExpenseService extends BaseService {
  constructor(baseUrl) {
    super();
    this.root = this.baseUrl;
    this.baseUrl = baseUrl || `${this.root}/finance/expenses`;
  }

  get({ limit = 100, offset = 0 } = {}) {
    this.setHeader();
    return this.GET({ url: this.baseUrl, headers: this.header, params: { limit, offset } });
  }

  summary({ month, locationId } = {}) {
    this.setHeader();
    const params = { month };
    if (locationId) params.locationId = locationId;
    return this.GET({ url: `${this.baseUrl}/summary`, headers: this.header, params });
  }

  commitments({ locationId } = {}) {
    this.setHeader();
    const params = locationId ? { locationId } : {};
    return this.GET({ url: `${this.baseUrl}/accounting/commitments`, headers: this.header, params });
  }

  addCommitment(data) {
    this.setHeader();
    return this.POST({ url: `${this.baseUrl}/accounting/commitments`, headers: this.header, data });
  }

  updateCommitment({ id, ...data }) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/accounting/commitments/${encodeURIComponent(id)}`, headers: this.header, data });
  }

  deleteCommitment(id) {
    this.setHeader();
    return this.DELETE({ url: `${this.baseUrl}/accounting/commitments/${encodeURIComponent(id)}`, headers: this.header });
  }

  payableBills({ locationId } = {}) {
    this.setHeader();
    const params = locationId ? { locationId } : {};
    return this.GET({ url: `${this.baseUrl}/accounting/bills/payable`, headers: this.header, params });
  }

  bills({ status, locationId } = {}) {
    this.setHeader();
    const params = {};
    if (status) params.status = status;
    if (locationId) params.locationId = locationId;
    return this.GET({ url: `${this.baseUrl}/accounting/bills`, headers: this.header, params });
  }

  updateBillStatus({ id, status }) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/accounting/bills/${encodeURIComponent(id)}/status`, headers: this.header, data: { status } });
  }

  reconciledPaymentAllocations({ month, locationId, limit = 100, offset = 0 } = {}) {
    this.setHeader();
    const params = { month, limit, offset };
    if (locationId) params.locationId = locationId;
    return this.GET({ url: `${this.baseUrl}/accounting/payments/allocations`, headers: this.header, params });
  }

  recordPayment(data) {
    this.setHeader();
    return this.POST({ url: `${this.baseUrl}/accounting/payments`, headers: this.header, data });
  }

  reconcilePayment({ id, allocations }) {
    this.setHeader();
    return this.POST({ url: `${this.baseUrl}/accounting/payments/${encodeURIComponent(id)}/reconcile`, headers: this.header, data: { allocations } });
  }

  generationSettings() {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/accounting/generation-settings`, headers: this.header });
  }

  saveGenerationSettings(data) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/accounting/generation-settings`, headers: this.header, data });
  }

  getById(id) {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }

  add(data) {
    this.setHeader();
    return this.POST({ url: this.baseUrl, headers: this.header, data });
  }

  update({ id, ...data }) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header, data });
  }

  archive(id) {
    this.setHeader();
    return this.DELETE({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }

  categories() {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/categories`, headers: this.header });
  }

  currencies({ limit = 100, offset = 0 } = {}) {
    this.setHeader();
    return this.GET({ url: `${this.root}/currencies`, headers: this.header, params: { limit, offset } });
  }

  upload(file, onUploadProgress) {
    this.setHeader();
    const data = new FormData();
    data.append('file', file);
    return this.POST({ url: `${this.root}/files/upload/expense`, headers: { Authorization: this.header.Authorization }, data, onUploadProgress });
  }
}

export default new ExpenseService();
