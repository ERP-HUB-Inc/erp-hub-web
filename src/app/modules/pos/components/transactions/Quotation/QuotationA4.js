import React from "react";
import ReceiptA4 from "../RetailSale/ReceiptA4";

export default class QuotationA4 extends ReceiptA4 {
  constructor(props) {
    super(props);
    this.title = "សម្រង់តម្លៃ / QUOTATION";
    this.issuedBy = "អ្នកចេញសម្រង់តម្លៃ​ / Quotation by";
    this.isQuotation = true;
  }
  renderLogo(){
    return <div style={{position: "relative", margin: "0 auto"}}>
        <img style={{ width: 100 }} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.data.logo, "general").url} />
      </div>;
  }
  
}
