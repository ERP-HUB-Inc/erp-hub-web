import React from "react";
import {Form} from "antd";
import {connect} from "react-redux";
import StoreLanguageList from "../../../components/settings/StoreLanguage";

class StoreLanguage extends React.Component {

  render() {
    return (
      <StoreLanguageList {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
    list: state.reducer.storeLanguage.request,
    add: state.reducer.storeLanguage.add,
    update: state.reducer.storeLanguage.update,
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const storeLanguage = Form.create(mapPropsToFields)(StoreLanguage);

export default connect(mapStateToProps)(storeLanguage);