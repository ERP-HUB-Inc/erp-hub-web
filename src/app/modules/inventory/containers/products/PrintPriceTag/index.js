import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import PrintPriceTag from "../../../components/products/PrintPriceTag";

class PrintPriceTagForm extends React.Component {
  render() {
    return (
      <PrintPriceTag {...this.props}/>
    );
  }
}

function mapStateToProps(state) {
  return {
    selectProductToPrint: state.reducer.priceTag.selectProductToPrint,
    productSearch: state.reducer.product.search,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const printPriceTagForm = Form.create(mapPropsToFields)(PrintPriceTagForm);

export default connect(mapStateToProps)(printPriceTagForm);