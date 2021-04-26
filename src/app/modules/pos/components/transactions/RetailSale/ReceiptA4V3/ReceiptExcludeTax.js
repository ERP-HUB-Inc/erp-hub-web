import ReceiptIncludeTax from "./ReceiptIncludeTax";
export default class ReceiptExcludeTax extends ReceiptIncludeTax {
  constructor(props){
    super(props);
    this.borderTopCustomerInfo = "";
  }

  companyInformation(){ return; }

  vatNumber(){ return; }

  tax(){ return;  }
  
}

