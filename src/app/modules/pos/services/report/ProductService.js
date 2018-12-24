import BaseService from "../BaseService";

class ProductService extends BaseService {
  constructor() {
    super();
    this.module = "report/inventory/product";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    locationId
  ) {
    return super.lists(limit,
      offset,
      sortField,
      sortOrder,
      filter,
      searchKey,
      "",
      locationId);
  }
  
}

export default new ProductService();