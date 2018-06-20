import React from "react";
import { Menu, Dropdown, Button, Icon } from "antd";
import Component from "../Component";
import { reduxForm } from "redux-form";

class Header extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  switchLanguage(key) {
    const { dispatch } = this.props;
    dispatch(this.changeLanguage(key));
  }

  handleSubmit(){
    alert("dd");
  }

  render() {
    return (
      // <div className="header">
      <this.Col md="8">
        {/* <this.Row> */}
        <this.Col md="2 border-right">
          <div className="logo-title"> Store VEIN </div>
              Backoffice
        </this.Col>
        <this.Col md="5 search-block">
          <form onSubmit={ this.handleSubmit }>
            <this.Field
              name="title"
              type="text"
              placeholder="Search Transaction, invoice or help"
              component={ this.InputRedux }
            />
          </form>
        </this.Col>
        {/* </this.Row> */}
      </this.Col> 
      // </div>
    );
  }
}

export default reduxForm({
  form: "search", 
})(Header);
