
import React from "react";
import Element, { ReduxForm } from "../../common/Element";

class TextInput extends Element {

  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "",
      success:""
    };
    // this.handleChange = this.handleChange.bind(this);
  }

  // handleChange(e){
  //   this.props.handleChange();
  //   const value = e.target.value;
  //   this.setState({value});
  // }

  render() {
    const {
      input, 
      label,
      type,
      meta: { touched, error, warning },
      placeholder
    } = this.props;
    const { value } = this.state;

    return (
      <div>
        <this.FormGroup>
          <this.Label>
            { label }
          </this.Label>
          <this.FormItem
            hasFeedback
            validateStatus={ touched && error ? "error" : ""  }
            help = 
              {touched && 
                ((
                  error && <span>{error}</span> || warning && <span>{warning}</span>
                ))
              }
          >
            <this.Input 
              {...input} 
              placeholder={ placeholder } 
              type={ type } 
              // value={ value }
              // onChange={this.handleChange}
            />
          </this.FormItem>
        </this.FormGroup>
      </div>
    );

  }

}

export default TextInput;
