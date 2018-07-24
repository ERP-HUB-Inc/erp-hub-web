// import React, { Component } from "react";
// import {  
//   FormGroup,
//   Label
// } from "reactstrap";
// // import "./index.css"; 
// import { Select,Form } from "antd";
// const FormItem = Form.Item;

// export class Selects extends Component{

//   constructor(props) {
//     super(props);
//     this.state = {
//       focus: "",
//       value: ""
//     };

//     this.handleChange = this.handleChange.bind(this);
//     this.handleBlur = this.handleBlur.bind(this);
//     this.handleFocus = this.handleFocus.bind(this);
//   }

//   handleChange(value) {
//     console.log(`selected ${value}`);
//     if(value == ""){
//       this.setState({
//         focus: ""
//       });
//     }
//   }

//   handleBlur() {
//     console.log("blur");
//   }

//   handleFocus() {
//     this.setState({
//       focus: "focus-label"
//     });
//     console.log("focus");
//   }

//   render(){
//     const {
//       input,
//       label,
//       required,
//       children,
//       placeholder,
//       defaultValue
//     } = this.props;
//     const { focus } = this.state;
//     return(
//       <div className="main-antselect">
//         <FormGroup>
//           <Label className={ focus }>
//             {label} 
//             <span className="text-danger"> {required} </span>
//           </Label>
//           <FormItem>
//             <Select
//               style={{ width: "100%" }}
//               placeholder={ placeholder }
//               onChange={ this.handleChange}
//               onFocus={ this.handleFocus }
//               onBlur={ this.handleBlur }
//               defaultValue={ defaultValue }
//               {...input}
//             >
//               { children } 
//             </Select>
//           </FormItem>
//         </FormGroup>
//       </div>
//     );
//   }
// } 


import React, { Component } from "react";
import {  
  FormGroup,
  Label
} from "reactstrap";
// import "./index.css"; 
import { Select,Form } from "antd";
const FormItem = Form.Item;

export class Selects extends Component{

  constructor(props) {
    super(props);
    this.state = {
      focus: "",
      value: ""
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }

  handleChange(value) {
    console.log(`selected ${value}`);
  }

  handleBlur() {
    console.log("blur");
  }

  handleFocus() {
    console.log("focus");
  }

  render(){
    const {
      input,
      label,
      required,
      children,
      placeholder,
      defaultValue
    } = this.props;
    const { focus } = this.state;
    return(
      <div className="main-antselect">
        <Label className={ focus }>
          {label} 
          <span className="text-danger"> {required} </span>
        </Label>
        <FormItem>
          <Select
            style={{ width: "100%" }}
            placeholder={ placeholder }
            onChange={ this.handleChange}
            onFocus={ this.handleFocus }
            onBlur={ this.handleBlur }
            defaultValue={ defaultValue }
            {...input}
          >
            { children } 
          </Select>
        </FormItem>
      </div>
    );
  }
} 
