import BaseService from "../BaseService";

class SerialService extends BaseService {
    constructor() {
        super();
        this.module = "serials";
        this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
        this.initializeRoute();
    }

    lists(limit, offset, search, rangeFilter) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&search=${search}&rangFilter=${rangeFilter}`,
            headers: this.header
        });
    }

    listsByInstallment(limit, offset, search, rangeFilter) {
        return this.GET({
            url: `${this.baseUrl}/lists/installment?limit=${limit}&offset=${offset}&search=${search}&rangFilter=${rangeFilter}`,
            headers: this.header
        });
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