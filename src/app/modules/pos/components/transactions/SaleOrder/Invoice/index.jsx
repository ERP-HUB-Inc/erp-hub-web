import React from "react";
import Util from "../../../../../common/util";
import Template from "./template";

export default function SaleOrderInvoice(props) {
  const util = new Util();

  const setting = util.getSetting();
  const {formData} = props;
  return <Template formData={formData} setting={setting} />;
}