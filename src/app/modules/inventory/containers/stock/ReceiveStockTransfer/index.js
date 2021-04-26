import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import Lists from "../../../components/stock/ReceiveStockTransfer";

class List extends React.Component {
  render() {
    return (
      <Lists {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.stockTransfer.request,
    add: state.reducer.stockTransfer.add,
    update: state.reducer.stockTransfer.update,
    detail: state.reducer.stockTransfer.detail,
    cancel: state.reducer.stockTransfer.cancel,
    approve: state.reducer.stockTransfer.approve,
    accessLocation: state.reducer.location.requestAccessLocation,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const list = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(list);