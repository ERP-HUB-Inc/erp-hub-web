import React from "react";
import { Spin, Button, Select, Form } from "antd";
import { Translate } from "react-localize-redux";
import InvoiceService from "../../../services/transactions/InvoiceService";
import StoreAccountService from "../../../services/settings/StoreAccountService";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import ProfessionalInvoice from "./template/ProfessionalInvoice";
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
  const professionalTemplates = ["professional", "professional-compact", "professional-navy", "professional-classic", "professional-minimal"];
  if (professionalTemplates.includes(template)) {
    invoice = <ProfessionalInvoice formData={formData} variant={template} />;
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
              <Select.OptGroup label="Standard">
                <Select.Option key={2} value={Enum.PAPER_SIZE.EXCLUDE_TAX.toString()}><Translate id="text_template" /> 1 · No tax</Select.Option>
                <Select.Option key={1} value={Enum.PAPER_SIZE.INCLUDE_TAX.toString()}><Translate id="text_template" /> 2 · Tax invoice</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="Non-official">
                <Select.Option key={3} value="non-official"><Translate id="text_template" /> 3 · Non-official</Select.Option>
                <Select.Option key={4} value="non-official-2"><Translate id="text_template" /> 4 · Multi-copy</Select.Option>
              </Select.OptGroup>
              <Select.OptGroup label="Professional">
                <Select.Option key={5} value="professional"><Translate id="text_template" /> 5 · Professional</Select.Option>
                <Select.Option key={6} value="professional-compact"><Translate id="text_template" /> 6 · Compact</Select.Option>
                <Select.Option key={7} value="professional-navy"><Translate id="text_template" /> 7 · Navy</Select.Option>
                <Select.Option key={8} value="professional-classic"><Translate id="text_template" /> 8 · Classic</Select.Option>
                <Select.Option key={9} value="professional-minimal"><Translate id="text_template" /> 9 · Minimal</Select.Option>
              </Select.OptGroup>
            </Select>
          </Form.Item>
          <Button type="primary" onClick={() => window.print()}>
            {"Download Invoice"}
          </Button>
        </div>
      </div>
      <div
        style={{ background: "#525659", padding: 25, overflow: "auto" }}
        id="wrap-invoice-form"
      >
        <div id="invoice-content" >
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
