import React from "react";
import { Translate } from "react-localize-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";
import { InputText } from "../../../../common/elements/ant-ui";
import { stringTranslate } from "../../../../common/helper/stringTranslate";
import QuotationService from "../../../services/transactions/QuotationService";

export default function QuotationNo(props) {
  const [existQuoteNo, setExistQuoteNo] = React.useState(null);
  const [validateStatus, setValidateStatus] = React.useState(null);

  const onChangeQuoteNo = (quoteNo) => {
    if (quoteNo && quoteNo.length > 3) {
      setValidateStatus("validating");
      QuotationService.checkAvailableNo(quoteNo)
      .then(response => {
        if (response.data && response.data.number !== props.data) {
          setExistQuoteNo(response.data);
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
          <Translate id="text_quote_no_already_exist" />
        </div>
        <Tooltip title={stringTranslate("text_view_quotation", props.locale)}>
          <Link target="_blank" to={`/transactions/detail-invoice/${existQuoteNo.id}`}>{existQuoteNo.invoiceNumber}</Link>
        </Tooltip>
      </div> : ""}
      validateStatus={validateStatus}
      label={props.label}
      placeholder="Ex: Q-000000"
      form={props.form}
      style={props.style}
      inputStyle={props.inputStyle}
      onChange={event => onChangeQuoteNo(event.target.value)} />
  );
}