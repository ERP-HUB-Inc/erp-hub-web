import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import StockAdjustmentRequestList from "../../../components/stock/StockAdjustmentRequest";

class List extends React.Component {
  render() {
    return (
      <StockAdjustmentRequestList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockAdjustmentRequest: state.reducer.stockAdjustmentRequest.request,
    stockAdjustmentRequestAdd: state.reducer.stockAdjustmentRequest.add,
    stockAdjustmentRequestDetail: state.reducer.stockAdjustmentRequest.detail,
    stockAdjustmentRequestArchive: state.reducer.stockAdjustmentRequest.archive,
    stockAdjustmentRequestUpdate: state.reducer.stockAdjustmentRequest.update,
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