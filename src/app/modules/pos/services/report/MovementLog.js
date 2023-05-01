import BaseService from "../BaseService";

class MovementLogService extends BaseService {
   constructor() {
      super();
      this.module = "report/stock";
      this.baseUrl = `${this.baseUrl}/${this.module}/${this.version}`;
      this.initializeRoute();
   }

   getMovementLogServiceReport(option) {
      this.setHeader();
      return this.GET({
         url: `${this.baseUrl}/movement_logs?${this.bindQueryParam(option)}`,
         headers: this.header,
      });
   }
}

export default new MovementLogService();
