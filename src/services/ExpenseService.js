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

  categories() {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/categories`, headers: this.header });
  }

  currencies({ limit = 100, offset = 0 } = {}) {
    this.setHeader();
    return this.GET({ url: `${this.root}/currencies`, headers: this.header, params: { limit, offset } });
  }

  locations({ limit = 100, offset = 0 } = {}) {
    this.setHeader();
    return this.GET({ url: `${this.root}/locations/useracess`, headers: this.header, params: { limit, offset } });
  }

  upload(file, onUploadProgress) {
    this.setHeader();
    const data = new FormData();
    data.append('file', file);
    return this.POST({ url: `${this.root}/files/upload/expense`, headers: { Authorization: this.header.Authorization }, data, onUploadProgress });
  }
}

export default new ExpenseService();
