import BaseService from "../../common/services/BaseService";

class BookingService extends BaseService {
  constructor() {
    super();
    this.module = "bookings";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
  }

  list(limit, offset, search, locationId, filter, rangeFilter) {
    this.setHeader();
    return this.GET({
      url: `${this.baseUrl}?limit=${limit}&offset=${offset}&search=${search}&locationId=${locationId}&filter=${filter}&rangFilter=${rangeFilter}`,
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
      url: `${this.baseUrl}`,
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

  delete(id) {
    this.setHeader();
    return this.DELETE({
      url: `${this.baseUrl}/${id}`,
      headers: this.header
    });
  }
}

export default new BookingService();