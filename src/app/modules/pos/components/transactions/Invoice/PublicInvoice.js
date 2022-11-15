import React from "react";
import { Spin, Button, Select, Form } from "antd";
import { Translate } from "react-localize-redux";
import InvoiceService from "../../../services/transactions/InvoiceService";
import StoreAccountService from "../../../services/settings/StoreAccountService";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import history from "../../../../common/router/history";
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
      StoreAccountService.detail(detail.clientId).then((response) =>
        setSetting(response.data && response.data.data)
      );
      setFormData(detail);
      document.getElementsByTagName("title")[0].innerHTML =
        detail.invoiceNumber;
    }
  };

  const onChangeTemplate = (value) => {
    const params = new URLSearchParams(document.location.search);
    params.set("template", value);
    history.push({
      pathname: "/public/invoice-preview",
      search: params.toString(),
    });
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
    invoice = (
      <TaxInvoice
        formData={formData}
        setting={setting}
        style={{ width: "100%" }}
      />
    );
  }
  return Object.keys(formData).length ? (
    <React.Fragment>
      <div
        id="header-print-preview"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: 15,
        }}
      >
        <h4 style={{ margin: 0 }}>{formData.invoiceNumber}</h4>
        <div style={{ display: "flex" }}>
          <Form.Item style={{ marginTop: -4, marginRight: 15 }}>
            <Select
              style={{ width: 175 }}
              defaultValue={template}
              onChange={(value) => onChangeTemplate(value)}
            >
              <Select.Option
                key={2}
                value={Enum.PAPER_SIZE.EXCLUDE_TAX.toString()}
              >
                <Translate id="text_template" /> 1
              </Select.Option>
              <Select.Option
                key={1}
                value={Enum.PAPER_SIZE.INCLUDE_TAX.toString()}
              >
                <Translate id="text_template" /> 2
              </Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" onClick={() => window.print()}>
            {"Download Invoice"}
          </Button>
        </div>
      </div>
      <div
        style={{ background: "#525659", padding: 25, overflow: "auto" }}
        id={formData.client && formData.client.invoiceSize === "A5" ? "wrap-invoice-form-A5" : "wrap-invoice-form"}
      >
        <div className={formData.client && formData.client.invoiceSize === "A5" ? "invoice-A5" : "invoice-A4"} >
          {invoice}
        </div>
      </div>
    </React.Fragment>
  ) : (
    <div style={{ width: 30, margin: "0 auto", paddingTop: 30 }}>
      <Spin />
    </div>
  );
}
