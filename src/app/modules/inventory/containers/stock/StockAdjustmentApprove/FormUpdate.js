import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/StockAdjustmentApprove/FormUpdate";

class Forms extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockAdjustmentApproveUpdate: state.reducer.stockAdjustmentApprove.update,
    stockAdjustmentApproveDetail: state.reducer.stockAdjustmentApprove.detail, 
    productVariant: state.reducer.productVariant.request,
    productSearch: state.reducer.product.search,
    accessLocation: state.reducer.location.requestAccessLocation,
    storeLocation: state.reducer.location.request,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const form = Form.create(mapPropsToFields)(Forms);

export default connect(mapStateToProps)(form);