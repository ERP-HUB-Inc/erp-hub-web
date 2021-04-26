import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import SupplierList from "../../../components/stock/Supplier";

class Supplier extends React.Component {
  render() {
    return (
      <SupplierList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.supplier.request,
    add: state.reducer.supplier.add,
    update: state.reducer.supplier.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplier = Form.create(mapPropsToFields)(Supplier);

export default connect(mapStateToProps)(supplier);