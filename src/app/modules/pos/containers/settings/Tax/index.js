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
    tax: state.reducer.tax.request,
    taxAdd: state.reducer.tax.add,
    taxUpdate: state.reducer.tax.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const tax = Form.create(mapPropsToFields)(Tax);

export default connect(mapStateToProps)(tax);