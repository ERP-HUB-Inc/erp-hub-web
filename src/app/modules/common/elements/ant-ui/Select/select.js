import React, { Component } from "react";
import {  
  FormGroup,
  Label,
  FormText
} from "reactstrap";
import { Select } from "antd";
const Option = Select.Option;

function handleBlur() {
  console.log("blur");
}
  
function handleFocus() {
  console.log("focus");
}

export class Selects extends Component{

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value) {
    console.log(`selected ${value}`);
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
            style={{ width: 200 }}
            placeholder={ placeholder }
            optionFilterProp="children"
            onChange={ () => this.handleChange(value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            defaultValue={defaultValue}
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