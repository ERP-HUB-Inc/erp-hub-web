import React from "react";
import ReceiptA4 from "../RetailSale/ReceiptA4";

export default class ReceiptA4Extend extends ReceiptA4 {
  renderLogo(){
    return(
      <div style={{position: "relative", margin: "0 auto"}}>
        <img alt="" src={this.Util.getProductImage(this.props.receiptTemplate.data.logo, "general").url} />
      </div>
    )
  }
  
}
