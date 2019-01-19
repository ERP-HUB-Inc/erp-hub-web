import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/stock/StockTransfer/FormCreate";

class StockTransferForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    stockTransferAdd: state.reducer.stockTransfer.add,
    productVariant: state.reducer.productVariant.request,
    productSearch: state.reducer.product.search,
    location: state.reducer.location.request,
    accessLocation: state.reducer.location.requestAccessLocation,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockTransferForm =  Form.create(mapPropsToFields)(StockTransferForm);

export default connect(mapStateToProps)(stockTransferForm);