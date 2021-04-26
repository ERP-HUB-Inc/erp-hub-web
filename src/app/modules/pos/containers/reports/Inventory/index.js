import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Inventory";

class Inventory extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    inventoryReport: state.reducer.inventoryReport.request,
    inventoryReportAdd: state.reducer.inventoryReport.add,
    inventoryReportUpdate: state.reducer.inventoryReport.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const inventoryReport =  Form.create(mapPropsToFields)(Inventory);

export default connect(mapStateToProps)(inventoryReport);
