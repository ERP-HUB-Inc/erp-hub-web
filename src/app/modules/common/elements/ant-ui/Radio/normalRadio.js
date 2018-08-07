import React from "react";
import {  
  Label,
  FormGroup
} from "reactstrap";
import Element from "../../common/Element";
// import "./index.css";
import { Radio } from "antd";


const RadioGroup = Radio.Group;

export class NormalRadio extends Element {

  constructor(props){
    super(props);
    this.state={
      value1:""
    };
    this.onChange1 = this.onChange1.bind(this);
  }

  onChange1 (e){
    console.log("radio1 checked", e.target.value);
    this.setState({
      value1: e.target.value,
    });
  };

  render(){
    const { 
      label
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="main-ant-wrapper">
        <this.FormItem label={ label }>
          {
            getFieldDecorator(this.props.name, {rules: this.props.rules })(
              <RadioGroup 
                options={ this.props.data } 
                onChange={this.onChange1} 
              />
            )
          }
        </this.FormItem>
        <br />
      </div>
    );
  }
}