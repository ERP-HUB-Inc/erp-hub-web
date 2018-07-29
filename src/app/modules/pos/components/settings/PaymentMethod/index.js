import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/PaymentMethod/FormCreate";
import FormUpdate from "../../../containers/settings/PaymentMethod/FormUpdate";
import Constant from "../../../constants/settings/paymentMethod";
import PaymentMethodAction from "../../../action/settings/paymentMethod";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "paymentMethod";
    this.addingProp = "paymentMethodAdd";
    this.updatingProp = "paymentMethodUpdate";
    this.RESET_CONSTANT = Constant.RESET_PAYMENT_METHOD;
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

  onChangePagination(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      (current - 1) * pageSize,
    ];

    dispatch(PaymentMethodAction.fetch(...this.filter));

    this.setState({ current});
  }

  onShowSizeChange(current, pageSize) {
    const { dispatch } = this.props;

    this.filter = [
      pageSize,
      current,
    ];

    dispatch(PaymentMethodAction.fetch(...this.filter));
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

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(PaymentMethodAction.archive(this.state.selectedListIds));

    dispatch(PaymentMethodAction.fetch(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});

    super.handleDelete();

    this.Message.info(this.messageSuccess);
  }

  render() {
    return super.render();
  }
}
