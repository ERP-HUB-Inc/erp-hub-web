import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormCreate from "../../../components/stock/ReturnPurchase/FormCreate";

class ReturnPurchaseForm extends React.Component {
  render() {
    return (
      <FormCreate {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    returnPurchaseAdd: state.reducer.returnPurchase.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const returnPurchaseForm =  Form.create(mapPropsToFields)(ReturnPurchaseForm);

export default connect(mapStateToProps)(returnPurchaseForm);