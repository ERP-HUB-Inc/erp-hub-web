import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Product";

class Product extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productReport.request,
    supplier: state.reducer.supplier.request,
    locations: state.reducer.location.request,
    brands: state.reducer.brand.request,
    productsType: state.reducer.productsType.request,
    checkPermission: state.reducer.privilege.checkPermission,
    purchaseOrder: state.reducer.purchaseOrder.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const product =  Form.create(mapPropsToFields)(Product);

export default connect(mapStateToProps)(product);
