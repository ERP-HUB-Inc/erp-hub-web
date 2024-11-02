import React from "react";
import { Form, Radio } from "antd"
import "./index.css";

export class RadioBox extends React.Component {
  constructor(props){
    super(props);
    this.rules = [
      {
        required : this.props.required,
        message: this.props.errorRequired
      }
    ];
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={ this.props.className }>
        <Form.Item label={this.props.label}>
          {
            getFieldDecorator(this.props.name, {rules: this.rules , initialValue: this.props.defaultValue})(
              <Radio.Group
                disabled={this.props.disabled}
                onChange={this.props.onChange}
                style={{paddingTop: "5px", width: "100%", display: "flex"}}>
                {this.props.children}
              </Radio.Group>
            )
          }
        </Form.Item>
      </div>
    );
  }
}

export class RadioChildBox extends React.Component {
  render(){
    const { value, title, language, currency } = this.props;
    return(
      <Radio.Button value={ value } className={this.props.className}>
        <div className="radio-group">
          <div className="radio-title">{ title }</div>
          <div className="language">
            {language} <br/>
            {currency}
          </div>
        </div>
      </Radio.Button>
    );
  }
}


RadioBox.defaultProps = {
  errorRequired: "This Field is required",
  className: "main-radio"
};