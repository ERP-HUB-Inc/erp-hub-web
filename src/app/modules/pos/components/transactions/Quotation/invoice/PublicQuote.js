import React from "react";
import { Spin, Button } from "antd";
import Enum from "../../../../enums";
import QuotationService from "../../../../services/transactions/QuotationService";
import TaxInvoice from "../../Invoice/template/TaxInvoice";
import NoneTaxInvoice from "../../Invoice/template/NoneTaxInvoice";

export default function QuotePreview() {
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      token = params.get("token"),
      quotationId = params.get("quotationId");

    setLoading(true);
    QuotationService.detailPublic(quotationId, token)
    .then(response => {
      setFormData(response.data.data);
    })
    .finally(() => setLoading(false));
  }, []);

  const template = new URLSearchParams(window.location.search).get("template");
  formData.transactionEntries = formData.quotationEntries;
  formData.invoiceDate = formData.quotationDate;
  formData.dueDate = formData.validDate;
  formData.invoiceNumber = formData.number;
  formData.company = formData.customer && formData.customer.company;
  formData.firstName = formData.customer && formData.customer.firstName;
  formData.lastName = formData.customer && formData.customer.lastName;
  formData.phoneNumber = formData.customer && formData.customer.phoneNumber;
  formData.VATNo = formData.customer && formData.customer.VATNo;
  formData.address = formData.customer && formData.customer.address;
  return (
    !loading ? 
      <React.Fragment>
        <div id="header-print-preview" style={{display: "flex", justifyContent: "space-between", padding: 15}}>
          <h4 style={{margin: 0}}>{formData.invoiceNumber}</h4>
          <Button type="primary" onClick={() => window.print()}>{"Download Invoice"}</Button>
        </div>
        <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
          {Number(template) === Enum.PAPER_SIZE.INCLUDE_TAX ?
            <TaxInvoice 
              invoiceTitle="Quotation"
              invoiceTaxTitleKH="សម្រង់តម្លៃអាករ"
              invoiceNoTitle="Quote No"
              invoiceNoTitleKH="លេខសម្រង់តម្លៃ"
              formData={formData} />
            :
            <NoneTaxInvoice 
              invoiceTitle="Quotation"
              numberTitle="Quote Number"
              invoiceDateTitle="Quote Date"
              dueDateTitle="Valid till Date"
            formData={formData} />
          }
        </div>
      </React.Fragment>
    :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
        <Spin />
      </div>
  );
}