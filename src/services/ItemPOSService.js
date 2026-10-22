import BaseService from "./BaseService";

class ItemPOSService extends BaseService {
  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/v1/pos/items`;
    this.initializeRoute();
  }

  get(
    option = {
      limit,
      offset,
      sortField,
      sortOrder,
      filter,
      search,
      locationId,
    },
  ) {
    return this.GET({
      url: `${this.baseUrl}?${this.bindQueryParam(option)}`,
    });
  }
}

export default new ItemPOSService(); 