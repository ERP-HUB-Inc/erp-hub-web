import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import StockAdjustmentApproveList from "../../../components/stock/StockAdjustmentApprove";

class List extends React.Component {
  render() {
    return (
      <StockAdjustmentApproveList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockAdjustmentApprove: state.reducer.stockAdjustmentApprove.request,
    stockAdjustmentApproveAdd: state.reducer.stockAdjustmentApprove.add,
    stockAdjustmentApproveDetail: state.reducer.stockAdjustmentApprove.detail,
    stockAdjustmentApproveArchive: state.reducer.stockAdjustmentApprove.archive,
    stockAdjustmentApproveUpdate: state.reducer.stockAdjustmentApprove.update,
    storeLocation: state.reducer.location.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const list = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(list);