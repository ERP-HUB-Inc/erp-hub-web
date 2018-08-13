import React from "react";
import Element from "../../common/Element";

export class RadioNormal extends Element {
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
        <this.FormItem label={label}>
          {
            getFieldDecorator(this.props.name, {rules: this.rules, initialValue: this.props.defaultValue })(
              <this.Radio.Group
                disabled={this.props.disabled}
                onChange={this.onChange} 
              >
                {this.props.dataSource.map((row, index) => <this.Radio key={index} value={row.value}>{row.title}</this.Radio>)}
              </this.Radio.Group>
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