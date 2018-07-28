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
      input,
      placeholder,
      label
    } = this.props;
    return (
      <div className="main-ant-wrapper">
        <this.FormItem label={ label }>
          <RadioGroup 
            options={ this.props.data } 
            onChange={this.onChange1} 
            // value={this.state.value1} 
            { ...input }
          />
        </this.FormItem>
        <br />
      </div>
    );
  }
}