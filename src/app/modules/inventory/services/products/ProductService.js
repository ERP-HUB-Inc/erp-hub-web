import BaseService from "../BaseService";
import ConstantAuth from "../../../common/constants/authentication";

class ProductService extends BaseService {

  constructor() {
    super();
    this.module = "inventory/product";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey // {"column": ["columnname1", "columnname2"], "value": "hello"}
  ) {
    let languageId = "en";
    const currentSetting = this.Util.getSetting();
    
    if (currentSetting != null && "defaultLanguageCode" in currentSetting) {
      languageId = currentSetting.defaultLanguageCode;
    }

    return super.lists(limit,
      offset,
      sortField,
      sortOrder,
      filter,
      searchKey,
      languageId);
  }

  searchForDrowDown(
    limit,
    offset,
    sortField,
    sortOrder,
    filter,
    searchKey
  ) {
    let languageId = "en";
    const currentSetting = this.Util.getSetting();
    
    if (currentSetting != null && "defaultLanguageCode" in currentSetting) {
      languageId = currentSetting.defaultLanguageCode;
    }

    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/lists/dropdown?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}&languageId=${languageId}`,  
      data: this.data,
      headers: this.header
    });
  }

  logList(
    id,
    limit,
    offset,
    sortField,
    sortOrder,
    filter,
    searchKey
  ) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/log/${id}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}`,  
      data: this.data,
      headers: this.header
    });
  }

  costLogList(
    id,
    limit,
    offset,
    sortField,
    sortOrder,
    filter,
    searchKey
  ) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.GET({ 
      url: `${this.baseUrl}/cost/log/${id}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}`,  
      data: this.data,
      headers: this.header
    });
  }

  archiveVariant(id) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.DELETE({  
      url: `${this.baseUrl}/variant/archive/${id}`,
      data: this.data,
      headers: this.header
    });
  }

  changeStatusProductVarait(id) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.PUT({  
      url: `${this.baseUrl}/variant/update/${id}`,
      data: this.data,
      headers: this.header
    });
  }

  clone(id) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
    return this.POST({
      url: `${this.baseUrl}/clone/${id}`, 
      data: this.data,
      headers: this.header
    });
  }
}

export default new ProductService(); 