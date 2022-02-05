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

  exportProducts(search, locationId) {
    this.setHeader();
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/exports?locationId=${locationId}&search=${search}`,  
      headers: this.header
    });
  }
  
}

export default new ProductService();