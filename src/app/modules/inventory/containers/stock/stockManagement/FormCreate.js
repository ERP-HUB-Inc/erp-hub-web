import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import CreateStockManagement from "../../../components/stock/StockManagement/FormCreate";

class StockManagementForm extends React.Component {
  render() {
    return (
      <CreateStockManagement {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockManagementAdd: state.reducer.stockManagement.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockManagementForm =  Form.create(mapPropsToFields)(StockManagementForm);

export default connect(mapStateToProps)(stockManagementForm);