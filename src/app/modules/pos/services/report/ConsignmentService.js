import BaseService from "../BaseService";

class ConsignmentService extends BaseService {
    constructor() {
        super();
        this.module = "report/consignment";
        this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
        this.initializeRoute();
    }

    async getSummary(start = "", end = "", isExport = false) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/summaries?startDate=${start}&endDate=${end}&isExport=${isExport}`,
            headers: this.header
        });
    }

    async getReportByProduct(search = "", sellerId = "", start = "", end="", isExport = false) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/summary_by_products?search=${search}&sellerId=${sellerId}&startDate=${start}&endDate=${end}&isExport=${isExport}`,
            headers: this.header
        });
    }

}

export default new ConsignmentService();