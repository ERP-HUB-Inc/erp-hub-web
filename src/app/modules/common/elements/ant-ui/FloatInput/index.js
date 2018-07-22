
import React from "react";
import "./index.css";
import Element, { Form } from "../../common/Element";

class FloatInput extends Element {
  constructor(props){
    super(props);
    this.state = {
      focus: "form-group",
      formLabel: "form-label"
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);

  } 

  onFocus(){
    this.focused();
  }

  handleClick(){
    this.focused();
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  onBlur(e){
    if(e.target.value == ""){
      this.focusrelativeLabel();
    }
  }

  focusrelativeLabel(){
    this.setState({
      focus: "focus-relative"
    });
  }

  focused(){
    this.setState({
      focus:"focused"
    });
  }
    
  render() {
    console.log("Props:",  this.props);
    const { label } = this.props;
    const { focus, value, formLabel } = this.state;
    const { getFieldDecorator } = this.props.form;
    const { input } = this.props;
    delete input["value"];
    return (
      <div className="form-wrapper">
        <div className={ focus }>
          <label onClick={ this.handleClick } className={ formLabel }>
            { label }
          </label>
          {
            getFieldDecorator("email", {rules: this.props.rules})(
              <input 
                {...input}
                className="form-input" 
                type="text"
                onChange={ this.handleChange } 
                onFocus={ this.onFocus } 
                onBlur={ this.onBlur }
              />
            )  
          }
        </div>
      </div>
    );
  }
}

export default Form.create()(FloatInput);

