import BaseService from './BaseService';

export class ItemTypeService extends BaseService {
  constructor(baseUrl) {
    super();
    this.baseUrl = baseUrl || `${this.baseUrl}/item-types`;
  }

  get({ limit = 20, offset = 0, sortField = 'sortOrder', sortOrder = 'ASC', search = '' } = {}) {
    this.setHeader();
    return this.GET({ url: this.baseUrl, headers: this.header, params: { limit, offset, sortField, sortOrder, search } });
  }

  getById(id) {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }

  add(data) {
    this.setHeader();
    // Temporary compatibility with the current backend; ownership must also be enforced there.
    const clientId = this.Util.getClientId();
    if (!clientId) return Promise.reject(new Error('Your workspace could not be identified. Please sign in again.'));
    return this.POST({ url: this.baseUrl, headers: this.header, data: { ...data, image: '', clientId, isSystem: false } });
  }

  update({ id, ...data }) {
    this.setHeader();
    return this.PUT({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header, data });
  }

  archive(id) {
    this.setHeader();
    return this.DELETE({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }
}

export default new ItemTypeService();
