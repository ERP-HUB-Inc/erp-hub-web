import React from "react";
import { connect } from "react-redux";
import { Form } from "antd";
import FormUpdate from "../../../components/stock/stockManagement/FormUpdate";

class StockManagementForm extends React.Component {
  render() {
    return (
      <FormUpdate {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockManagementUpdate: state.reducer.stockManagement.update,
    initialValues: state.reducer.stockManagement.update.data,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockManagementForm = Form.create(mapPropsToFields)(StockManagementForm);

export default connect(mapStateToProps)(stockManagementForm);