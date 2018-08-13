import React from "react";
import Element from "../../common/Element";
import "./index.css";
export class RadioBox extends Element {
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
              <this.Radio.Group
                disabled={this.props.disabled}
                onChange={this.onChange}
                style={{paddingTop: "5px"}}
              >
                {this.props.children}
              </this.Radio.Group>
            )
          }
        </this.FormItem>
      </div>
    );
  }
}

export class RadioChildBox extends Element {
  render(){
    const { value, title, language, currency } = this.props;
    return(
      <this.Radio.Button value={ value }>
        <div className="radio-group">
          <div className="radio-title">{ title }</div>
          <div className="language">
            { language } <br/>
            { currency }</div>
        </div>
      </this.Radio.Button>
    );
  }
}


RadioBox.defaultProps = {
  errorRequired: "This Field is required",
  className: "main-radio"
};