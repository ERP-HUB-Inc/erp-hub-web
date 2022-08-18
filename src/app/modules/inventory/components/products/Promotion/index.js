import React from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import List from "../../List";
import history from "../../../../common/router/history";

class Promotion extends List {

  componentDidMount() {

  }

  renderButtonAddNew() {
    return <this.Button
      type="info"
      id="btnAdd"
      className="mg-right text-uppercase"
      onClick={() => history.push({pathname: "/promotions/create"})}>
      <span className="icon-add icon-padding-right"></span>
      <this.Translate id="text_add_new" />
    </this.Button>;
  }

  renderPagination() {
    return <div />;
  }

  renderTable() {
    return <div />;
  }
}

export function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const promotion = Form.create(mapPropsToFields)(Promotion);

export default connect(mapStateToProps)(promotion);