import React from "react";
import { Form, Radio } from "antd";

export class RadioNormal extends React.Component {
  constructor(props){
    super(props);
    this.rules = [
      {
        required: this.props.required,
        message: this.props.errorRequired
      }
    ];
    
    this.onChange = this.onChange.bind(this);
  }

  onChange (e){
    this.props.form.setFieldsValue({
      [this.props.name]: e.target.value
    });
  };

  render(){
    const {label} = this.props;
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="main-ant-wrapper">
        <Form.Item label={label}>
          {
            getFieldDecorator(this.props.name, {rules: this.rules, initialValue: this.props.defaultValue })(
              <Radio.Group
                disabled={this.props.disabled}
                onChange={this.props.onChange} 
                buttonStyle={this.props.buttonStyle}
              >
                {this.props.buttonStyle === "solid" ?
                  this.props.dataSource.map((row, index) => <Radio.Button disabled={row.disabled} key={index} value={row.value}>{row.title}</Radio.Button>)
                  : this.props.dataSource.map((row, index) => <Radio disabled={row.disabled} style={this.props.inputStyle} key={index} value={row.value}>{row.title}</Radio>)
                }
              </Radio.Group>
            )
          }
        </Form.Item>
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
            <this.Radio value={ this.props.value }>{this.props.title}</this.Radio>
          )
        }
      </div>
    );
  }
}

RadioNormal.defaultProps = {
  name: "radio",
  dataSource: []
};