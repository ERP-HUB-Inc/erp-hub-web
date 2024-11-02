import BaseService from "./BaseService";

class MovementLogService extends BaseService {

  constructor() {
    super();
    this.module = "stock/movementlogs";
    this.baseUrl = `${this.baseUrl}/${this.module}`;
    this.initializeRoute();
  }

  getMovementLogs(id){
    this.setHeader();
    return this.GET({ 
      url: `${this.baseUrl}/${id}`,
      data: this.data,
      headers: this.header
    });
  }
}

export default new MovementLogService();