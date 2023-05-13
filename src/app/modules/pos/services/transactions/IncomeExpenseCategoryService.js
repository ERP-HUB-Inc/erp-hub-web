import BaseService from "../BaseService";

class IncomeExpenseCategoryService extends BaseService {
    constructor() {
        super();
        this.module = "income_expense/categories";
        this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
        this.initializeRoute();
    }

    getCategories(){
      this.setHeader();
      return this.GET({ 
        url: `${this.generateAPIUrl()}/${this.module}`,
        headers: this.header
      });
    }
}

export default new IncomeExpenseCategoryService();