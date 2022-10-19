import React from "react";
import { Tooltip,  } from "antd";
import { Link } from "react-router-dom";
import { Translate } from "react-localize-redux";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import { InputText } from "../../../../common/elements/ant-ui";
import InvoiceService from "../../../services/transactions/InvoiceService";

export default function InputInvoiceNo(props) {
  const [existInvoice, setExistInvoice] = React.useState(null);
  const [validateStatus, setValidateStatus] = React.useState(null);

  const onChangeInvoiceNo = (invoiceNo) => {
    if (invoiceNo && invoiceNo.length > 3) {
      setValidateStatus("validating");
      InvoiceService.checkAvialableInvoiceNo(invoiceNo)
      .then(response => {
        if (response.data && response.data.invoiceNumber !== props.data) {
          setExistInvoice(response.data);
          setValidateStatus("error");
        } else {
          setValidateStatus("success");
        }
      });
    } else {
      setValidateStatus(null);
    }
  };

  return <React.Fragment>
    <InputText
      name={props.name}
      data={props.data}
      hasFeedback={true}
      help={validateStatus === "error" ? <div style={{marginBottom: 5}}>
        <div>
          <Translate id="text_invoice_number_already_exist" />
        </div>
        <Tooltip title={stringTranslate("text_view_invoice", props.locale)}>
          <Link target="_blank" to={`/transactions/detail-invoice/${existInvoice.id}`}>{existInvoice.invoiceNumber}</Link>
        </Tooltip>
      </div> : ""}
      validateStatus={validateStatus}
      label={props.label}
      placeholder="Ex: I-00001"
      form={props.form}
      style={props.style}
      inputStyle={props.inputStyle}
      onChange={event => onChangeInvoiceNo(event.target.value)} />
  </React.Fragment>;
}