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
    productReport: state.reducer.product.request,
    productReportAdd: state.reducer.product.add,
    productReportUpdate: state.reducer.product.update,
    supplier: state.reducer.supplier.request,
    locations: state.reducer.storeLocation.request,
    brands: state.reducer.brand.request,
    productsType: state.reducer.productsType.request,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const product =  Form.create(mapPropsToFields)(Product);

export default connect(mapStateToProps)(product);
