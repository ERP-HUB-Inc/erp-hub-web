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
    const currentSetting = this.Util.getSetting(ConstantAuth.ACCESS_TOKEN);
    
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

  archiveVariant(id) {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`;
    return this.DELETE({  
      url: `${this.baseUrl}/variant/archive/${id}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new ProductService(); 