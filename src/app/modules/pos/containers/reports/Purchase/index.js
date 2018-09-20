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
    locale: state.locale,
    purchaseReportAdd: state.reducer.purchaseReport.add,
    purchaseReportUpdate: state.reducer.purchaseReport.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const purchase =  Form.create(mapPropsToFields)(Purchase);

export default connect(mapStateToProps)(purchase);
