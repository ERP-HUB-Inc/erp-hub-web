import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import SupplierList from "../../../components/stock/supplier";

class Supplier extends React.Component {
  render() {
    return (
      <SupplierList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    supplier: state.reducer.supplier.request,
    supplierAdd: state.reducer.supplier.add,
    supplierArchive: state.reducer.supplier.archive,
    supplierUpdate: state.reducer.supplier.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const supplier = Form.create(mapPropsToFields)(Supplier);

export default connect(mapStateToProps)(supplier);