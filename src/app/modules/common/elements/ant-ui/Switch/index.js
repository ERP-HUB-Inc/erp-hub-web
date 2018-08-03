import React from "react";
import Element, { Form } from "../../common/Element";
import "./index.css";
import { Switch } from "antd";

export class Switchs extends Element {

  constructor(props) {
    super(props);
    const checked =  this.props.value == 1;
    this.state = {
      ...this.props,      
      checked
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {
    this.setState({checked});
    const value  = checked ? 1 : 0;
    const onChange = this.props.onChange;
    onChange && onChange(value);
    console.log(value);
    console.log(`switch to ${checked}`);
  }

  render(){
    return(
      <div className="main-switch">
        <this.FormItem label={ this.props.label }>
          <Switch defaultChecked {...this.state}  onChange={ this.onChange } />
        </this.FormItem>
      </div>
    );  
  }
}

