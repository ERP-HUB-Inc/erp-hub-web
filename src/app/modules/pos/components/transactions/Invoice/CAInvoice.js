import React from "react";
import { Result } from "antd";
import { Translate } from "react-localize-redux";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import NonOfficialInvoice from "./template/NonOfficialInvoice";
import TaxInvoice from "./template/TaxInvoice";
import { Button } from "../../../../common/elements/ant-ui";
import Enum from "../../../enums/index";

const CAInvoice = React.forwardRef((props, ref) => {

  let style = {};
  if (props.paperSize === "A5") {
    style = {width: "212mm"};
  }

  const {formData} = props;

  return formData && Object.keys(formData).length ? 
    <div id="invoice-content" className={props.paperSize} ref={ref} style={style}>

      {/* eslint-disable-next-line */}
      {formData.template == Enum.PAPER_SIZE.INCLUDE_TAX &&
        <TaxInvoice 
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle} />
      }

      {/* eslint-disable-next-line */}
      {formData.template == Enum.PAPER_SIZE.EXCLUDE_TAX &&
        <NoneTaxInvoice
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          numberTitle={props.numberTitle}
          invoiceDateTitle={props.invoiceDateTitle}
          dueDateTitle={props.dueDateTitle}
        />
      }

      {formData.template === "non-official" &&
        <NonOfficialInvoice
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle}
        />
      }
    </div>
    : 
    <Result  
        status={404}
        title="404"
        subTitle="Invoice not found"
        extra={props.notFoundContent}
    />;
});

export default CAInvoice;

CAInvoice.defaultProps = {
  notFoundContent: <Button type="info"><Translate id="text_back" /></Button>
};