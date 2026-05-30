import BaseService from "./BaseService";

class CategoryService extends BaseService {

  constructor() {
    super();
    this.baseUrl = `${this.baseUrl}/categories`;
  }

  getCategoriesPOS(option = {
      limit: 15,
      offset: 0,
      sortField: "",
      sortOrder: "",
      filter: "",
      startDate: "",
      endDate: "",
      search: "",
      locationId: "",
      type: ""
   }) {
      return this.GET({ 
         url: `${this.baseUrl}/pos?${this.bindQueryParam(option)}`,  
         data: this.data,
         headers: this.header
      });
   }
}

export default new CategoryService();