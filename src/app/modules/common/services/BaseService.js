import axios from "axios";
import {Util} from "../util";

export default class BaseService {

  constructor() {
    this.baseUrl = this.generateAPIUrl();
    this.version = "v1";
    this.module = "";
    this.Util = new Util();
    this.header = {
      "Content-Type": "application/json"
    };
  }

  generateAPIUrl() {
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const rootPath = process.env.REACT_APP_API_ROOT;
    const url = `${host}:${port}/${rootPath}`;
    return url;
  }

  addData(option = {
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

  fetchData(option = {
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

  updateData(option = {
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

  deleteData(option = {
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
