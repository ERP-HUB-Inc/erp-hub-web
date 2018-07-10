
import React, { Component } from "react";
import {  
  FormGroup,
  Label
} from "reactstrap";

import { Form, Input } from "antd";

const FormItem = Form.Item;

class Antinput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      validateStatus: "",
      success:""
    };
    this.handleNumberChange = this.handleNumberChange.bind(this);
  }

  handleNumberChange(e){
    const getval = e.target.value;
    if(getval.length >10){
      alert("dd");
    }
    this.setState({
      value: getval
    });

  }

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
        <FormGroup>
          <Label>
            { label }
          </Label>
          <FormItem
            hasFeedback
            validateStatus={ touched && error ? "error" : ""  }
            help = 
              {touched && 
                ((
                  error && <span>{error}</span> || warning && <span>{warning}</span>
                ))
              }
          >
            <Input 
              {...input} 
              placeholder={ placeholder } 
              type={ type } 
              value={ value }
              onChange={this.handleNumberChange}
            />
          </FormItem>
        </FormGroup>
      </div>
    );

  }

}

export default Antinput;

// import React, { Component } from "react";
// import {  
//   FormGroup,
//   Label
// } from "reactstrap";

// import { Form, Input } from "antd";

// const FormItem = Form.Item;

// export class Antinput extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {
//       validateStatus: "",
//       success:""
//     };
//   }

//   render() {
//     const { getFieldDecorator } = this.props.form;
//     const {
//       input, 
//       label,
//       type,
//       meta: { touched, error, warning },
//       placeholder
//     } = this.props;

//     return (
//       <div>
//         <FormGroup>
//           <Label>
//             { label }
//           </Label>
//           <FormItem>
//             {getFieldDecorator("text", {
//               rules: [{

//                 // type: "email", message: "The input is not valid E-mail!",

//                 rules: [{ required: true, message: "Please input website!" }]
//               }],
//             })(
//               <Input 
//                 {...input} 
//               />
//             )}
//           </FormItem>
//         </FormGroup>
//       </div>


      

//     );

//   }

// }

// const SapleInputs = Form.create()(Antinput);
// export default SapleInputs;