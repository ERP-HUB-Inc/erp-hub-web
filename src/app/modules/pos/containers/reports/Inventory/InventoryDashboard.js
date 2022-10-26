import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import InventoryDashboard from "../../../components/reports/Inventory/InventoryDashboard";

function InventoryDashboardContainer(props) {
  return <InventoryDashboard {...props} />;
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
    checkPermission: state.reducer.privilege.checkPermission,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const inventoryDashboardContainer =  Form.create(mapPropsToFields)(InventoryDashboardContainer);

export default connect(mapStateToProps)(inventoryDashboardContainer);
