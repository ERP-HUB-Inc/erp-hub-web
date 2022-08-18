import BaseService from "../BaseService";

class PromotionService extends BaseService {
    constructor() {
        super();
        this.module = "promotion";
        this.baseUrl = `${this.baseUrl}/${this.module}`;
        this.initializeRoute();
    }

    create(data) {
        this.setHeader();
        return this.POST({
            url: this.baseUrl,
            data,
            headers: this.header
        });
    }
}

export default new PromotionService();