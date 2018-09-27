import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Purchase";

class Purchase extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    purchaseReport: state.reducer.purchaseReport.request,
    purchaseReportAdd: state.reducer.purchaseReport.add,
    purchaseReportUpdate: state.reducer.purchaseReport.update,
    supplier: state.reducer.supplier.request,
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const purchase =  Form.create(mapPropsToFields)(Purchase);

export default connect(mapStateToProps)(purchase);
