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

   bindQueryParam(option) {
      const queryParams = [];
   
      if (option.limit) queryParams.push(`limit=${option.limit}`)
      if (option.offset) queryParams.push(`offset=${option.offset}`);
      if (option.sortField) queryParams.push(`sortField=${option.sortField}`);
      if (option.sortOrder) queryParams.push(`sortOrder=${option.sortOrder}`);
      if (option.filter) queryParams.push(`filter=${option.filter}`);
      if (option.search) queryParams.push(`search=${option.search}`);
      if (option.locationId) queryParams.push(`locationId=${option.locationId}`);
      if (option.startDate) queryParams.push(`startDate=${option.startDate}`);
      if (option.endDate) queryParams.push(`endDate=${option.endDate}`);
   
      return queryParams.map((param, index) => index === 0 ? param : `&${param}`).join('');
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

   PATCH(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return axios({
         method: "PATCH",
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

   get(option = {
      limit: 15,
      offset: 0,
      sortField: "",
      sortOrder: "",
      filter: "",
      search: "",
      locationId: ""
   }) {
      this.setHeader();
      return this.GET({ 
         url: `${this.baseUrl}?${this.bindQueryParam(option)}`,  
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
   
}