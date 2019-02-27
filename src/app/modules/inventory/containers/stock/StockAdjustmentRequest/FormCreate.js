import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/stock/StockAdjustmentRequest/FormCreate";

class FormList extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    stockAdjustmentRequestAdd: state.reducer.stockAdjustmentRequest.add,
    productSearch: state.reducer.product.search,
    productVariant: state.reducer.productVariant.request,
    accessLocation: state.reducer.location.requestAccessLocation,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const formList =  Form.create(mapPropsToFields)(FormList);

export default connect(mapStateToProps)(formList);