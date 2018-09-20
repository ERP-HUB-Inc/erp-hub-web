import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import RetailSale from "../../../components/transactions/RetailSale";

class RetailSaleForm extends React.Component {
  render() {
    return <RetailSale {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    customers: state.reducer.managementCustomers.request,
    customerAdd: state.reducer.managementCustomers.add,
    productSearch: state.reducer.product.search,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const retailSale = Form.create(mapPropsToFields)(RetailSaleForm);

export default connect(mapStateToProps)(retailSale);