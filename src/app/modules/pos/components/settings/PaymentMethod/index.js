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
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      }
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.service = PaymentMethodService;
    this.action = PaymentMethodAction;
    this.columnFilterWithKey = ["name"];
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  handleShowFormEdit(rowData) {
    if (this.action) {
      if (this.callBackOnShowEditForm) {
        this.callBackOnShowEditForm(rowData);
      } else {
        this.props.dispatch(this.action.showForm(rowData));
        this.setState({
          modalConten: this.formUpdate
        });
      }
    }
  }

  renderPagination() {}

}
