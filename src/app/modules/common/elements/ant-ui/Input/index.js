
import React from "react";
import Element from "../../common/Element";

class TextInput extends Element {

  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "",
      success:""
    };
  }

  render() {
    const {
      input, 
      label,
      type,
      meta: { touched, error, warning },
      placeholder
    } = this.props;

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
                  (error && <span>{error}</span>) || (warning && <span>{warning}</span>)
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
