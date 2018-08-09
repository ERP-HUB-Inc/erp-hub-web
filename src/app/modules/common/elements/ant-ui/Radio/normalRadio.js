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
      value1:"",
      setValue1: 1
    };
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
      }
    ];
    
    this.onChange1 = this.onChange1.bind(this);
  }

  onChange1 (e){
    console.log("radio1 checked", e.target.value);
    this.setState({
      value: e.target.value,
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
            getFieldDecorator(this.props.name, {rules: this.rules })(
              <RadioGroup 
                onChange={this.onChange1}
                value={ this.state.setValue1 } 

              >
                <Radio value={0}>Pay as your business growth</Radio>
                <Radio value={1}>Pay on your 5 stores package</Radio>
                <Radio value={2}>Pay on your 10 stores package</Radio>
                <Radio value={3}>Pay on your 15 stores package</Radio>
              </RadioGroup>
            )
          }
        </this.FormItem>
        <br />
      </div>
    );
  }
}

export class Radios extends Element {
  render(){
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        {
          getFieldDecorator()(
            <Radio value={ this.props.value }>{ this.props.title }</Radio>
          )
        }
      </div>
    );
  }

}

NormalRadio.defaultProps = {
  errorRequired: "Pleace Select"
};