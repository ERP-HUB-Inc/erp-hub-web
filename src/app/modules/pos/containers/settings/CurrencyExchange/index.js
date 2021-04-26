import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import List from "../../../components/settings/CurrencyExchange";

class CurrencyExchange extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.currencyExchange.request,
    add: state.reducer.currencyExchange.add,
    update: state.reducer.currencyExchange.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const currencyExchange = Form.create(mapPropsToFields)(CurrencyExchange);

export default connect(mapStateToProps)(currencyExchange);