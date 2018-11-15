import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import VariantAttributeList from "../../../components/products/VariantAttribute";

class VariantAttribute extends React.Component {
  render() {
    return (
      <VariantAttributeList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    variantAttributes: state.reducer.variantAttribute.request,
    variantAttributeAdd: state.reducer.variantAttribute.add,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const variantAttribute = Form.create(mapPropsToFields)(VariantAttribute);

export default connect(mapStateToProps)(variantAttribute);