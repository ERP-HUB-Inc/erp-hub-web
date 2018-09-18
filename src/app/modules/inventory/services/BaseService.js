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
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.GET({ 
      url: `${this.baseUrl}/detail/${ids}`,
      data: this.data,
      headers: this.header
    });
  }

  findPurchaseOrderNumber(ids) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
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
    languageId = "en",
    rangFilter// {"column": "createdAtt", "value": [1, 100]}
  ) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${languageId}`,  
      data: this.data,
      headers: this.header
    });
  }
  listsLanguage(
    limit,
    languageId
  ){
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists?languageId=en&limit=${limit}`,
      data: this.data,
      headers: this.header
    });
  }

  archive(ids) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.DELETE({  
      url: `${this.baseUrl}/archive/${ids}`,
      data: this.data,
      headers: this.header
    });
  }

  add(data) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
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
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
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