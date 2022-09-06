import React from "react";
import { message, Spin, Button } from "antd";
import SaleOrderService from "../../../../services/transactions/SaleOrderService";
import StoreAccountService from "../../../../services/settings/StoreAccountService";
import Template from "./template";

export default function SaleOrderPublicInvoice() {
  const [formData, setFormData] = React.useState({});
  const [setting, setSetting] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  const fetchDetail = async (id, token) => {
    setLoading(true);
    const detail = (await SaleOrderService.detailPublic(id, token)).data;
    if (Object.keys(detail).length) {
      StoreAccountService.detail(detail.clientId)
      .then(response => setSetting(response.data && response.data.data));
      setFormData(detail);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search),
      id = params.get("saleOrderId"),
      token = params.get("token");

    if (!id) {
      return message.error("Please provide sale order id");
    } 

    if (!token) {
      return message.error("Please provide access token");
    }

    fetchDetail(id, token);
  }, []);

  return !loading && Object.keys(formData).length ?
    <React.Fragment>
      <div id="header-print-preview" style={{display: "flex", justifyContent: "space-between", padding: 15}}>
        <h4 style={{margin: 0}}>{formData.receiptNumber}</h4>
        <Button type="primary" onClick={() => window.print()}>{"Download Invoice"}</Button>
      </div>
      <Template formData={formData} setting={setting} />
    </React.Fragment>
    : 
    <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
      <Spin />
    </div>;
}