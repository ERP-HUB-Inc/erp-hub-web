import React from "react";
import Element from "../../common/Element";
import { Radio } from "antd";
import "./index.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class RadioRegisterGroup extends Element {

  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="main-radio">
        <this.FormItem label={this.props.label}>
          {
            getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.defaultValue})(
              <RadioGroup 
                onChange={this.onChange}
                required={this.props.required}
              >
                {this.props.children}
              </RadioGroup>
            )
          }
        </this.FormItem>
      </div>
    );
  }
}

export class RadioRegister extends Element {
  render(){
    const { value, title, language, currency } = this.props;
    return(
      <RadioButton value={ value }>
        <div className="radio-group">
          <div className="radio-title">{ title }</div>
          <div className="language">
            { language } <br/>
            { currency }</div>
        </div>
      </RadioButton>
    );
  }
}
