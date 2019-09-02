import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import RetailSale from "../../../components/transactions/RetailSale";

class RetailSaleForm extends React.Component {
  render() {
    return <RetailSale {...this.props} />;
  }
}

export function mapStateToProps(state) {
  return {
    customers: state.reducer.customer.request,
    products: state.reducer.product.request,
    productsType: state.reducer.productsType.request,
    productVariant: state.reducer.productVariant.request,
    customerAdd: state.reducer.customer.add,
    posPay: state.reducer.transaction.posPay,
    productSearch: state.reducer.product.search,
    paymentMethod: state.reducer.paymentMethods.request,
    receiptTemplate: state.reducer.receiptTemplate.detail,
    openSaleRegistration: state.reducer.openSaleRegistration.request,
    open: state.reducer.openSaleRegistration.open,
    checkPermission: state.reducer.privilege.checkPermission,
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