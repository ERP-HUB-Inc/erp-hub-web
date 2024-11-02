import React from "react";
import {RadioNormal} from "./RadioNormal";

export class RadioButton extends React.Component {

  constructor(props){
    super(props);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
      }
    ];
  }

  render() {
    return (
      <RadioNormal 
        name={this.props.name}
        label={this.props.label}
        rules={this.rules}
        required={this.props.required}
        dataSource={this.props.dataSource}
        defaultValue={this.props.defaultValue}
        disabled={this.props.disabled}
        onChange={this.props.onChange}
        form={this.props.form}
      />
    );
  }   
}




