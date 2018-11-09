import React from "react";
import {connect} from "react-redux";
import {Form} from "antd";
import FormOpen from "../../../components/transactions/OpenSaleRegistration/FormOpen";

class OpenForm extends React.Component {
  render() {
    return (
      <FormOpen {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    open: state.reducer.openSaleRegistration.open,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const openForm =  Form.create(mapPropsToFields)(OpenForm);

export default connect(mapStateToProps)(openForm);