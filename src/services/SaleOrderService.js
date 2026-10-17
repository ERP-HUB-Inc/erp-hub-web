import BaseService from "./BaseService";

class SaleOrderService extends BaseService {
  constructor() {
    super();
    this.module = "sales_order";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
    this.initializeRoute();
  }

  get(option = {}) {
    const legacyParams = this.bindQueryParam(option);
    const dateParams = new URLSearchParams();
    if (option.start) dateParams.set("start", option.start);
    if (option.end) dateParams.set("end", option.end);

    const query = [legacyParams, dateParams.toString()].filter(Boolean).join("&");
    return this.GET({
      url: `${this.baseUrl}${query ? `?${query}` : ""}`,
      data: this.data,
      headers: this.header
    });
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder,
    filter, // {"column1": [value1, value2], "column2": [value1, value2]}
    searchKey, // {"column": ["columnname1", "columnname2"], "value": "hello"}
    rangFilter,// {"column": "createdAtt", "value": [1, 100]}
    locationId,
    type // some api use this argument some not use, but no problem wether we use it or not
  ) {
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}?limit=${limit}&offset=${offset ? offset : 0}&sortField=${sortField}&sortOrder=${sortOrder}&filter=${filter}&rangFilter=${rangFilter}&search=${searchKey}&locationId=${locationId ? locationId : 0}&type=${type}`,  
      data: this.data,
      headers: this.header
    });
  }

  summary(filter) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/v1/summary?filter=${filter}`,
      headers: this.header
    });
  }

  dashboardSummary(start, end) {
    const isValidDate = (value) => {
      if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
      const [year, month, day] = value.split("-").map(Number);
      const parsed = new Date(Date.UTC(year, month - 1, day));
      return parsed.getUTCFullYear() === year
        && parsed.getUTCMonth() === month - 1
        && parsed.getUTCDate() === day;
    };

    if (!isValidDate(start) || !isValidDate(end) || start > end) {
      return Promise.reject(new Error("Dashboard summary requires a valid start and end date (YYYY-MM-DD)."));
    }

    this.setHeader();
    const params = new URLSearchParams();
    params.set("start", start);
    params.set("end", end);
    return this.GET({
      url: `${this.baseUrl}/v1/summary/dashboard?${params.toString()}`,
      headers: this.header
    });
  }

  checkAvailableNo(number) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/check_available/${number}`,
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

  getInvoiceBySaleOrderId(saleOrderId) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/invoices/${saleOrderId}`,
      headers: this.header
    });
  }

  detailPublic(id, token) {
    this.header["Authorization"] = `Bearer ${token}`;
    return this.GET({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }

  searchSaleOrder(invoiceNumber) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}/search/${invoiceNumber}`,
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

  update(data, id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/${id}`,
      data,
      headers: this.header
    });
  }

  markAsConfirm(id) {
    this.setHeader();
    return this.PUT({
      url: `${this.baseUrl}/mark_confirm/${id}`,
      headers: this.header
    });
  }

  void(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/void/${id}`,
      headers: this.header
    });
  }

  delete(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }
}

export default new SaleOrderService();
