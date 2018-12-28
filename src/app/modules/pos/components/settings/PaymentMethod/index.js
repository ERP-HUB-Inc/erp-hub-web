import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/PaymentMethod/FormCreate";
import FormUpdate from "../../../containers/settings/PaymentMethod/FormUpdate";
import Constant from "../../../constants/settings/paymentMethod";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import PaymentMethodService from "../../../services/settings/PaymentMethodService";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = PaymentMethodService;
    this.action = PaymentMethodAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        sorter: true,
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description",
        sorter: true
      },
      this.columnStatus
    ];
  }
}
