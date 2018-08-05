import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/PaymentMethod/FormCreate";
import FormUpdate from "../../../containers/settings/PaymentMethod/FormUpdate";
import Constant from "../../../constants/settings/paymentMethod";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import PaymentMethodService from "../../../services/settings/PaymentMethodService";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "paymentMethod";
    this.addingProp = "paymentMethodAdd";
    this.updatingProp = "paymentMethodUpdate";
    this.service = PaymentMethodService;
    this.action = PaymentMethodAction;
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(PaymentMethodAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(PaymentMethodAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}
