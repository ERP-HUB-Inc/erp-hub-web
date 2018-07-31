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
   
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeAccount =  Form.create(mapPropsToFields)(StoreAccount);

export default connect(mapStateToProps)(storeAccount);
