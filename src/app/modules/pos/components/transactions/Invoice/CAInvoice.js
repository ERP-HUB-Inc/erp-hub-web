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
  if (!formData.clientId) {
    formData.clientId = util.getClientId();
  }

  return Object.keys(formData).length ? 
    <div id="invoice-content">
      {formData.template === Enum.PAPER_SIZE.INCLUDE_TAX ?
        <TaxInvoice 
          formData={formData} 
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
      subTitle="Invoice not found"
      extra={<Button type="info"><Translate id="text_back" /></Button>}
    />;
}