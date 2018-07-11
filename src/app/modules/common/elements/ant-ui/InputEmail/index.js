import React from "react";
import Element, { ReduxForm } from "../../common/Element";

class InputEmail extends Element {

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.validation = this.validation.bind(this);
    this.handleValidator = this.handleValidator.bind(this);
  }

  componentDidMount() {
    alert("Did mount");
    this.props.textRequire = <this.Translate id="text_require" />;
    this.props.textInvalid = <this.Translate id="text_invalid" />;
  }

  handleChange() {
    // console.log("Input Email Handle Change");
  }

  handleValidator({email = ""}) {
    const rule = {
      required: true
    };
    return this.validation(email);
  }

  validation(value) {
    alert("Validator");
    const errors = {};
    if (this.Utils.isRequired(value)) {
      errors.email = this.props.textRequire; 
    } else if (this.Utils.isInvalidEmail(value)) {
      errors.email = this.props.textInvalid;
    }
    return errors;
  }

  render() {
    const test = this.props.test;
    return (
      <div>
        <this.Field 
          name="email"
          type="text"
          component={ this.TextInput }
          label="Email"
          placeholder="Email"
          handleChange = { this.handleChange }
        />
      </div>
    );
  }   
}

InputEmail.defaultProps = {
  textRequire: "",
  textInvalid: ""
};

export default ReduxForm({
  form: "syncValidation",
  validate: (new InputEmail()).handleValidator     
})(InputEmail);
