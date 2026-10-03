import React from "react";
import { Translate } from "react-localize-redux";
import QRCode from "qrcode";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import NonOfficialInvoice1 from "./template/NonOfficialInvoice1";
import NonOfficialInvoice2 from "./template/NonOfficialInvoice2";
import TaxInvoice from "./template/TaxInvoice";
import { Button } from "../../../../common/elements/ant-ui";
import Enum from "../../../enums/index";

const CAInvoice = React.forwardRef((props, ref) => {
  const KHQRTimestamp = Date.now();
  React.useEffect(() => {
    if (props.formData.client && props.formData.client.KHQR1) {
      const paymentkhqrElment = document.getElementById(`payment-khqr${KHQRTimestamp}`);
      if (paymentkhqrElment) {
        QRCode.toDataURL(props.formData.client.KHQR1, {type: "image/webp", width: 150})
      .then(url => {
        paymentkhqrElment.src = url;
      })
      .catch(err => {
        console.error(err);
      });
      }
    }

    // eslint-disable-next-line
  }, [props.formData]);

  let style = {};
  if (props.paperSize === "A5") {
    style = {width: "212mm"};
  }

  const {formData} = props;

  let template = isNaN(parseInt(formData.template)) ? formData.template : parseInt(formData.template);


  switch (template) {
    case Enum.PAPER_SIZE.INCLUDE_TAX:
      return <InvoiceWrapper paperSize={props.paperSize} passedRef={ref} style={style}>
        <TaxInvoice 
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle}
        />
      </InvoiceWrapper>;
    case Enum.PAPER_SIZE.EXCLUDE_TAX:
      return <InvoiceWrapper paperSize={props.paperSize} passedRef={ref} style={style}>
        <NoneTaxInvoice
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          numberTitle={props.numberTitle}
          invoiceDateTitle={props.invoiceDateTitle}
          dueDateTitle={props.dueDateTitle}
          KHQRTimestamp={KHQRTimestamp}
        />
      </InvoiceWrapper>;
    case "non-official":
      return <InvoiceWrapper paperSize={props.paperSize} passedRef={ref} style={style}>
        <NonOfficialInvoice1
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle}
        />
      </InvoiceWrapper>;
    case "non-official-2":
      return <NonOfficialInvoice2
        formData={formData}
        paperSize={props.paperSize}
        passedRef={ref}
        invoiceTitle={props.invoiceTitle}
        invoiceTaxTitleKH={props.invoiceTaxTitleKH}
        invoiceNoTitle={props.invoiceNoTitle}
        invoiceNoTitleKH={props.invoiceNoTitleKH}
        numberTitle={props.numberTitle}
        invoiceDateTile={props.invoiceDateTile}
        dueDateTitle={props.dueDateTitle}
      />;
    default:
      return <InvoiceWrapper paperSize={props.paperSize} passedRef={ref} style={style}>
        <NonOfficialInvoice1
          formData={formData} 
          invoiceTitle={props.invoiceTitle}
          invoiceTaxTitleKH={props.invoiceTaxTitleKH}
          invoiceNoTitle={props.invoiceNoTitle}
          invoiceNoTitleKH={props.invoiceNoTitleKH}
          numberTitle={props.numberTitle}
          invoiceDateTile={props.invoiceDateTile}
          dueDateTitle={props.dueDateTitle}
        />
      </InvoiceWrapper>;
    //   return <Result  
    //     status={404}
    //     title="404"
    //     subTitle={"Invoice not found"}
    //     extra={props.notFoundContent}
    // />;
  }
});

export default CAInvoice;

CAInvoice.defaultProps = {
  notFoundContent: <Button type="info"><Translate id="text_back" /></Button>
};

function InvoiceWrapper({paperSize, passedRef, style, children}) {
  return <div id="invoice-content" className={paperSize} ref={passedRef} style={style}>
    {children}
  </div>;
}