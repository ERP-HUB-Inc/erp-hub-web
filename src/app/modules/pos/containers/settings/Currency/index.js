import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/settings/Currency";

class Currency extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.currency.request,
    add: state.reducer.currency.add,
    update: state.reducer.currency.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currency = Form.create(mapPropsToFields)(Currency);

export default connect(mapStateToProps)(currency);