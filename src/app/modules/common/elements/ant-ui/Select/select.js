import React, { Component } from "react";
import {  
  FormGroup,
  Label
} from "reactstrap";
import { Select,Form } from "antd";
const FormItem = Form.Item;

export class Selects extends Component{

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  handleBlur() {
    console.log("blur");
  }

  handleFocus() {
    console.log("focus");
  }

  render(){
    const {
      input,
      label,
      required,
      children,
      placeholder,
      defaultValue,
      meta: {
        touched, error, warning
      }
    } = this.props;
    return(
      <div className="main-antselect">
        <FormGroup>
          <Label className="">{label} <span className="text-danger"> {required} </span></Label>
          <FormItem
            validateStatus={ touched && error ? "error" : ""  }
            help = 
              {touched && 
               ((
                 error && <span>{error}</span> || warning && <span>{warning}</span>
               ))
              }
          >
            <Select
              style={{ width: "100%" }}
              placeholder={ placeholder }
              onChange={ this.handleChange}
              onFocus={ this.handleFocus }
              onBlur={ this.handleBlur }
              defaultValue={ defaultValue }
              {...input}
            >
              { children } 
            </Select>
          </FormItem>
        </FormGroup>
      </div>
    );
  }
} 

// export default Selects = Component => ({ input, meta, children, hasFeedback, label, ...rest }) => {
//   const hasError = meta.touched && meta.invalid;
//   return (
//     <div className="main-antselect">
//       <FormItem
//         label={label}
//         validateStatus={hasError ? "error" : "success"}
//         hasFeedback={hasFeedback && hasError}
//         help={hasError && meta.error}
//       >
//         <Component {...input} {...rest} children={children} />
//       </FormItem>
//     </div>
//   );
// };