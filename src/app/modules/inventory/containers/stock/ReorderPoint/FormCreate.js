import React from "react";
import Create from "../../../components/stock/ReorderPoint/FormCreate";
import { connect } from "react-redux";
import { Form } from "antd";

class ReorderForm extends React.Component {
  render() {
    return (
      <Create {...this.props} />
    );
  }
}
  
function mapStateToProps(state) {
  return {
    reorderPointAdd: state.reducer.reorderPoint.add,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const reorderForm =  Form.create(mapPropsToFields)(ReorderForm);

export default connect(mapStateToProps)(reorderForm);