import React from "react";
import Element, { ReduxForm } from "../../common/Element";
import TextInput from "./input";

class InputEmail extends Element {

  constructor(props) {
    super(props);
<<<<<<< HEAD
    this.handleChange = this.handleChange.bind(this);
    this.validation = this.validation.bind(this);
    this.handleValidator = this.handleValidator.bind(this);
  }

  componentDidMount() {
    alert("Did mount");
    this.props.textRequire = <this.Translate id="text_require" />;
    this.props.textInvalid = <this.Translate id="text_invalid" />;
    this.validation();
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
=======
    this.rules = [
      {
        type: "email",
        message: this.props.errorInvalid
      },
      {
        required: this.props.required,
        message: this.props.errorRequired
      },
      {
        min: this.props.min,
        message: this.props.errorLenght
      },
      {
        max: this.props.max,
        message: this.props.errorLenght
      }
    ];
>>>>>>> 42dd1ea565463a842f357f655f3d971564c5daf6
  }

  render() {
    return (
      <this.Field 
        name={this.props.name}
        type="text"
        component={ TextInput }
        label={this.props.label}
        placeholder={this.props.placeholder}
        required = {this.props.required}
        rules = {this.rules}
      />
    );
  }   
}

<<<<<<< HEAD
// InputEmail.defaultProps = {
//   textRequire: "",
//   textInvalid: ""
// };
=======
InputEmail.defaultProps = {
  name: "email",
  label: "Email",
  required: false,
  min: 3,
  max: 100,
  errorInvalid: "Invalid email",
  errorRequired: "Email required",
  errorLenght: "Over allow character lenght"
};
>>>>>>> 42dd1ea565463a842f357f655f3d971564c5daf6

export default ReduxForm({
  form: "syncValidation"
})(InputEmail);
