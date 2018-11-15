import React from "react";
import { connect } from "react-redux";
import {Form} from "antd";
import BrandList from "../../../components/products/Brand";

class Brand extends React.Component {
  render() {
    return (
      <BrandList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.brand.request,
    add: state.reducer.brand.add,
    update: state.reducer.brand.update,
    checkPermission: state.reducer.privilege.checkPermission,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brand = Form.create(mapPropsToFields)(Brand);

export default connect(mapStateToProps)(brand);