import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/stock/StockTransfer/FormUpdate";

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
    update: state.reducer.stockTransfer.update,
    productVariant: state.reducer.productVariant.request,
    productSearch: state.reducer.product.search,
    location: state.reducer.location.request,
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