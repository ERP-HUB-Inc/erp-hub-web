import React from "react";
import {
  Spin,
  Button
} from "antd";
import InvoiceService from "../../../services/transactions/InvoiceService";
import StoreAccountService from "../../../services/settings/StoreAccountService";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import "../../../../common/components/layout/styles/Style.css";
import "./template/style.css";
import "antd/dist/antd.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PublicInvoice() {
  const [formData, setFormData] = React.useState({});
  const [setting, setSetting] = React.useState({});

  const fetchDetail = async (id, token) => {
    const detail = (await InvoiceService.detailPublic(id, token)).data;
    if (Object.keys(detail).length) {
      StoreAccountService.detail(detail.clientId)
      .then(response => setSetting(response.data && response.data.data));
      setFormData(detail);
      document.getElementsByTagName("title")[0].innerHTML = detail.invoiceNumber;
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(document.location.search),
      id = params.get("invoiceId"),
      token = params.get("token");
      if (id) {
        fetchDetail(id, token);
      }
  }, []);

  let invoice = <NoneTaxInvoice formData={formData} setting={setting} />;
  const template = new URLSearchParams(window.location.search).get("template");
  if (Number(template) === Enum.PAPER_SIZE.INCLUDE_TAX) {
    invoice = <TaxInvoice formData={formData} setting={setting} style={{width: "100%"}} />;
  }

  return Object.keys(formData).length ? 
      <React.Fragment>
        <div id="header-print-preview" style={{display: "flex", justifyContent: "space-between", padding: 15}}>
          <h4 style={{margin: 0}}>{formData.invoiceNumber}</h4>
          <Button type="primary" onClick={() => window.print()}>{"Download Invoice"}</Button>
        </div>
        <div style={{background: "#525659", padding: 25, overflow: "auto"}} id="wrap-invoice-form">
          <div style={{background: "#ffff", width: "250mm", padding: 40, minHeight: "297mm", margin: "auto"}}>
            {invoice}
          </div>
        </div>
      </React.Fragment>
      :
      <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
        <Spin />
      </div>;
}