import React from "react";
import FormAdd from "./FormAdd";
import columns from "./column";
import List from "../../List";
// import CreateForm from "../../../containers/settings/PaymentMethod/CreateForm";
import TaxAction from "../../../action/settings/tax";
// import PaymentMethodAction from "../../../action/settings/paymentMethod";
import { RESET_TAX } from "../../../constants/settings/tax";

export default class TaxList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "tax";
    this.addingProp = "taxAdd";
    this.RESET_CONSTANT = RESET_TAX;
  }
  
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(TaxAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);

    dispatch(TaxAction.fetch(...this.filter));
  }

  handleSubmit() {
    const { dispatch, formAdd } = this.props;
    dispatch(TaxAction.add(formAdd.values));
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(TaxAction.showForm());
    // dispatch(PaymentMethodAction.showForm());
    this.setState({
      modalConten: <FormAdd/>
    });
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(TaxAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(TaxAction.fetch(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}