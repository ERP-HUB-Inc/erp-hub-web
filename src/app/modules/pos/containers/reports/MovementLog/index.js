import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/MovementLog";

class MovementLog extends React.Component {
  render() {
    return <List {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.productReport.request,
    supplier: state.reducer.supplier.request,
    locations: state.reducer.location.request,
    brands: state.reducer.brand.request,
    productsType: state.reducer.productsType.request,
    checkPermission: state.reducer.privilege.checkPermission,
    purchaseOrder: state.reducer.purchaseOrder.add,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form,
  };
}

const movementLog = Form.create(mapPropsToFields)(MovementLog);

export default connect(mapStateToProps)(movementLog);
