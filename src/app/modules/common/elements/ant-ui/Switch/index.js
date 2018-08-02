// import React, { Component } from "react";
// import { Switch } from "antd";

// export class Switchs extends Component {

//   constructor(props) {
//     super(props);
//     this.onChange = this.onChange.bind(this);
//   }

//   onChange(checked) {
//     console.log(`switch to ${checked}`);
//   }

//   render(){
//     return(
//       <div>
//         <Switch defaultChecked onChange={ this.props.onChange } />
//       </div>
//     );
//   }
// }


import React, { Component } from "react";
import { Switch } from "antd";

// let defaultProps = {
//   checkedChildren: "Checked",
//   unCheckedChildren: "Unchecked"
// }; 

export class Switchs extends Component {

  constructor(props) {
    super(props);
    const checked =  (this.props.value == 1) ? true : false;
    this.state = {
      // ...defaultProps,
      ...this.props,
      checked
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {
    this.setState({checked});
    const value  = checked ? 1 : 0;
    const onChange = this.props.onChange;
    onChange && onChange(value);
    console.log(value);
    console.log(`switch to ${checked}`);
  }

  render(){
    return(
      <div>
        <Switch defaultChecked {...this.state}  onChange={ this.onChange } />
      </div>
    );
  }
}

