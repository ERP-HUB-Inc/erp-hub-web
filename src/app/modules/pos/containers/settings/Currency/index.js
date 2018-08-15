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
    currency: state.reducer.currency.request,
    currencyAdd: state.reducer.currency.add,
    currencyUpdate: state.reducer.currency.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currency = Form.create(mapPropsToFields)(Currency);

export default connect(mapStateToProps)(currency);