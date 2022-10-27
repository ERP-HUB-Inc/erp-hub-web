import BaseService from "../BaseService";

class SerialService extends BaseService {
    constructor() {
        super();
        this.module = "serials";
        this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
        this.initializeRoute();
    }

    findByNumber(number, variantId, transEntryId) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/find_by_number/${number}?productVariantId=${variantId}&transactionEntryId=${transEntryId}`,
            headers: this.header
        });
    }
}

export default new SerialService();