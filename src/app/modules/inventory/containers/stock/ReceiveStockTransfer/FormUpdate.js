import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/stock/ReceiveStockTransfer/FormUpdate";

class StockTransferForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    detail: state.reducer.stockTransfer.detail,
    approve: state.reducer.stockTransfer.approve,
    location: state.reducer.location.request,
    unit: state.reducer.productsUnit.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockTransferForm = Form.create(mapPropsToFields)(StockTransferForm);

export default connect(mapStateToProps)(stockTransferForm);