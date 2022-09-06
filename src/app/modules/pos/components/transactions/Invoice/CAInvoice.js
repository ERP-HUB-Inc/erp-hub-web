import React from "react";
import { Result } from "antd";
import { Translate } from "react-localize-redux";
import { Button } from "../../../../common/elements/ant-ui";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import Util from "../../../../common/util";

export default function CAInvoice(props) {
  const util = new Util();

  const {formData} = props;
  const setting = util.getSetting();
  formData.client = setting;
  if (!formData.clientId) {
    formData.clientId = util.getClientId();
  }

  return Object.keys(formData).length ? 
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      {
        formData.template === Enum.PAPER_SIZE.INCLUDE_TAX ?
        <TaxInvoice 
          formData={formData} 
          setting={setting} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle}/>
        :
        <NoneTaxInvoice 
          formData={formData} 
          setting={setting} 
          invoiceTitle={props.invoiceTitle}
          numberTitle={props.numberTitle} 
          invoiceDateTitle={props.invoiceDateTitle}
          dueDateTitle={props.dueDateTitle} />
      }
    </div>
    : 
    <Result  
      status={404}
      title="404"
      subTitle="Invoice found"
      extra={<Button type="info"><Translate id="text_back" /></Button>}
    />;
}