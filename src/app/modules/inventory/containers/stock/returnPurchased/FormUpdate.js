import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormUpdate from "../../../components/stock/ReturnPurchase/FormUpdate";

class ReturnPurchaseForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    returnPurchaseUpdate: state.reducer.returnPurchase.update,
    initialValues: state.reducer.returnPurchase.update.data,
    locale: state.locale,
    returnPurchaseDetail: state.reducer.returnPurchase.detail,

    supplier: state.reducer.supplier.request,
    product: state.reducer.product.request,
    storeLocation: state.reducer.storeLocation.request
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnPurchaseForm = Form.create(mapPropsToFields)(ReturnPurchaseForm);

export default connect(mapStateToProps)(returnPurchaseForm);