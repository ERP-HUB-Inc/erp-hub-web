import Service from "../../common/services/BaseService";

export default class BaseService extends Service {
  constructor() {
    super();
    this.data = {};
    this.header =  {
      "Content-Type": "application/json"
    };
  }

  detail(ids){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/detail/${ids}?languageId=${this.getLanguageId()}`,
      data: this.data,
      headers: this.header
    });
  }
  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    rangFilter
  ) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}&rangFilter=${rangFilter}`,  
      data: this.data,
      headers: this.header
    });
  }

  listsSearch(
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    rangFilter // {"column": ["columnname1", "columnname2"], "value": "hello"}
  ) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/lists?filter=${filter}&rangFilter=${rangFilter}`,  
      data: this.data,
      headers: this.header
    });
  }


  archive(ids) {
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
        isSystem: 0,
        isDefault: 0
      },
      headers: this.header
    });
  }

  update(data) {
    return this.PUT({
      url: `${this.baseUrl}/update/${data.id}`,
      data: {
        ...data
      },
      headers: this.header
    });
  }
  
}