import React, { Component } from "react";
import {  
  Col,
  Row
} from "reactstrap";

function submit(values){
  alert(values.search);
}

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

  render() {
    return (
      <div className="header">
        <Col md="12">
          <Row>
            <Col md="2 border-right">
              <div className="logo-title"> Store VEIN </div>
              <div className="slowgan-title">
                Backoffice
              </div>
            </Col>
            <Col md="5">
              
            </Col>
            <Col md="5">
              
            </Col>
          </Row>
        </Col> 
      </div>
    );
  }
}

export default Header;

