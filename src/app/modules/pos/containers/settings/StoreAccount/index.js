import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../../components/settings/StoreAccount";

class StoreAccount extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    storeAccount: state.reducer.storeAccount.request.list,
    storeAccountUpdate: state.reducer.storeAccount.update,
    language: state.reducer.storeAccount.request.list,
    response: state.reducer.storeAccount.update,
    businessplan: state.reducer.businessPlan.request.list,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeAccount =  Form.create(mapPropsToFields)(StoreAccount);

export default connect(mapStateToProps)(storeAccount);
