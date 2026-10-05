import axios from "axios";
import ConstantAuth from "../constants/authentication";
import Util from "../util";

let refreshTokenRequest = null;

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

   isTokenExpiredError(error) {
      const status = error && error.response && error.response.status;
      const code = error && error.response && error.response.data && error.response.data.error && error.response.data.error.code;
      return status === 401 || code === 606;
   }

   isAuthRefreshAllowed(url = "") {
      return url.indexOf("/auth/login") === -1 && url.indexOf("/auth/refresh-token") === -1;
   }

   refreshAccessToken() {
      const accessToken = this.Util.getAccessToken();
      const refreshToken = this.Util.getRefreshToken();

      if (!accessToken || !refreshToken) {
         return Promise.reject(new Error("Missing refresh token"));
      }

      if (!refreshTokenRequest) {
         refreshTokenRequest = axios({
            method: "POST",
            url: `${this.generateAPIUrl()}/auth/refresh-token`,
            headers: {
               "Content-Type": "application/json",
               "Authorization": `Bearer ${accessToken}`
            },
            data: { refreshToken }
         })
            .then(response => {
               const data = response && response.data && response.data.data ? response.data.data : response.data;
               const nextAccessToken = data && (data.accessToken || data.token);
               const nextRefreshToken = data && data.refreshToken;

               this.Util.updateAuthTokens(nextAccessToken, nextRefreshToken);
               return nextAccessToken;
            })
            .finally(() => {
               refreshTokenRequest = null;
            });
      }

      return refreshTokenRequest;
   }

   request(option, method) {
      const requestOption = {
         method,
         ...option
      };

      return axios(requestOption).catch(error => {
         if (requestOption._retry || !this.isAuthRefreshAllowed(requestOption.url) || !this.isTokenExpiredError(error)) {
            return Promise.reject(error);
         }

         return this.refreshAccessToken().then(accessToken => {
            requestOption._retry = true;
            requestOption.headers = {
               ...(requestOption.headers || {}),
               "Authorization": `Bearer ${accessToken}`
            };
            return axios(requestOption);
         });
      });
   }

   generateAPIUrl() {
      let host = process.env.REACT_APP_API_HOST;
      let port = process.env.REACT_APP_API_PORT;

      const url = `${host}:${port}/g8w4y-32as9v`;
      return url;
   }

   POST(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return this.request(option, "POST");
   }

   GET(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return this.request(option, "GET");
   }

   PUT(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return this.request(option, "PUT");
   }

   DELETE(option = {
      url: "",
      headers: {},
      data: {},
   }) {
      return this.request(option, "DELETE");
   }
}
