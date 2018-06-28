import React, { Component } from "react";
import {  
  FormGroup,
  Label,
  FormText
} from "reactstrap";
import { Select } from "antd";
const Option = Select.Option;

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
      label,
      required,
      options,
      children,
      placeholder,
      value,
      defaultValue,
      meta: {
        touched, error, warning, valid
      }
    } = this.props;
    return(
      <div className="main-antselect">
        <FormGroup>
          <Label className="">{label} <span className="text-danger"> {required} </span></Label>
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder={ placeholder }
            optionFilterProp="children"
            onChange={ () => this.handleChange(value)}
            onFocus={ this.handleFocus }
            onBlur={ this.handleBlur }
            defaultValue={ defaultValue }
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            { children }
            <Option value={ value }>
              { options }
            </Option>
          </Select>
          {touched &&
        ((error && <FormText className="select-error"> {error} </FormText>) ||
          (warning && <FormText className="select-error"> {warning} </FormText>))}
        </FormGroup>
      </div>
    );
  }
} 