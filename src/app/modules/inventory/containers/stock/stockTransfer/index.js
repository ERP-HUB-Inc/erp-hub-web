import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import Lists from "../../../components/stock/stockTransfer";

class List extends React.Component {
  render() {
    return (
      <Lists {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    stockTransfer: state.reducer.stockTransfer.request,
    stockTransferAdd: state.reducer.stockTransfer.add,
    stockTransferArchive: state.reducer.stockTransfer.archive,
    stockTransferUpdate: state.reducer.stockTransfer.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const list = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(list);