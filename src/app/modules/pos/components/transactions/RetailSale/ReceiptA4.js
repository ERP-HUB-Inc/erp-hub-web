import React from "react";
import POSUtil from "../../../utils";
import Component from "../../../../common/components/Component";
export default class ReceiptA4 extends Component {
  
  renderLogo(){
    return(
      <div style={{position: "relative", margin: "0 auto"}}>
        <img style={{width: 100}} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url} />
      </div>
    )
  }

  companyInfo(){
    return(
      <div style={{padding: "8px", fontSize: "11px", marginBottom: "15px", borderBottom: "1px solid black", borderTop: "1px solid black", textAlign:"center", marginTop: "10px"}}>
          <div>{this.props.data.client.address}</div>
          <div>Tel:  <span style={{textDecoration: "underline"}}>{this.props.data.client.phoneNumber}</span>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;Email:<span style={{textDecoration: "underline"}}>{this.props.data.client.email} </span></div>
      </div>
    )
  }

  customerInfo(){
    return(
      <div style={{textAlign: "left", border: "1px solid black", backgroundColor: "#FCE4D6", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
          <div style={{fontWeight: "bold"}}>ព័ត៌មានអតិថិជន Customer Information:</div>
          {
            this.props.data.customer ?
          <div>
            <div style={{fontWeight: "bold"}}>{ this.props.data.customer.company }</div>
            { this.props.data.customer.address ? this.props.data.customer.address : "" } <br/> 
            Tel: {this.props.data.customer.phoneNumber} |  Email: {this.props.data.customer.email}<br />
          </div> : "" }
      </div>
    )
  }

  renderMoneyCell(value = 0,symbol) {
    return <div style={{display: "flex", justifyContent: "space-between"}}>
      <div>{symbol ? symbol : "$" }</div>
      <div>{this.formatCurrency(value, "", false)}</div>
    </div>;
  }

  calculateDiscount(productList,discount){
    let totalAllproduct = "";
    
    productList.map((product, index) =>
      totalAllproduct += product.price * product.quantity
    )

    if(discount > 0){
      return POSUtil.getDiscountByRate(totalAllproduct,discount);
    }else{
      return;
    }
  }

  itemlist(){
    return(
        this.props.productList.map((product, index) => 
          <tr style={{borderLeft: "1px solid black"}} key={index}>
            <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "12px", verticalAlign: "top",  padding: "4px"}}>{ index + 1 }</td>
            <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px", textAlign: "left", padding: "4px" }}>
              <div>
                <span style={{ fontWeight: "bold", fontSize: "15px", fontFamily: "Khmer OS Content"  }}>{product.name}</span>
                <div style={{fontSize: "7px", fontFamily: "Khmer OS Content" }}>
                  {
                    product.variantName ?
                    product.variantName
                      :
                      ""
                  }
                  </div>
                 <pre style={{ fontSize: "11px", fontFamily: "Khmer OS Content", overflow: "hidden", marginTop: 0, marginBottom: 0 }}>{product.productDescription}</pre>
              </div>
            </td>
            <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px", verticalAlign: "top", padding: "4px"}}>{product.quantity}</td>
            <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px", verticalAlign: "top", padding: "4px"}}>{this.renderMoneyCell(this.formatCurrency(product.price,"",false))}</td>
            <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px", verticalAlign: "top", padding: "4px"}}>{this.renderMoneyCell(product.price * product.quantity)}</td>
          </tr>
        )
    )
  }

  render() {
    return (
      <div id="pos-receipt-preview" style={{textAlign: "center", width: "705px", margin: "auto", fontFamily: "Khmer OS Content", display: "block", pageBreakBefore: "always"}}>
        <div style={{display: "flex", fontSize: "11px"}}>
          <div style={{flexGrow: 2, textAlign: "left"}}>
              {this.renderLogo()}
          </div>
           <div style={{flexGrow: 2, textAlign: "right", fontSize: "18pt", fontWeight: "bold", fontFamily: "Khmer OS Muol"}}>
            <span>{this.props.data.client.businessName}</span><br />
            {/* <span style={{fontSize: "15pt", fontFamily: "Berlin Sans FB Demi"}}>R.E. DESIGNS Co., Ltd,</span> */}
          </div>
        </div>
        {this.companyInfo()}
        <div style={{fontSize: "23px",textAlign:"center",fontWeight: "bold", fontFamily: "Khmer OS Muol", color: "red"}}>
          សម្រង់តម្លៃ / QUOTATION
        </div>
        <div style={{display: "flex", fontSize: "11px", marginTop: "2px", marginBottom: "8px"}}>
          <div style={{flexGrow: 2, textAlign: "left"}}>កាលបរិច្ឆេទ Date: <span style={{fontWeight: "bold"}}>{this.Util.formatDate(this.props.data.createdAt, "DD MMM YYYY")}</span></div>
          {/* <div style={{flexGrow: 2, textAlign: "left"}}>VAT IN: </div> */}
          <div style={{flexGrow: 2, textAlign: "right"}}>លេខ No: <span style={{fontWeight: "bold", color: "#CC0000", fontSize: "14px"}}>{this.props.data.number}</span></div>
        </div>

        {/* customer info */}
        {this.customerInfo()}
        
        <table style={{width: "100%", fontFamily: "Khmer OS Content", marginBottom: "23px", borderCollapse: "collapse"}}>
          <tbody><tr style={{backgroundColor: "red"}}>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>លរ <br /> No</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>បរិយាយ​<br />Description</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>បរិមាណ<br />Quantity</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt", width: "160px"}}>តំលៃ<br />Unit Price</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt", width: "160px"}}>សរុប<br />Total</th>
            </tr>
            {this.itemlist()}
            <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} rowSpan={4} style={{borderRight: "1px solid black", backgroundColor: "#E7E6E6", fontSize: "11px", padding: "8px", textAlign: "left"}}>
                Please pay to our company bank account as below: <br />
                <span style={{border: "1px solid black", width: "10px", height: "10px", display: "inline-block", position: "relative", top: "3px"}}>&nbsp;&nbsp;</span>&nbsp;&nbsp;Cheque to <b>{this.props.data.client.businessName}</b>&nbsp;or<br />
                <span style={{border: "1px solid black", width: "10px", height: "10px", display: "inline-block", position: "relative", top: "2px"}} />&nbsp;&nbsp;Bank account as below:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Account Name: {this.props.data.client.businessName}.<br />
              </td>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>សរុប Total </td>
              <td style={{borderRight: "1px solid black"}} >
                {this.renderMoneyCell(this.props.data.total)}
              </td>
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>អាករ VAT 0% </td>
              <td style={{borderRight: "1px solid black"}}>
              {this.renderMoneyCell()}
              </td>
            </tr>

            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>
                បញ្ចុះតំលៃ Discount ({this.props.data.terms ? this.props.data.terms : 0}  %)
              </td>
              <td style={{borderRight: "1px solid black"}}>
              {this.renderMoneyCell(this.calculateDiscount(this.props.productList,this.props.data.terms))}
              </td>
            </tr>

            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>សរុបរួម Grand Total </td>
              <td style={{borderRight: "1px solid black"}}>
                  {this.renderMoneyCell(this.props.data.total)}
              </td>
            </tr>
          </tbody></table> 
        <div style={{position: "relative", top: "25px"}}>
          <div style={{display: "flex", fontSize: "11px", marginTop: "8px", marginBottom: "8px"}}>
            <div style={{flexGrow: 2, textAlign: "left"}}>អ្នកចេញសម្រង់តម្លៃ​ / Quotation by ………………………………</div>
            <div style={{flexGrow: 2, textAlign: "right"}}>អតិថិជន ​/ Customer ………………………………</div>
          </div>
          <div style={{textAlign: "center", backgroundColor: "#F8CBAD", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
            <div style={{ fontFamily: "Khmer OS" }}><span style={{fontWeight: "bold"}}>ចំណាំ៖ </span>&nbsp;ច្បាប់ដើមសម្រាប់​អ្នកទិញ និង ​ច្បាប់​ចម្លង​សម្រាប់​អ្នក​លក់</div>
          </div>
          <div style={{textAlign: "center", fontSize: "11px", marginBottom: "15px"}}>
            <div style={{fontWeight: "bold"}}>សូមអំណរគុណ​សំរាប់​គាំទ្រដល់​សេវាកម្ម​យើង​ខ្ញុំ‌‌!    <i>Thank you for support our service!</i></div>
          </div>
        </div> 
      </div>
    );
  }
}

ReceiptA4.defaultProps = {
  receiptTemplate: {
    logo: ""
  },
};
