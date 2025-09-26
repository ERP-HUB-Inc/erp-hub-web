import axios from "axios";
import ConstantAuth from "../app/modules/common/constants/authentication";
import Util from "../app/modules/common/util";

export default class BaseService {

   constructor() {
      this.baseUrl = `${this.generateAPIUrl()}/g8w4y-32as9v`;
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
      let port = process.env.REACT_APP_API_PORT;

      const url = `${host}:${port}`;
      return url;
   }

   async POST(option = { url: "", headers: {}, data: {} }) {
    const csrfToken = await this.getCsrfToken();

    const response = await axios({
      method: "POST",
      url: this.baseUrl + option.url,
      data: option.data,
      headers: {
        "X-CSRF-Token": csrfToken,
        ...option.headers,
      },
      withCredentials: true,
    });
   }

   GET(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      const response = axios({
         method: "GET",
         ...option
      });
      return response;
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
}
