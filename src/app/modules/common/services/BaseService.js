import axios from "axios";
import ConstantAuth from "../constants/authentication";
import {Util} from "../util";

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

  setHeader() {
    this.header["Authorization"] = `Bearer ${this.Util.getAccessToken()}`;
  }

  generateAPIUrl() {
    let host = process.env.REACT_APP_API_HOST;
    if (process.env.REACT_APP_ENV === "DEV") {
      host = process.env.REACT_APP_API_DEV_HOST;
    }
    const port = process.env.REACT_APP_API_PORT;
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
