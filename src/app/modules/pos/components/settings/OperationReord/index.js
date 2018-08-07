import React from "react";
import columns from "./column";
import List from "../../List";
import FormCreate from "../../../containers/settings/OperationRecord/FormCreate";
import FormUpdate from "../../../containers/settings/OperationRecord/FormUpdate";
import TaxAction from "../../../action/settings/operationRecord";
import Constant from "../../../constants/settings/operationRecord";
import OperationRecordAction from "../../../action/settings/operationRecord";
import OperatinRecordService from "../../../services/settings/OperationRecordService";

export default class TaxList extends List {
  constructor(props) {
    super(props);
    this.columns = columns;
    this.fetchingProp = "operationRecord";
    this.addingProp = "operationRecordAdd";
    this.updatingProp = "operationRecordUpdate";
    this.service = OperatinRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
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