import React from "react";
import {
  Checkbox,
  Col,
  Icon,
  Modal,
  Row 
} from "antd";
import Util from "../../../../common/util";

const util = new Util();

export default function RewardModal(props) {
  
  function getTotalPayment(transPayment) {
    let total = 0;
    transPayment.length && transPayment.forEach(payment => {
      total += payment.tender;
    });
    return total;
  }

  function entriesDiscount(entries) {
    let discount = 0;
    entries.length && entries.forEach(entry => {
      if (entry.discount > 0) {
        discount += (entry.price - entry.newPrice) * entry.quantity;
      }
    });

    if (discount < 0) {
      discount = 0;
    }

    return discount;
  };

  function renderItemPrice(entry) {
    let html = util.formatCurrency(entry.quantity * entry.price, "");
    if (entry.discount) {
      html = <React.Fragment>
        <div style={{marginTop: 4, marginBottom: -4}}>{util.formatCurrency(entry.quantity * entry.newPrice, "")}</div>
        <del>{util.formatCurrency(entry.quantity * entry.price, "")}</del>
      </React.Fragment>;
    }

    return html;
  }

  const {data} = props;
  const {customer} = data;

  return (
    <Modal
      title="Receive Payment"
      visible={props.visible}
      width={1000}
      footer={null}
      onCancel={props.onClose}
      className="customer-reward-pos-modal"
    >
      <Row style={{paddingBottom: 25}}>
        <Col span={8}>
          <table style={{width: "100%", borderTop: "1px solid #ddd"}} id="table-customer-reward">
            <tbody>
              {
                data.transactionEntries && data.transactionEntries.map((entry, index) => 
                  <tr key={index} style={{height: 44, borderBottom: "1px solid #ddd"}}>
                    <td>{entry.name}</td>
                    <td>{entry.quantity}x</td>
                    <td style={{textAlign: "right"}}>
                      {renderItemPrice(entry)}
                    </td>
                  </tr>
                )
              }
              <tr style={{height: 60, borderBottom: "1px solid #ddd"}}><td colSpan={3}></td></tr>
              <tr style={{height: 42, borderBottom: "1px solid #ddd"}}>
                <td colSpan={2}>Sub-total</td>
                <td style={{fontWeight: 600, color: "#767373", textAlign: "right"}}>{util.formatCurrency(data.totalExcludeTax - entriesDiscount(data.transactionEntries), "")}</td>
              </tr>
              {data.discount && !entriesDiscount(data.transactionEntries) ?
                <tr style={{height: 42, borderBottom: "1px solid #ddd"}}>
                  <td colSpan={2}>Add Discount</td>
                  <td style={{textAlign: "right"}}>{util.formatCurrency(data.discount, "")}</td>
                </tr>
                : null
              }
              <tr style={{height: 42, borderBottom: "1px solid #ddd"}}>
                <td colSpan={2}>Total</td>
                <td style={{fontWeight: 600, color: "#767373", textAlign: "right"}}>
                  {util.formatCurrency(data.total - data.discount, "")} = {util.formatCurrency(util.toValidKHMoney((data.total - data.discount)* data.exchangeRate), "៛", 1, 0)}
                </td>
              </tr>
              <tr style={{fontWeight: "bold", fontSize: 18, height: 40, color: "#2b5279"}}>
                <td colSpan={2}>Pay</td>
                <td style={{textAlign: "right"}}>{util.formatCurrency(getTotalPayment(data.transactionPaymentEntries), "")}</td>
              </tr>
            </tbody>
          </table>
        </Col>
        <Col span={16} style={{textAlign: "center", paddingTop: 20}}>
          <Icon type="check-circle" theme="filled" style={{fontSize: 50, color: "green", borderRadius: "50%"}} />
          <h3>Payment Received</h3>
          <div><Checkbox checked={props.isAllowPrintReceipt} /><span style={{paddingLeft: 5}}>Print Receipt</span></div>
          <button 
            style={{background: "#0D62AF", color: "#FFF", fontSize: 22, fontWeight: "bold", width: 242, padding: 4, margin: 20, border: "none", borderRadius: 4}}
            onClick={props.onClose}
          >
            DONE
          </button>
          <table style={{width: 380, border: "1px solid #ddd", display: "inline-table"}} id="table-customer-reward-point">
            <thead>
              <tr><td colSpan={2} style={{padding: 10, borderBottom: "1px solid #ddd"}}>{data.firstName} {data.lastName}</td></tr>
            </thead>
            <tbody>
              <tr>
                <td style={{width: 190, borderRight: "1px solid #ddd", padding: 20}}>
                  Redeem Points 
                  <div>{customer ? customer.redeemedPoint : 0}</div>
                </td>
                <td>
                  Points
                  <div style={{display: "flex", justifyContent: "center"}}>
                    {customer ? util.floor(customer.previousPoint): 0}
                    <span style={{color: "green", fontSize: 13, marginTop: -1, marginLeft: 3}}> + {customer && util.floor(customer.additionalPoint)}</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </Col>
      </Row>
    </Modal>
  );
}