import React from "react";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { InputText } from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import SaleOrderService from "../../../services/transactions/SaleOrderService";

export default function SaleOrderNo(props) {
  const [existSaleOrder, setExistSaleOrder] = React.useState(null);
  const [validateStatus, setValidateStatus] = React.useState(null);

  const onChangeSaleOrderNo = (saleOrderNo) => {
    if (saleOrderNo && saleOrderNo.length > 3) {
      setValidateStatus("validating");
      SaleOrderService.checkAvailableNo(saleOrderNo)
      .then(response => {
        if (response.data && response.data.invoiceNumber !== props.data) {
          setExistSaleOrder(response.data);
          setValidateStatus("error");
        } else {
          setValidateStatus("success");
        }
      });
    } else {
      setValidateStatus(null);
    }
  };

  return (
    <InputText
      name={`${props.name}`}
      data={props.data}
      hasFeedback={true}
      help={validateStatus === "error" ? <div style={{marginBottom: 5}}>
        <div>
          <Translate id="text_sale_order_number_already_exist" />
        </div>
        <Tooltip title={stringTranslate("text_view_sale_order", props.locale)}>
          <Link target="_blank" to={`/transactions/detail-invoice/${existSaleOrder.id}`}>{existSaleOrder.invoiceNumber}</Link>
        </Tooltip>
      </div> : ""}
      validateStatus={validateStatus}
      label={props.label}
      placeholder="Ex: SO-00001"
      form={props.form}
      style={props.style}
      inputStyle={props.inputStyle}
      onChange={event => onChangeSaleOrderNo(event.target.value)} />
  );
}