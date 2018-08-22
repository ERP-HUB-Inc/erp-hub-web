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
    brand: state.reducer.brand.request,
    brandAdd: state.reducer.brand.add,
    brandArchive: state.reducer.brand.archive,
    brandUpdate: state.reducer.brand.update
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const brand = Form.create(mapPropsToFields)(Brand);

export default connect(mapStateToProps)(brand);