import React from "react";
import Element from "../../common/Element";
import { Radio } from "antd";
import "./index.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class RadioRegisterGroup extends Element {

  constructor(props){
    super(props);
    this.rules = [
      {
        required : this.props.required,
        message: this.props.errorRequired
      }
    ];
    this.onChange = this.onChange.bind(this);
  }
  
  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
    // const onChange = this.props.onChange;
    // onChange(e.target.value);
    // onChange();
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    // const { onChange } = this.props.onChange;
    return (
      <div className={ this.props.className }>
        <this.FormItem label={this.props.label}>
          {
            getFieldDecorator(this.props.name, {rules: this.rules , initialValue: this.props.defaultValue})(
              <RadioGroup 
                onChange={this.onChange}
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


RadioRegisterGroup.defaultProps = {
  errorRequired: "This Field is required",
  className: "main-radio"
};