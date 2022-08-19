import React from "react";
import { Result } from "antd";
import { Translate } from "react-localize-redux";
import { Button } from "../../../../common/elements/ant-ui";
import NoneTaxInvoice from "./template/NoneTaxInvoice";
import TaxInvoice from "./template/TaxInvoice";
import Enum from "../../../enums/index";
import Util from "../../../../common/util";

export default function CAInvoice(props) {
  const util = new Util();

  const notFoundInvoice = () => {
    return <Result  
      status={404}
      title="404"
      subTitle="Invoice found"
      extra={<Button type="info"><Translate id="text_back" /></Button>}
    />;
  };

  const {formData} = props;
  const setting = util.getSetting();
  let invoice = <NoneTaxInvoice formData={formData} setting={setting} />;
  if (formData.template === Enum.PAPER_SIZE.INCLUDE_TAX) {
    invoice = <TaxInvoice formData={formData} setting={setting} />;
  }

  return Object.keys(formData).length ? 
    <div style={{width: "250mm", margin: "auto", background: "#FFFFFF", padding: 40, minHeight: "297mm"}}>
      {invoice}
    </div>
    : notFoundInvoice();
}