import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Sale";

class Sale extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    saleReport: state.reducer.saleReport.request,
    locale: state.locale,
    saleReportAdd: state.reducer.saleReport.add,
    saleReportUpdate: state.reducer.saleReport.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeAccount =  Form.create(mapPropsToFields)(Sale);

export default connect(mapStateToProps)(storeAccount);
