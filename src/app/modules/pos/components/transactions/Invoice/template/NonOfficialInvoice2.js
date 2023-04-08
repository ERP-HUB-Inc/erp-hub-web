import React from "react";
import Util from "../../../../../common/util";
import "./style.css";
import PaymentMethodService from "../../../../services/settings/PaymentMethodService";

const util = new Util();
const dateFormat = "DD/MM/YYYY";

export default function NonOfficialInvoice(props) {
  const [state, setState] = React.useState({bankTransfers: [], phoneTransfers: []});
  React.useEffect(() => {
    PaymentMethodService.getPaymentMethodsInvoice()
    .then(response => {
      if (response && response.data) {
        const paymentMethods = response.data.data;
        setState(() => ({
          bankTransfers: paymentMethods.filter(paymentMethod => paymentMethod.type === "BANK_TRANSFER"),
          phoneTransfers: paymentMethods.filter(paymentMethod => paymentMethod.type === "TRANSFER_AGENT")
        }));
      }
    })
    .catch(error => alert(error));
    // eslint-disable-next-line
  }, []);

  function renderSerials(entry) {
    let serialStr = null;
    let serialNo = entry.serialNo && entry.serialNo.toString().split(",");
    if (serialNo && serialNo.length) {
      let serialLen = serialNo.length;
      serialStr = <div style={{fontSize: 13, display: "flex", flexWrap: "wrap"}}>
        <label style={{color: "#033261", marginRight: 6, marginBottom: 0}}>IMEI or Serial Number:</label>
        {
          serialStr = serialNo.map((serial, index) =>
            <span key={index} style={{marginRight: 5}}>{serial}{index < serialLen - 1 ? "," : ""}</span>
          )
        }
      </div>;
    }
    return serialStr;
  }

  function getSubTotal(formData) {
    let subtotal = 0;
    if (formData.transactionEntries && formData.transactionEntries.length) {
      formData.transactionEntries.forEach(entry => {
        if (entry.status !== 3)
          subtotal += entry.quantity * entry.price;
      });
    }
    if (!subtotal) 
      subtotal = 0;
  
    return subtotal;
  }

  const {formData} = props;
  let discount = Number(formData.discount);
  let subtotal = getSubTotal(formData);

  if (!formData.totalExcludeTax) {
    formData.totalExcludeTax = subtotal;
  }

  let tax = formData.total - formData.totalExcludeTax;
  if (!tax || tax < 0)
    tax = 0;

  const deliveryFee = formData.deliveryFee ? formData.deliveryFee : 0;

  let client = {
    clientId: null,
    logo: null
  };

  if (formData.client) {
    client.clientId = formData.clientId;
    client.logo = formData.client.logo;
  } else {
    client.clientId = util.getClientId();
    client.logo = util.getClientLogo();
  }

  return (
    <table className="table-invoice">
      <tbody>
        <tr>
          <td style={{textAlign: "center", position: "relative", height: 100}}>
            <img src={util.getGeneralImage(`${client.clientId}/general/${client.logo}`).url} alt="Logo" style={{height: 100, position: "absolute", left: 0, top: 0}} />
            <h2 style={{fontWeight: "bold", color: "#000"}}>{formData.client && formData.client.businessName}</h2>
          </td>
        </tr>
        <tr>
          <td colSpan={3} style={{textAlign: "center", position: "relative"}}><h4 style={{fontFamily: "KhmerOS_Muol", color: "#000"}}>វិក្កយបត្រ INVOICE</h4><div style={{position: "absolute", right: 0, top: 20, color: "#000"}}>N&deg;: <span style={{fontSize: 20, fontWeight: "bold", color: "#bb1e56"}}>{formData.invoiceNumber}</span></div></td>
        </tr>
        <tr style={{background: "none"}}>
          <td colSpan={3} style={{paddingTop: 6, paddingBottom: 6}}>
            <div style={{display: "flex", justifyContent: "space-between"}}>
              <div style={{width: "49%", border: "1px solid #000", borderRadius: 5, padding: 10}}>
                <ul style={styles.ulStyle}>
                  <li style={{display: "flex", marginBottom: 10}} className="inv-header-title">
                    <CustomerRow title="អតិថិជន/Customer:" value={`${formData.firstName} ${formData.lastName}`} />
                  </li>
                  <li style={{display: "flex", marginBottom: 10}} className="inv-header-title">
                    <CustomerRow title="ទូរស័ព្ទ/Phone Number:" value={formData.phoneNumber} />
                  </li>
                  <li style={{display: "flex"}} className="inv-header-title">
                    <CustomerRow title="កាលបរិច្ឆេទ/Date:" value={formData.invoiceDate ? util.formatDate(formData.invoiceDate, dateFormat) : null} />
                  </li>
                </ul>
              </div>
              <div style={{width: "49%", border: "1px solid #000", borderRadius: 5, padding: 10, display: "flex", justifyContent: "space-between"}}>
                <ul style={{listStyle: "none", paddingLeft: 0, fontSize: 16, fontWeight: "bold", marginBottom: 0}}>
                  {
                    state.bankTransfers.map((bankTransfer, key) => 
                      <li key={key} style={{display: "flex", alignItems: "center", marginBottom: 10}}>
                        <div>
                          <img src={util.getGeneralImage(`${util.getClientId()}/payment_method/${bankTransfer.logo}`).url} style={{width: 40}} />
                        </div>
                        <div style={{marginLeft: 5}}>
                          <div>: {bankTransfer.bankAccNo}</div>
                          <div>: {bankTransfer.bankAccName}</div>
                        </div>
                      </li>
                    )
                  }
                </ul>
                {
                  state.phoneTransfers.length > 0 && 
                  <ul style={{listStyle: "none", paddingLeft: 0, fontSize: 16, fontWeight: "bold", marginBottom: 0}}>
                    <li style={{display: "flex", alignItems: "center", marginBottom: 10}}>
                      <span style={{borderBottom: "2px solid black"}}>លេខវេលុយ</span>
                    </li>
                    {
                      state.phoneTransfers.map((phoneTransfer, key) =>
                        <li key={key}>
                          {phoneTransfer.phoneNumber}
                        </li> 
                      )
                    }
                  </ul>
                }
              </div>
            </div>
          </td>
        </tr>
        <tr>
          <td colSpan={3} style={{padding: 0}}>
            <table className="table-invoice-entry">
              <thead>
                <tr>
                  <th style={{width: 50, textAlign: "center", border: "1px solid #000", fontFamily: "KhmerOS_content", color: "#000"}}>
                    <div style={{fontWeight: "bold"}}>ល​.រ</div>
                    <div>N&deg;</div>
                  </th>
                  <th style={{textAlign: "center", border: "1px solid #000", fontFamily: "KhmerOS_content", color: "#000"}}>
                    <div style={{fontWeight: "bold"}}>បរិយាយ</div>
                    <div>Description</div>
                  </th>
                  <th style={{width: 150, textAlign: "center", border: "1px solid #000", fontFamily: "KhmerOS_content", fontWeight: "bold", color: "#000"}}>
                    <div style={{fontWeight: "bold"}}>ចំនួន</div>
                    <div>Quantity</div>
                  </th>
                  <th style={{width: 150, textAlign: "center", border: "1px solid #000", fontFamily: "KhmerOS_content", fontWeight: "bold", color: "#000"}}>
                    <div style={{fontWeight: "bold"}}>តម្លៃរាយ</div>
                    <div>Unit Price</div>
                  </th>
                  <th style={{width: 150, textAlign: "center", border: "1px solid #000", fontFamily: "KhmerOS_content", fontWeight: "bold", color: "#000"}}>
                    <div style={{fontWeight: "bold"}}>តម្លៃសរុប</div>
                    <div>Amount</div>
                  </th>
                </tr>
              </thead>
              <tbody style={{background: "#fbfbfb", borderBottom: "1px solid #000", verticalAlign: "top"}}>
                {
                  formData.transactionEntries && formData.transactionEntries.filter(entry => entry.description).map((entry, index) => 
                    <tr key={index} style={{fontSize: "11pt", lineHeight: "26px", background: "none", display: `${entry.status === 3 ? "none" : ""}`}}>
                      <td style={{textAlign: "center", border: "1px solid #000"}}>{index + 1}</td>
                      <td style={{border: "1px solid #000"}}>
                        <pre className="entry-note-column">{entry.description}</pre>
                        {entry.enableDescription ? renderSerials(entry) : null}
                      </td>
                      <td style={styles.entriesCurrency}>{util.formatCurrency(entry.price)}</td>
                      <td style={styles.entriesCurrency}>{entry.quantity}</td>
                      <td style={styles.entriesCurrency}>{util.formatCurrency(util.floor(entry.price) * entry.quantity)}</td>
                    </tr>
                  )
                }
              </tbody>
              <tfoot>
                {discount > 0 && tax > 0 && deliveryFee > 0 && <InvoiceSummaryRow label="សរុបដំបូង/Subtotal" value={util.formatCurrency(subtotal)} />}
                {discount > 0 && <InvoiceSummaryRow label="បញ្ចុះតម្លៃ/Discount" value={util.formatCurrency(discount)} />}
                {tax > 0 && <InvoiceSummaryRow label="អាករលើតម្លៃបន្ថែម/VAT" value={util.formatCurrency(tax)} />}
                {deliveryFee > 0 && <InvoiceSummaryRow label="ថ្លៃដឹក/Delivery" value={util.formatCurrency(deliveryFee)} />}
                <InvoiceSummaryRow label="សរុប/Grand Total" value={util.formatCurrency(formData.total - discount + deliveryFee)} />
              </tfoot>
            </table>
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <div style={{display: "flex", justifyContent: "space-between", textAlign: "center", paddingTop: 60, fontFamily: "KhmerOS_content", color: "#000"}}>
              <div>
                <hr />
                <div>អ្នកទិញ / The Buyer</div>
              </div>
              <div>
                <hr />
                <div>អ្នកលក់ / The Seller</div>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
      <footer id="non-official-invoice" style={{borderTop: "2px solid #000"}}>
        <div dangerouslySetInnerHTML={{__html: formData.client && formData.client.address}}style={{paddingTop: 5, color: "#000"}} />
      </footer>
    </table>
  );
}

NonOfficialInvoice.defaultProps = {
  invoiceTitle: "Invoice",
  numberTitle: "Invoice Number",
  invoiceDateTitle: "Invoice Date",
  dueDateTitle: "Due Date",
  bankTransfers: [],
  phoneTransfers: []
};

function CustomerRow({title, value}) {
  return <React.Fragment>
    <div style={{fontSize: 16, fontFamily: "KhmerOS_content", fontWeight: "bold", color: "#000"}}>{title} {value}</div>
  </React.Fragment>;
}

function InvoiceSummaryRow({label, value}) {
  return <tr>
    <td></td>
    <td></td>
    <td colSpan={2} style={{textAlign: "right", fontFamily: "KhmerOS_content", fontWeight: "bold"}}>{label}</td>
    <td style={{textAlign: "right", border: "1px solid #000", fontWeight: "bold"}}>{value}</td>
  </tr>;
}

const styles = {
  ulStyle: {
    listStyleType: "none",
    padding: 0,
    fontSize: "11pt",
    marginBottom: 0,
    lineHeight: "25px"
  },
  entriesCurrency: {
    textAlign: "right",
    border: "1px solid #000"
  }
};