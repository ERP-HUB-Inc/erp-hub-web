import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Select extends Element {
  constructor(props) {
    super(props);
    this.getName = this.getName.bind(this);
  }
  getName(value) {
  
    if (this.props.nestedName &&
      this.props.nestedName in value &&
      value[this.props.nestedName]) {
      if (Array.isArray(value[this.props.nestedName]) && value[this.props.nestedName].length > 0) {
        value[this.props.nestedName] = value[this.props.nestedName][0];
      }
      return value[this.props.nestedName][this.props.nameKey];
    }
    
    if(this.props.concatNameKey){
      console.log("this.props.concatNameKey",`${value[this.props.nameKey]} ${value[this.props.concatNameKey]}`);
      // return value[this.props.nameKey] + " " + value[this.props.concatNameKey];
      return `${value[this.props.nameKey]} ${value[this.props.concatNameKey]}`;
    }else{
      return value[this.props.nameKey];
    }

    // return value[this.props.nameKey];
   
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let dataSource = this.props.dataSource;
    if (!Array.isArray(dataSource)) {
      dataSource = [];
    }

    const options = {
      rules: [
        {
          required: this.props.required,
          message: this.props.errorRequired}
      ]
    };

    if (this.props.defaultValue) {
      options["initialValue"] = this.props.defaultValue;
    } else if (!this.props.placeholder) {
      options["initialValue"] = this.props.defaultValue;
    }

    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}
        validateStatus={this.props.validateStatus}>
        {
          getFieldDecorator(this.props.name, options)(
            <this.Select
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              onFocus={this.props.handleOnFocus}
              disabled={this.props.disabled}
              style={{ width: "100%" }}>
              {
                dataSource.map((value, index) =>
                  <this.Option key={index} value={value[this.props.valueKey]}>
                    {this.getName(value)}
                  </this.Option>
                )
              }
            </this.Select>
          )
        }
      </this.FormItem>
    );
  }   
}

Select.defaultProps = {
  required: false,
  errorRequired: "Please select this field",
  valueKey: "value",
  nameKey: "name",
  nestedName: null, 
  concatNameKey: null
};
