import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import ManageEmployeeList from "../../../components/products/ProductsTag";

class EmployeeManagement extends React.Component {
  render() {
    return (
      <ManageEmployeeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    productsTag: state.reducer.productsTag.request,
    productsTagAdd: state.reducer.productsTag.add,
    productsTagArchive: state.reducer.productsTag.archive,
    productsTagUpdate: state.reducer.productsTag.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const employeeManagement = Form.create(mapPropsToFields)(EmployeeManagement);

export default connect(mapStateToProps)(employeeManagement);