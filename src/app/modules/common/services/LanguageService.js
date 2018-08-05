import BaseService from "./BaseService";

class LanguageService extends BaseService {
  constructor() {
    super();
    this.module = "language";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
  }

  findSystemRecord(option = {column: "", value: ""}) {
    return this.GET(
      {
        url: `${this.baseUrl}/find/all`,
        data: {},
        header: this.header
      }
    );
  }
}
  
export default new LanguageService();