import BaseService from "../BaseService";

class StoreLanguageService extends BaseService {

  constructor() {
    super();
    this.module = "language";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }
}

export default new StoreLanguageService();