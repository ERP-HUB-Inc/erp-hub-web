import BaseService from "../BaseService";

class StoreLocationService extends BaseService {

  constructor() {
    super();
    this.module = "location";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  listsLocationAccess(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    rangFilter,// {"column": "createdAtt", "value": [1, 100]}
    locationId
  ) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists/useracess?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId}`,  
      data: this.data,
      headers: this.header
    });
  }
}

export default new StoreLocationService();