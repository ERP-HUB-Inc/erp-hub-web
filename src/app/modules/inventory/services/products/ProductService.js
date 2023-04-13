import BaseService from "../BaseService";

class ProductService extends BaseService {

   constructor() {
      super();
      this.module = "inventory/product";
      this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
      this.initializeRoute();
   }

   getPromotionByProductVariantId(productVariantId, orderQuantity = 0, orderAmount = 0) {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/promotion/${productVariantId}?orderQuantity=${orderQuantity}&orderAmount=${orderAmount}`,
         headers: this.header
      });
   }

   getPurchaseHistoryByProductID(id){
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/purchase_history/${id}`,
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

   attributes(id) {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/attributes/${id}`,  
         data: this.data,
         headers: this.header
      });
   }

   getFormData() {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/get_form_data`,
         headers: this.header
      });
   }

   searchForDrowDown(
      limit,
      offset,
      sortField,
      sortOrder,
      filter,
      searchKey,
      searchFor,
      isSearchingBarcode
   ) {
      const languageId = this.getLanguageId();
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/lists/dropdown?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}&languageId=${languageId}&searchFor=${searchFor}&isSearchingBarcode=${isSearchingBarcode}`,  
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
      this.setHeader();
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
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/cost/log/${id}?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&search=${searchKey}`,  
         data: this.data,
         headers: this.header
      });
   }

   archiveVariant(id) {
      this.setHeader();
      return this.DELETE({  
         url: `${this.baseUrl}/variant/archive/${id}`,
         data: this.data,
         headers: this.header
      });
   }

   changeProductVariantStatus(id) {
      this.setHeader();
      return this.PUT({  
         url: `${this.baseUrl}/variant/update/${id}`,
         data: this.data,
         headers: this.header
      });
   }

   editProductCost(productVariantId, newCost) {
      this.setHeader();
      return this.PUT({  
         url: `${this.baseUrl}/edit_cost/${productVariantId}`,
         data: {newCost},
         headers: this.header
      });
   }

   clone(id) {
      this.setHeader();
      return this.POST({
         url: `${this.baseUrl}/clone/${id}`, 
         data: this.data,
         headers: this.header
      });
   }

   detail(
      id,
      productOption,
      isIncludeLocation
   ){
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/detail/${id}?productOption=${productOption}&isIncludeLocation=${isIncludeLocation}&languageId=${this.getLanguageId()}`,
         data: this.data,
         headers: this.header
      });
   }

   getDetailStock(id) {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/stock/${id}`,
         data: this.data,
         headers: this.header
      });
   }

   detailForSplit(productVariantId, locationId) {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/detail_for_split/${productVariantId}?locationId=${locationId}`,
         data: this.data,
         headers: this.header
      });
   }

   splitProduct(productVariantId, dataForSplit) {
      this.setHeader();
      return this.POST({ 
         url: `${this.baseUrl}/split/${productVariantId}`,
         data: dataForSplit,
         headers: this.header
      });
   }

   clear() {
      this.setHeader();
      return this.DELETE({
         url: `${this.baseUrl}/clear`,
         headers: this.header
      });
   }
}

export default new ProductService(); 