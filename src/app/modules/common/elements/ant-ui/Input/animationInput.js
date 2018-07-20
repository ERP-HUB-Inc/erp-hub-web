
import React from "react";
import "./index.css";
import Element from "../../common/Element";

export class AnimationInput extends Element {

  constructor(props){
    super(props);
    this.state = {
      focus: "form-group",
      form_label: "form-label"
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
  } 

  onFocus(){
    this.setState({
      focus:"focused"
    });
  }

  handleChange(e) {
    this.setState({ value: e.target.value });
  }

  onBlur(e){
    if(e.target.value == ""){
      this.setState({
        focus: "focus-relative"
      });
    }
  }
    
  render() {
    const { focus,
      value,
      form_label 
    } = this.state;
    return (
      <div className="form-wrapper">
        <div className={ focus }>
          <label className={ form_label }>
            What is your name?
          </label>
          <input 
            className="form-input" 
            type="text" 
            value={ value } 
            onChange={ this.handleChange } 
            onFocus={ this.onFocus } 
            onBlur={ this.onBlur }
          />
        </div>
      </div>
    );
  }

}

