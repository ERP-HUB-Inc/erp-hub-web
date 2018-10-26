import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import ReorderPointList from "../../../components/stock/ReorderPoint";

class List extends React.Component {
  render() {
    return (
      <ReorderPointList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    reorderPoint: state.reducer.reorderPoint.request,
    reorderPointAdd: state.reducer.reorderPoint.add,
    reorderPointUpdate: state.reducer.reorderPoint.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reorderPoint = Form.create(mapPropsToFields)(List);

export default connect(mapStateToProps)(reorderPoint);