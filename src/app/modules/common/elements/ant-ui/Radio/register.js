import React, { Component } from "react";
import { Radio } from "antd";
import "./index.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class RadioRegisterGroup extends Component {

  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
  }

  render() {
    const { input,label } = this.props;
    return (
      <div>
        <div className="main-radio" style={{ marginTop: 16 }}>
          <label>{ label }</label>
          <RadioGroup 
            onChange={ this.onChange } 
            defaultValue="a" 
            { ...input }
          >
            { this.props.children }
          </RadioGroup>
        </div>
      </div>
    );
  }
}

export class RadioRegister extends Component {
  render(){
    const { input,value,title,language,currency } = this.props;
    return(
      <RadioButton { ...input } value={ value }>
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
