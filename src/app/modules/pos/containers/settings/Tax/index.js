import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/settings/Tax";

class Tax extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.tax.request,
    add: state.reducer.tax.add,
    update: state.reducer.tax.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const tax = Form.create(mapPropsToFields)(Tax);

export default connect(mapStateToProps)(tax);