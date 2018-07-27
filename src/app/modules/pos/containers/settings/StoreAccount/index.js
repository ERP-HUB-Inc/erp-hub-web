import React from "react";
import { connect } from "react-redux";
import { reduxForm } from "redux-form";
import List from "../../../components/settings/StoreAccount";

class StoreAccount extends React.Component {
  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return {
   
  };
}

const Account = reduxForm({
  form: "formStoreLocation"
})(StoreAccount);

export default connect(mapStateToProps)(Account);