import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import Filter from "../../../components/shares/Filter";

class FilterView extends React.Component {
  render() {
    return (
      <Filter {...this.props} />
    );
  }
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}
  
const filterView =  Form.create(mapPropsToFields)(FilterView);
  
export default connect()(filterView);