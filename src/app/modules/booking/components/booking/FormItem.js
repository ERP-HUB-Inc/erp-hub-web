import React from "react";
import moment from "moment";
import {Translate} from "react-localize-redux";
import {
  Row,
  Col,
} from "antd";
import {
  InputText,
  InputTextArea,
  DatePickers,
  TimePickers
} from "../../../common/elements/ant-ui";
import { stringTranslate } from "../../../common/helper/stringTranslate";

export default function FormItem(props) {
  const {formData, form} = props;
  return (
    <React.Fragment>
      <Row>
        <Col span={24}>
          <InputText
            name="customerName"
            label={<Translate id="text_customer_name" />}
            placeholder={`${stringTranslate("text_customer_name", props.locale)}`}
            data={formData.firstName ? `${formData.firstName} ${formData.lastName}` : ""}
            form={form} />

          <InputText
            name="phoneNumber"
            label={<Translate id="text_phone_number" />}
            placeholder={`${stringTranslate("text_phone_number", props.locale)}`}
            data={formData.phoneNumber}
            form={form} />

          <DatePickers
            name="date"
            label={<Translate id="text_book_for_date" />}
            placeholder="DD/MM/YYYY"
            defaultValue={formData.start ? moment(formData.start) : null}
            dateFormat="DD/MM/YYYY"
            form={form} />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <TimePickers 
            name="start"
            label={<Translate id="text_from_time" />}
            placeholder="hh:mm"
            use12Hours={true}
            inputStyle={{width: "100%"}}
            form={form} />
        </Col>
        <Col span={12}>
          <TimePickers
            name="end"
            label={<Translate id="text_to_time" />}
            placeholder="hh:mm"
            use12Hours={true}
            inputStyle={{width: "100%"}}
            form={form} />
        </Col>

        <Col span={24}>
          <InputTextArea
            name="note"
            label={<Translate id="text_note" />}
            data={formData.note}
            placeholder={`${stringTranslate("text_note", props.locale)}`}
            form={form} />
        </Col>
      </Row>
    </React.Fragment>
  );
}

FormItem.defaultProps = {
  formData: {},
  customers: []
};