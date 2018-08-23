import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import StockManagementList from "../../components/stockManagement";

class StockManagement extends React.Component {
  render() {
    return (
      <StockManagementList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockManagement: state.reducer.stockManagement.request,
    stockManagementAdd: state.reducer.stockManagement.add,
    stockManagementArchive: state.reducer.stockManagement.archive,
    stockManagementUpdate: state.reducer.stockManagement.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockManagement = Form.create(mapPropsToFields)(StockManagement);

export default connect(mapStateToProps)(stockManagement);