import BaseService from "../BaseService";

class OperationRecordService extends BaseService {
  constructor() {
    super();
    this.module = "income/expense";
    this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
    this.initializeRoute();
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    dates, // {"column": "createdAtt", "value": [1, 100]}
    locationId,
    type // some api use this argument some not use, but no problem wether we use it or not
  ) {
    this.setHeader();
    return this.GET({
      url: `${
        this.baseUrl
      }/lists?limit=${limit}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&dates=${dates}&search=${searchKey}&languageId=${this.getLanguageId()}&locationId=${locationId}&type=${type}`,
      data: this.data,
      headers: this.header,
    });
  }

  summary() {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/summary`,
      headers: this.header
    });
  }
}

export default new OperationRecordService();
