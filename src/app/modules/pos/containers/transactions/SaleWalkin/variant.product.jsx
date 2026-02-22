import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import VaraintProduct from "../../../components/transactions/RetailSale/VaraintProduct";
  
class VaraintProductForm extends React.Component {
  render() {
    return (
      <VaraintProduct {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    productAttributes: state.reducer.product.requestAttributes,
  };
}
  
function mapPropsToFields(props) {
  return {
    form: props.form
  };
}
  
const varaintProductForm =  Form.create(mapPropsToFields)(VaraintProductForm);
  
export default connect(mapStateToProps)(varaintProductForm);