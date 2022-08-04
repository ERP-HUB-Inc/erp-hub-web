import React from "react";
import { Result } from "antd";
import { Translate } from "react-localize-redux";
import { Button } from "../../../../common/elements/ant-ui";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";

export default function CAInvoice(props) {

  const notFoundInvoice = () => {
    return <Result  
      status={404}
      title="404"
      subTitle="Invoice found"
      extra={<Button type="info"><Translate id="text_back" /></Button>}
    />;
  };

  const {formData} = props;
  let invoice = <NoneTaxInvoice formData={formData} />;
  formData.totalExcludeTax = 10;
  if (formData.totalExcludeTax) {
    invoice = <TaxInvoice formData={formData} />;
  }

  return Object.keys(formData).length ? invoice : notFoundInvoice();
}