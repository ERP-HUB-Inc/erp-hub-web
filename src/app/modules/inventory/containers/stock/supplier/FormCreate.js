import React from "react";
import CreateSupplier from "../../../components/stock/Supplier/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class SupplierForm extends React.Component {
  render() {
    return (
      <CreateSupplier {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    supplierAdd: state.reducer.supplier.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplierForm =  Form.create(mapPropsToFields)(SupplierForm);

export default connect(mapStateToProps)(supplierForm);