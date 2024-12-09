import BaseService from "../BaseService";

class PromotionService extends BaseService {
    constructor() {
        super();
        this.module = "promotion";
        this.baseUrl = `${this.baseUrl}/${this.module}`;
        this.initializeRoute();
    }

    lists(
        limit,
        offset,
        sortField,
        sortOrder,
        filter, // {"column1": [value1, value2], "column2": [value1, value2]}
        searchKey, // {"column": ["columnName1", "columnName2"], "value": "hello"}
        rangFilter,// {"column": "createdAtt", "value": [1, 100]}
        locationId
    ) {
        this.setHeader();
        return this.GET({ 
          url: `${this.baseUrl}?limit=${limit}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&locationId=${locationId}`,  
          headers: this.header
        });
    }

    detail(id) {
        this.setHeader();
        return this.GET({
            url: `${this.baseUrl}/${id}`,
            headers: this.header
        });
    }

    create(data) {
        this.setHeader();
        return this.POST({
            url: this.baseUrl,
            data,
            headers: this.header
        });
    }

    update(id, data) {
        this.setHeader();
        return this.PUT({
            url: `${this.baseUrl}/${id}`,
            data,
            headers: this.header
        });
    }

    archive(ids) {
        this.setHeader();
        return this.DELETE({  
          url: `${this.baseUrl}/${ids}`,
          data: this.data,
          headers: this.header
        });
    }
}

export default new PromotionService();