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

  getOptions(id) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/options/${id}`,
      headers: this.header,
    });
  }

  getVariantByOptionValueId(optionValueId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/variant_by_option_value/${optionValueId}`,
      headers: this.header,
    });
  }
}

export default new ItemPOSService(); 