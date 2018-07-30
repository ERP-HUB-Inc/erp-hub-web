import Service from "../../common/services/BaseService";

export default class BaseService extends Service {
  constructor() {
    super();
    this.data = {};
    console.log("Access Token:", this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN));
    this.header =  {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${this.Util.getAccessToken(this.ConstantAuth.ACCESS_TOKEN)}`
    };
  }

  lists(
    limit,
    offset,
    sortField,
    sortOrder
  ) {
    return this.fetchData({ 
      url: `${this.baseUrl}/lists?limit=${limit}&offset=${offset}&sortField=${sortField}&sortOrder=${sortOrder}`,
      data: this.data,
      headers: this.header
    });
  }

  archive(ids) {
    return this.deleteData({ 
      url: `${this.baseUrl}/archive/${ids}`,
      data: this.data,
      headers: this.header
    });
  }

  add(data) {
    return this.addData({
      url: `${this.baseUrl}/create`,
      data: {
        ...data,
        isSystem: 0,
        isDefault: 0
      },
      headers: this.header
    });
  }

  update(data) {
    const {id} = data;
    return this.updateData({
      url: `${this.baseUrl}/update/${id}`,
      data: {
        ...data,
        isSystem: 0,
        isDefault: 0
      },
      headers: this.header
    });
  }
  
}