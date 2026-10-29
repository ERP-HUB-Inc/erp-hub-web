import BaseService from './BaseService';

export class SettingsUnitService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/units`;
  }

  get({ limit = 20, offset = 0, sortField = 'name', sortOrder = 'ASC', search = '' } = {}) {
    this.setHeader();
    return this.GET({
      url: this.baseUrl,
      headers: this.header,
      params: { limit, offset, sortField, sortOrder, search }
    });
  }

  getById(id) {
    this.setHeader();
    return this.GET({ url: `${this.baseUrl}/${encodeURIComponent(id)}`, headers: this.header });
  }

  add(data) {
    this.setHeader();
    return this.POST({ url: this.baseUrl, headers: this.header, data: { ...data, isSystem: 0 } });
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

export default new SettingsUnitService();
