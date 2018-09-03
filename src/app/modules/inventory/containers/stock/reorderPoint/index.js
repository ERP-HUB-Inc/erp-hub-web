import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import Lists from "../../../components/stock/reorderPoint";

class ReorderPointList extends React.Component {
  render() {
    return (
      <Lists {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    reorderPoint: state.reducer.reorderPoint.request,
    reorderPointAdd: state.reducer.reorderPoint.add,
    reorderPointArchive: state.reducer.reorderPoint.archive,
    reorderPointUpdate: state.reducer.reorderPoint.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reorderPoint = Form.create(mapPropsToFields)(ReorderPointList);

export default connect(mapStateToProps)(reorderPoint);