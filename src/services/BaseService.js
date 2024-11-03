import axios from "axios";
import Service from "./Core";

export default class BaseService extends Service {
   constructor() {
      super();
      this.header =  {
         "Content-Type": "application/json" 
      };
      this.multipleformdata = {
         "Content-Type": "multipart/form-data" 
      };
   }

   POST(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return axios({
         method: "POST",
         ...option
      });
   }

   GET(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return axios({
         method: "GET",
         ...option
      });
   }

   PUT(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return axios({
         method: "PUT",
         ...option
      });
   }

   DELETE(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      const response = axios({
         method: "DELETE",
         ...option
      });
      return response;
   }

   getById(ids){
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}/detail/${ids}`,
         data: this.data,
         headers: this.header
      });
   }

   get(
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
         url: `${this.baseUrl}?limit=${limit ? limit : 0}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId ? locationId : 0}`,  
         data: this.data,
         headers: this.header
      });
   }

   archive(ids) {
      this.setHeader();
      return this.DELETE({  
         url: `${this.baseUrl}/${ids}`,
         data: this.data,
         headers: this.header
      });
   }

   add(data) {
      this.setHeader();
      return this.POST({
         url: `${this.baseUrl}`, 
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
         url: `${this.baseUrl}/${id}`,
         data: {
         ...data
         },
         headers: this.header
      });
   }
}