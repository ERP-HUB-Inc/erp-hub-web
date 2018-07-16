import axios from "axios";

export default class BaseService {

  constructor() {
    this.baseUrl = this.generateAPIUrl();
    this.version = "v1";
    this.module = "";
  }

  generateAPIUrl() {
    const host = process.env.REACT_APP_API_HOST;
    const port = process.env.REACT_APP_API_PORT;
    const rootPath = process.env.REACT_APP_API_ROOT;
    const url = `${host}:${port}/${rootPath}`;
    return url;
  }

  fetchData(option = {
    method: "GET",
    url: "",
    headers: {},
    data: {},
  }) {
    const response = axios({
		  method: option.method,
		  url: option.url,
		  headers: option.headers,
		  data: option.data
    });
    return response;
  }
}
