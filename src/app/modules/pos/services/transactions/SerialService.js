import BaseService from "../BaseService";

class SerialService extends BaseService {
    constructor() {
        super();
        this.module = "serials";
        this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
        this.initializeRoute();
    }

    findByNumber(number) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/find_by_number/${number}`,
            headers: this.header
        });
    }
}

export default new SerialService();