import React from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin, Result } from "antd";
import history from "../../../../common/router/history";
import InvoiceService from "../../../services/transactions/InvoiceService";
import ReceiptTemplate from "./template/template1";

export default function PublicReceipt()  {
  const [formData, setFormData] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      invoiceId = params.get("invoiceId"),
      token = params.get("token");

    setLoading(true);
    InvoiceService.detailPublic(invoiceId, token)
    .then(response => {
      console.log("response", response.data);
      setFormData(response.data);
    })
    .finally(() => setLoading(false));
  }, []);

  formData.receiptTemplate = 2;

  return !loading ?
    <React.Fragment>
      <div id="header-print-preview" style={{display: "flex", justifyContent: "space-between", padding: 15}}>
        <h4 style={{margin: 0}}>{formData.receiptNumber}</h4>
        <Button type="primary" onClick={() => window.print()}>{"Download Invoice"}</Button>
      </div>
      {
        Object.keys(formData).length ?
          <div id="public-receipt-preview">
            <ReceiptTemplate formData={formData} />
          </div>
        :
        <Result  
          status={404}
          title="404"
          subTitle="Invoice found"
          extra={<Button type="info" onClick={() => history.goBack()}><Translate id="text_back" /></Button>}
        />
      }
      
    </React.Fragment>
    :
    <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
      <Spin />
    </div>;
}