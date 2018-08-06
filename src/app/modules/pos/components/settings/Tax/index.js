import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/Tax/FormCreate";
import FormUpdate from "../../../containers/settings/Tax/FormUpdate";
import TaxAction from "../../../action/settings/tax";
import Constant from "../../../constants/settings/tax";

export default class TaxList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "tax";
    this.addingProp = "taxAdd";
    this.updatingProp = "taxUpdate";
    this.RESET_CONSTANT = Constant.RESET_TAX;
  }
  
  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(TaxAction.showForm());
    this.setState({
      modalConten: <FormCreate />
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(TaxAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }

  render() {
    return super.render();
  }
}