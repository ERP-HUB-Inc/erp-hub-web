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
    return this.GET({ 
      url: `${this.baseUrl}/detail/${ids}`,
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
    searchKey // {"column": ["columnname1", "columnname2"], "value": "hello"}
  ) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}`,  
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
    const {id} = data;
    return this.PUT({
      url: `${this.baseUrl}/update/${id}`,
      data: {
        ...data,
        isSystem: 0,
        isDefault: 0
      },
      headers: this.header
    });
  }
  
}