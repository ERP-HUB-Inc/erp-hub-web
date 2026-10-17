import React from "react";
import SalesOrderForm from "./form.create";

export default function UpdateSalesOrder(props) {
  return <SalesOrderForm {...props} isUpdate />;
}
