import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import BrandList from "../../components/supplier";

class Brand extends React.Component {
  render() {
    return (
      <BrandList {...this.props} />
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

const supplier = Form.create(mapPropsToFields)(Brand);

export default connect(mapStateToProps)(supplier);