import React from "react";
import { Result } from "antd";
import { Translate } from "react-localize-redux";
import { Button } from "../../../../common/elements/ant-ui";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import NoneTaxInvoiceA5 from "./template/NoneTaxInvoiceA5";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import Util from "../../../../common/util";

export default function CAInvoice(props) {
  const util = new Util();

  const {formData} = props;
  if (!formData.clientId) {
    formData.clientId = util.getClientId();
  }

  let content = <div className="invoice-A4">
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
  </div>;
  
  if (formData.client && formData.client.invoiceSize === "A5") {
    content = <div className="invoice-A5">
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
        <NoneTaxInvoiceA5
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          numberTitle={props.numberTitle} 
          invoiceDateTitle={props.invoiceDateTitle}
          dueDateTitle={props.dueDateTitle} />
      }
    </div>;
  }

  return Object.keys(formData).length ? 
    content
    : 
    <Result  
      status={404}
      title="404"
      subTitle="Invoice not found"
      extra={<Button type="info"><Translate id="text_back" /></Button>}
    />;
}