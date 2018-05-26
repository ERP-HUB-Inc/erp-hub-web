import BaseService from "../../../../services/BaseService";

class ProductService extends BaseService {
	constructor() {
		super();
		this.baseUrl = this.baseUrl.concat(`/product/${this.version}`);
	}

	lists() {
		return "Product Lists" + this.baseUrl;
	}

	list() {
		return "Product Record" + this.baseUrl;
	}
}

export default new ProductService();
