import Service from "../../common/services/BaseService";

export default class BaseService extends Service {
  constructor() {
    super();
    this.data = {};
    this.header =  {
      "Content-Type": "application/json",
      "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzMTcyMTIzMX0.JPOJSNqCPXWeAFkBfkdSULvTPI6TIXW6LYmJRWUDyL4"
    };
  }
  
}