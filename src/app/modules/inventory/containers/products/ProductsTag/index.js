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
    list: state.reducer.productsTag.request,
    add: state.reducer.productsTag.add,
    update: state.reducer.productsTag.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const employeeManagement = Form.create(mapPropsToFields)(EmployeeManagement);

export default connect(mapStateToProps)(employeeManagement);