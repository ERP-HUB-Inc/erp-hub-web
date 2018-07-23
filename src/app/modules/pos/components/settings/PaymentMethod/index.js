import React from "react";
import columns from "./column";
import FormAdd from "./FormAdd";
import CreateForm from "../../../containers/settings/PaymentMethod/CreateForm";
import List from "../../List";
import { RESET_PAYMENT_METHOD } from "../../../constants/settings/paymentMethod";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "paymentMethod";
    this.addingProp = "paymentMethodAdd";
    this.RESET_CONSTANT = RESET_PAYMENT_METHOD;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(PaymentMethodAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;
    super.onChange(pagination, filters, sorter);
    dispatch(PaymentMethodAction.fetch(...this.filter));
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(PaymentMethodAction.showForm());
    this.setState({
      modalConten: <CreateForm/>
    });
  } 

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(PaymentMethodAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(PaymentMethodAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}
