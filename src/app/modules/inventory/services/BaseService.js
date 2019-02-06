import Service from "../../common/services/BaseService";

export default class BaseService extends Service {
  constructor() {
    super();
    this.data = {};
    this.header =  {
      "Content-Type": "application/json" 
    };
    this.multipleformdata = {
      "Content-Type": "multipart/form-data" 
    };
  }

  detail(
    ids
  ){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/detail/${ids}`,
      data: this.data,
      headers: this.header
    });
  }

  findPurchaseOrderNumber(ids) {
    this.setHeader();
    return this.GET(
      {
        url: `${this.baseUrl}/check/number/${ids}`,
        data: this.data,     
        headers: this.header
      }
    );
  }
  

  lists(
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
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId}`,  
      data: this.data,
      headers: this.header
    });
  }

  listsLanguage(
    limit,
    languageId
  ){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists?languageId=en&limit=${limit}`,
      data: this.data,
      headers: this.header
    });
  }

  archive(ids) {
    this.setHeader();
    return this.DELETE({  
      url: `${this.baseUrl}/archive/${ids}`,
      data: this.data,
      headers: this.header
    });
  }

  add(data) {
    this.setHeader();
    return this.POST({
      url: `${this.baseUrl}/create`, 
      data: {
        ...data,
        isSystem: 0
      },
      headers: this.header
    });
  }

  update(data) {
    this.setHeader();
    const {id} = data;
    return this.PUT({
      url: `${this.baseUrl}/update/${id}`,
      data: {
        ...data
      },
      headers: this.header
    });
  }
  
}