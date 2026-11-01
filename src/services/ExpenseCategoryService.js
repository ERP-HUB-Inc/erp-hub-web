import BaseService from './BaseService';

export class ExpenseCategoryService extends BaseService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl || `${this.baseUrl}/expense/categories`;
  }

  get({ limit = 20, offset = 0, search = '' } = {}) {
    this.setHeader();
    return this.GET({ url: this.baseUrl, headers: this.header, params: { limit, offset, search } });
  }

  getById(id) {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }

  add({ name, namekh }) {
    this.setHeader();
    return this.POST({ url: this.baseUrl, headers: this.header, data: { name, namekh } });
  }

  update({ id, name, namekh }) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header, data: { name, namekh } });
  }

  archive(id) {
    this.setHeader();
    return this.DELETE({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }
}

export default new ExpenseCategoryService();
