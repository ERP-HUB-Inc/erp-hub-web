import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/ProfitAndLost";

class ProfitAndLost extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    profitAndLostReport: state.reducer.profitAndLostReport.request,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const profitAndLost =  Form.create(mapPropsToFields)(ProfitAndLost);

export default connect(mapStateToProps)(profitAndLost);

