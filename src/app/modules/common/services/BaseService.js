import axios from "axios";
import ConstantAuth from "../constants/authentication";
import Util from "../util";

export default class BaseService {

   constructor() {
      this.baseUrl = this.generateAPIUrl();
      this.version = "v1";
      this.module = "";
      this.Util = new Util();
      this.ConstantAuth = ConstantAuth;
      this.header = {
         "Content-Type": "application/json"
      };
   }

   initializeRoute() {
      this.createRoute = `${this.module}/create`;
      this.updateRoute = `${this.module}/update`;
      this.listRoute = `${this.module}/lists`;
      this.detailRoute = `${this.module}/detail`;
      this.archiveRoute = `${this.module}/archive`;
   }

   bindQueryParam(option) {
      let queryParam = "";
      if (option) {
         Object.keys(option).forEach((key, index) => {
         if (index === 0) {
            queryParam += `${key}=${option[key]}`;
         } else {
            queryParam += `&${key}=${option[key]}`;
         }
         });
      }
      return queryParam;
   }

   getLanguageId() {
      let languageId = "en";
      const currentSetting = this.Util.getSetting();
      
      if (currentSetting && "defaultLanguageCode" in currentSetting) {
         languageId = currentSetting.defaultLanguageCode;
      }

      return languageId;
   }

   setHeader() {
      this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
   }

   generateAPIUrl() {
      let host = process.env.REACT_APP_API_HOST;
      let port = process.env.REACT_APP_API_PROD_PORT;
      if (process.env.REACT_APP_ENV === "DEV") {
         host = process.env.REACT_APP_API_DEV_HOST;
         port = process.env.REACT_APP_API_PORT;
      } else if (process.env.REACT_APP_ENV === "PRE_PROD") {
         port = process.env.REACT_APP_API_PRE_PROD_PORT;
      }

      const rootPath = process.env.REACT_APP_API_ROOT;
      const url = `${host}:${port}/${rootPath}`;
      return url;
   }

   POST(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      const response = axios({
         method: "POST",
         ...option
      });
      return response;
   }

   GET(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      try {
         const response = axios({
            method: "GET",
            ...option
         });
         return response;  
      } catch (error) {
         
      }
   }

   PUT(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      const response = axios({
         method: "PUT",
         ...option
      });
      return response;
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
}
