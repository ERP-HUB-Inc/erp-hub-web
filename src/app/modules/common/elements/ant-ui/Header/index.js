import React, { Component } from "react";
import {  
  Col,
  Row
} from "reactstrap";
import { Field,reduxForm } from "redux-form";

const renderField = ({
  input,
  label,
  type,
  placeholder,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={placeholder} type={type} />
      {touched &&
        ((error && <span>{error}</span>) ||
          (warning && <span>{warning}</span>))}
    </div>
  </div>
);

class Header extends Component {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    alert("dd");
  }

  render() {
    return (
      <div className="header">
        <Col md="12">
          <Row>
            <Col md="2 border-right">
              <div className="logo-title"> Store VEIN </div>
              Backoffice
            </Col>
            <Col md="5">
              <form onSubmit={ this.handleSubmit }>
                <Field
                  name="search"
                  type="text"
                  component={ renderField }
                  placeholder="Search Transaction Invoice or"
                />
              </form>
            </Col>
            <Col md="5">
              
            </Col>
          </Row>
        </Col> 
      </div>
    );
  }
}

export default reduxForm({
  form: "Headers", 
})(Header);

