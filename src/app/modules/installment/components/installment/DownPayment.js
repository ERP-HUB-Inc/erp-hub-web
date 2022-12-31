import React from "react";
import moment from "moment";
import {Translate} from "react-localize-redux";
import Util from "../../../common/util";
import Enum from "../../enum";
import "../style.css";

const util = new Util();

function displayDateWithMonthKH(date) {
  if (date && moment(date).isValid()) {
    const months = {1: "មករា", 2: "កុម្ភៈ", 3: "មិនា", 4: "មេសា", 5: "ឧសភា", 6: "មិថុនា", 7: "កក្កដា", 8: "សីហា", 9: "កញ្ញា", 10: "តុលា", 11: "វិច្ឆិកា", 12: "ធ្នូ"};
    const day = moment(date).format("D");
    const month = months[Number(moment(date).format("M"))];
    const year = moment(date).format("YYYY");
    return `${day} ${month} ${year}`;
  }

  return null;
}

export default function DownPaymentTable(props) {

  function finalPaymentDate(paymentSchedule) {
    const len = paymentSchedule && paymentSchedule.length;
    if (len) {
      const lastSchedule = paymentSchedule[len - 1];
      return displayDateWithMonthKH(lastSchedule.date);
    }

    return null;
  }

  function getTotal(products) {
    let total = 0;
    if (products.length) {
      products.forEach(product => {
        total += util.floor(product.quantity * product.price);
      });
    }
    return total;
  }

  function getTotalPaidAmount(schedules) {
    let total = 0;
    schedules.length && schedules.forEach(schedule => {
      total += schedule.payAmount;
    });
    return total;
  }

  function renderScheduleStatus(schedule) {
    let ele = "";
    if (schedule.status === Enum.REPAYMENT_STATUS.PENDING) {
      if (moment(schedule.date).format("YYYY-MM-DD") < moment().format("YYYY-MM-DD")) {
        ele = <span style={{color: "#f5222d"}}><Translate id="text_overdue" /></span>;
      }
    } else if (schedule.status === Enum.REPAYMENT_STATUS.PAID) {
      ele = <span style={{color: "#52c41a"}}><Translate id="text_paid" /></span>;
    }
    return ele;
  }

  const {formData} = props;
  return (
    Object.keys(formData).length &&
    <div id="invoice-content">
      <table className="table-invoice">
        <tbody>
          <tr>
            <td colSpan={5} style={{textAlign: "center", fontSize: 16, fontWeight: "bold", paddingBottom: 12}}>តារាងបង់ប្រាក់ឈ្នួល ប្រចាំខែ</td>
          </tr>
          <tr className="table-row-border">
            <td colSpan={2} style={{textAlign: "right"}}>ឈ្មេាះអតិថិជន</td>
            <td>{formData.customer && formData.customer.firstName + " " + formData.customer.lastName}</td>
            <td style={{textAlign: "right"}}>លេខកូដអតិថិជន</td>
            <td>{formData.customer && formData.customer.number}</td>
          </tr>
          <tr className="table-row-border">
            <td colSpan={2} style={{textAlign: "right"}}>រយៈពេលបង់ប្រាក់</td>
            <td>{formData.duration ? <div>{formData.duration} <Translate id={`text_${formData.durationType.toLowerCase()}`} /></div> : null}</td>
            <td style={{textAlign: "right"}}>លេខទូរស័ព្ទ</td>
            <td>{formData.customer && formData.customer.phoneNumber}</td>
          </tr>
          <tr className="table-row-border">
            <td colSpan={2} style={{textAlign: "right"}}>ថ្ងៃទទួលទ្រព្យ</td>
            <td>{displayDateWithMonthKH(formData.receiveDate)}</td>
            <td style={{textAlign: "right"}}>បង់ដាច់ថ្ងៃទី</td>
            <td>{finalPaymentDate(formData.paymentSchedule)}</td>
          </tr>
          <tr>
            <th colSpan={5} style={{fontSize: 14, textAlign: "center", padding: "16px 0 9px 0"}}>បញ្ជីរាយមុខទំនិញ</th>
          </tr>
          <tr className="table-row-border">
            <th style={{width: 50}}>ល.រ</th>
            <th colSpan={2}>ឈ្មេាះផលិតផល</th>
            <th>បរិមាណ</th>
            <th style={{textAlign: "right"}}>តម្លៃ</th>
          </tr>
          {
            formData.installmentEntries && formData.installmentEntries.length ? formData.installmentEntries.map((product, index) => 
              <tr className="table-row-border" key={index} style={{verticalAlign: "baseline"}}>
                <td style={{textAlign: "center"}}>{index + 1}</td>
                <td colSpan={2}>{product.productName} {product.serialNo ? <div>Serial: {product.serialNo}</div> : null}</td>
                <td style={{textAlign: "center"}}>{product.quantity}</td>
                <td style={{textAlign: "right", paddingRight: 10}}>{util.formatCurrency(product.price)}</td>
              </tr>
            )
            : null
          }
          <tr>
            <td colSpan={4}></td>
            <td style={{border: "1px solid", color: "#000", paddingRight: 10}}>
              <div style={{display: "flex", justifyContent: "flex-end", textAlign: "right"}}>
                <div>សរុបដំបូង :</div>
                <div style={{width: 110}}>{util.formatCurrency(getTotal(formData.installmentEntries))}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={4}></td>
            <td style={{border: "1px solid", color: "#000", paddingRight: 10}}>
              <div style={{display: "flex", justifyContent: "flex-end", textAlign: "right"}}>
                <div>ប្រាក់បង់មុន :</div>
                <div style={{width: 110}}>{util.formatCurrency(formData.firstPayment)}</div>
              </div>
            </td>
          </tr>
          <tr>
            <td colSpan={4}></td>
            <td style={{border: "1px solid", color: "#000", paddingRight: 10}}>
              <div style={{display: "flex", justifyContent: "flex-end", textAlign: "right"}}>
                <div>ប្រាក់ត្រូវបង់ :</div>
                <div style={{width: 110}}>{util.formatCurrency(getTotalPaidAmount(formData.paymentSchedule))}</div>
              </div>
            </td>
          </tr>
          <tr>
            <th colSpan={5} style={{textAlign: "center", fontSize: 14, padding: "16px 0 9px 0"}}>កាលវិភាគបង់ប្រាក់</th>
          </tr>
          <tr className="table-row-border">
            <th style={{width: 50}}>ល.រ</th>
            <th style={{width: 200}}>ថ្ងៃខែឆ្នាំ</th>
            <th style={{width: 160}}>ចំនួនបង់ប្រចាំខែ</th>
            <th style={{width: 190}}>ចំនួនប្រាក់នៅសល់</th>
            <th>ផ្សេងៗ</th>
          </tr>
          {
            formData.paymentSchedule && formData.paymentSchedule.length ? formData.paymentSchedule.map((schedule, index) =>
              <tr key={index} className="table-row-border">
                <td style={{textAlign: "center"}}>{index + 1}</td>
                <td>{displayDateWithMonthKH(schedule.date)}</td>
                <td style={{textAlign: "center"}}>{util.formatCurrency(Number(schedule.payAmount), "")}</td>
                <td style={{textAlign: "center"}}>{util.formatCurrency(Number(schedule.balance), "")}</td>
                <td>
                  {renderScheduleStatus(schedule)}
                </td>
              </tr>
            )
            : null
          }
          <tr>
            <td colSpan={5} style={{padding: 0}}>
              <div 
                style={{minHeight: 150}}
                dangerouslySetInnerHTML={{ __html: formData.description}} 
                id="public-not"
              />
            </td>
          </tr>
          <tr style={{verticalAlign: "top"}}>
            <td colSpan={3} style={{paddingTop: 30, paddingLeft: 51}}>
              <div style={{marginBottom: 75}}>ស្នាមមេដៃអ្នកជួល</div>
              <hr style={{marginBottom: 5, width: 150, marginLeft: 0, background: "#000"}} />
              <div>ឈ្មេាះ {formData.customer && formData.customer.firstName + " " + formData.customer.lastName}</div>
              <div>{displayDateWithMonthKH(formData.receiveDate)}</div>
            </td>
            <td style={{paddingTop: 30}}>
              <div style={{marginBottom: 75}}>ស្នាមមេដៃអ្នកធានា</div>
              <hr style={{marginBottom: 5, width: 150, marginLeft: 0, background: "#000"}} />
              <div>ឈ្មេាះ </div>
              <div>{displayDateWithMonthKH(formData.receiveDate)}</div>
            </td>
            <td style={{paddingTop: 30}}>
              <div style={{marginBottom: 75}}>ស្នាមមេដៃម្ចាស់ទ្រព្យ</div>
              <hr style={{marginBottom: 5, width: 150, marginLeft: 0, background: "#000"}} />
              <div>ឈ្មេាះ {formData.client && formData.client.businessNamekm}</div>
              <div>{displayDateWithMonthKH(formData.receiveDate)}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}