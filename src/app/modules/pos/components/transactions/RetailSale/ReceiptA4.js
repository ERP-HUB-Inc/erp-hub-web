import React from "react";
// import JsBarcode from "jsbarcode";
import Component from "../../../../common/components/Component";
// import Enum from "../../../../pos/enums";
// import "./Receipt.css";
import { PaperSize } from "../../settings/ReceiptTemplate/PaperSize";
// import Util from "../../../../pos/utils";
export default class ReceiptA4 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logoContent: ""
    };
  }

  render() {

    // let businessName = "";
    // let address = "";
    // let phoneNumber = "";
    // let cashier = "";
    // if (this.props.currentUser) {
    //   if (this.props.currentUser.setting) {
    //     businessName = this.props.currentUser.setting.businessName;
    //     address = this.props.currentUser.setting.address;
    //     phoneNumber = this.props.currentUser.setting.phoneNumber;
    //   }

    //   if (this.props.currentUser.currentUser) {
    //     cashier = this.props.currentUser.currentUser.fullName;
    //   }
    // }

    // const {
    //   taxTitle,
    //   countTax
    // } = this.props.summaryTax;

    let paperSize = PaperSize.find(paperValue => paperValue.code === this.props.receiptTemplate.paperSize);
    if (!paperSize) {
      paperSize = PaperSize[0];
    }

    // const paddingTopForHeaderAndFooter = paperSize.code === Enum.PAPER_SIZE.MINI_THERMAL ? -10 : 2.5;
    
    return (
      <div id="pos-receipt-preview" style={{textAlign: "center", width: "705px", margin: "auto", fontFamily: "Khmer OS Content", display: "block", pageBreakBefore: "always"}}>
        <div style={{display: "flex", fontSize: "11px"}}>
          <div style={{flexGrow: 2, textAlign: "left"}}>
            {/* <img src={"logo.jpg"} style={{height: "99px", width: "367px"}} /> */}
              {
                    this.props.isRequestShowDetail ?
                      <div style={{height: "99px", width: "367px"}}>
                        <img style={{height: "99px", width: "367px"}} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url} />
                      </div>
                      :
                      <div style={{position: "relative", margin: "0 auto"}}>
                        {this.state.logoContent ? this.state.logoContent : <img style={{width: 100}} alt="" src={this.Util.getProductImage(this.props.receiptTemplate.logo, "general").url} />}
                      </div>
                  }
          </div>
          <div style={{flexGrow: 2, textAlign: "right", fontSize: "18pt", fontWeight: "bold", fontFamily: "Khmer OS Muol"}}>
            <span>ក្រុម​ហ៊ុន អ អ៊ី ឌីហ្សាញ់ ឯ.ក </span><br />
            <span style={{fontSize: "15pt", fontFamily: "Berlin Sans FB Demi"}}>R.E. DESIGNS Co., Ltd,</span>
          </div>
        </div>
        <div style={{padding: "8px", fontSize: "11px", marginBottom: "15px", borderBottom: "1px solid black", borderTop: "1px solid black", textAlign:"center"}}>
          <div>ផ្ទះលេខ ២០៥, ក្រុម​៣៨, ភូមិ ២០ឧសភា សង្កាត់​ស្វាយ​ប៉ោ ក្រុង​បាត់ដំបង ខេត្ត​បាត់ដំបង</div>
          <div>House No. 205, Group 38, 20 Usaphea, Sangkat SvayPor, Battambang, Battambang, Cambodia.</div>
          <div>Tel:  <span style={{textDecoration: "underline"}}>+855 12934323</span>&nbsp;-&nbsp;<span style={{textDecoration: "underline"}}>+855 12 269 098</span>&nbsp;&nbsp;|&nbsp;&nbsp;Email:<span style={{textDecoration: "underline"}}>savoeung.chann@resilient-consulting.net </span></div>
        </div>
        <div style={{fontSize: "19pt",textAlign:"center",fontWeight: "bold", fontFamily: "Khmer OS Muol", color: "red"}}>
          វិក័យប័ត្រ / INVOICE
        </div>
        <div style={{display: "flex", fontSize: "11px"}}>
          <div style={{flexGrow: 2, textAlign: "left"}}>កាលបរិច្ឆេទ Date: <span style={{fontWeight: "bold"}}>14/Aug/2019</span></div>
          <div style={{flexGrow: 2, textAlign: "left"}}>VAT TIN: B102-901801013</div>
          <div style={{flexGrow: 2, textAlign: "right"}}>លេខ No: <span style={{fontWeight: "bold", color: "#CC0000", fontSize: "14px"}}>INV-00012</span></div>
        </div>
        <div style={{textAlign: "left", border: "1px solid black", backgroundColor: "#FCE4D6", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
          <div style={{fontWeight: "bold"}}>ព័ត៌មានអតិថិជន Customer Information:</div>
          <div>
            <div style={{fontWeight: "bold"}}>UNDP Cambodia</div>
            Office Address #53, Pasteur Street, Boeung Keng Kang I P.O. Box 877, Phnom Penh, Cambodia. <br />
            Tel: 023 216 167 / 214 371 |  Email: kunka.ouk@undp.org; Website: www.kh.undp.org <br />
          </div>
        </div>
        <table style={{width: "100%", fontFamily: "Khmer OS Content", marginBottom: "23px", borderCollapse: "collapse"}}>
          <tbody><tr style={{backgroundColor: "red"}}>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>លរ <br /> No</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>បរិយាយ​<br />Description</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>បរិមាណ<br />Quantity</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>តំលៃ<br />Unit Price</th>
              <th style={{color: "white", borderRight: "1px solid black", fontSize: "11pt"}}>សរុប<br />Total</th>
            </tr>
            {/* <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>1</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}}>Translated khmer version</td>
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}}>1</td>
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}}>1,500.00</td>
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}}>1,500.00</td>
            </tr> */}
            {
                        this.props.productList.map((product, index) => 
                          <tr key={index}>
                            <td style={{textAlign: "center", backgroundColor: "white"}}>{product.quantity}</td>
                            <td style={{backgroundColor: "white"}}>
                              <div>{product.name}</div>
                              {
                                product.variantName ?
                                  <div style={{fontSize: paperSize.setting.subDataFontSize}}>{product.variantName}</div>
                                  :
                                  ""
                              }
                            </td>
                            <td style={{textAlign: "right", backgroundColor: "white"}}>{this.formatCurrency(product.price)}</td>
                            <td style={{textAlign: "right", backgroundColor: "white"}}>{this.formatCurrency(product.price * product.quantity)}</td>
                          </tr> 
                        )
                      }
            {/* <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr>
            <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr>
            <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr> */}
            <tr style={{borderLeft: "1px solid black"}}>
              <td style={{borderRight: "1px solid black", width: "50px", textAlign: "center", fontSize: "11px"}}>&nbsp;</td>
              <td style={{borderRight: "1px solid black", width: "420px", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "center", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "150px", textAlign: "right", fontSize: "11px"}} />
              <td style={{borderRight: "1px solid black", width: "100px", textAlign: "right", fontSize: "11px"}} />
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} rowSpan={4} style={{borderRight: "1px solid black", backgroundColor: "#E7E6E6", fontSize: "11px", padding: "2px"}}>
                Please pay to our company bank account as below: <br />
                <span style={{border: "1px solid black", width: "10px", height: "10px", display: "inline-block", position: "relative", top: "3px"}}>&nbsp;&nbsp;</span>&nbsp;&nbsp;Cheque to <b>R E Design Co., Ltd.</b>&nbsp;or<br />
                <span style={{border: "1px solid black", width: "10px", height: "10px", display: "inline-block", position: "relative", top: "2px"}} />&nbsp;&nbsp;Bank account as below:<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Account Name: R E Design Co.,Ltd.<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Account Number: 00008/02/000166/05 (USD)<br />
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- Bank Name: May Bank (Cambodia) Plc.
              </td>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>សរុប Total </td>
              <td style={{borderRight: "1px solid black"}} />
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>ពន្ធកាត់ទុក Withodling Tax (15%) </td>
              <td style={{borderRight: "1px solid black"}} />
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>អាករ VAT 10% </td>
              <td style={{borderRight: "1px solid black"}} />
            </tr>
            <tr style={{border: "1px solid black", backgroundColor: "#E7E6E6"}}>
              <td colSpan={2} style={{borderRight: "1px solid black", fontWeight: "bold", fontFamily: "Khmer OS Muol", fontSize: "9pt", textAlign: "left"}}>សរុបរួម Grand Total </td>
              <td style={{borderRight: "1px solid black"}} />
            </tr>
          </tbody></table> 
        <div style={{position: "relative", top: "25px"}}>
          <div style={{display: "flex", fontSize: "11px"}}>
            <div style={{flexGrow: 2, textAlign: "left"}}>អ្នកចេញវិក្ក័យបត្រ័​ /Issued by ………………………………</div>
            <div style={{flexGrow: 2, textAlign: "right"}}>អតិថិជន/Customer ………………………………</div>
          </div>
          <div style={{textAlign: "center", backgroundColor: "#F8CBAD", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
            <div style={{fontWeight: "bold"}}>ចំណាំ៖ ច្បាប់ដើមសម្រាប់​អ្នកទិញ និង ​ច្បាប់​ចម្លង​សម្រាប់​អ្នក​លក់</div>
          </div>
          <div style={{textAlign: "center", padding: "8px", fontSize: "11px", marginBottom: "15px"}}>
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
  isRequestClearMarginLeft: false
  //We use it to help when to want clear marginLeft (-30px) in case mini printer 58mm. The problem is because of margin
};
