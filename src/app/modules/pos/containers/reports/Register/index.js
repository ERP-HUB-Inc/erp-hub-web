import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/reports/Register/index";

class ReportShiftContainer extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reportShift =  Form.create(mapPropsToFields)(ReportShiftContainer);

export default connect(mapStateToProps)(reportShift);
