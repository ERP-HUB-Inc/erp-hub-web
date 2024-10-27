import BaseService from "../BaseService";

class StockTransferService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/stock/transfer";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  listsReceive(
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
      url: `${this.baseUrl}/lists/receive?limit=${limit}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId}`,  
      data: this.data,
      headers: this.header
    });
  }

  detail(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/detail/${id}?languageId=${this.getLanguageId()}`,
      data: this.data,
      headers: this.header
    });
  }

  cancle(data) {
    this.setHeader();
    const {id} = data;
    return this.PUT({
      url: `${this.baseUrl}/cancel/${id}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new StockTransferService();