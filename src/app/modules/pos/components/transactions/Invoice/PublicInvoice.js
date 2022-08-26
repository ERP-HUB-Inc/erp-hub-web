import React from "react";
import { Spin } from "antd";
import InvoiceService from "../../../services/transactions/InvoiceService";
import StoreAccountService from "../../../services/settings/StoreAccountService";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import "../../../../common/components/layout/styles/Style.css";
import "./template/style.css";
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
    invoice = <TaxInvoice formData={formData} setting={setting} />;
  }

  return Object.keys(formData).length ? 
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      {invoice}
    </div>
    :
    <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
      <Spin />
    </div>;
}