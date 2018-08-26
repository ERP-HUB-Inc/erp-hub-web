import React from "react";
import CreateStockManagement from "../../../components/stock/stockManagement/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

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