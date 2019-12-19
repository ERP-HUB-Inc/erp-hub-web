import ReceiptA4V3HaveTax from "./ReceiptA4V3HaveTax";
export default class ReceiptA4V3NoTax extends ReceiptA4V3HaveTax {
  constructor(props){
    super(props);
    this.borderTopCustomerInfo = "";
  }

  companyInformation(){ return; }

  vatNumber(){ return; }

  tax(){ return;  }
  
}

