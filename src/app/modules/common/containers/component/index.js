import React from "react";
import Component from "../../components/Component";
import InputEmail from "../../elements/ant-ui/InputEmail";

export default class ComponentList extends Component {
  constructor(props) {
    super(props);
  }
  
  render(){
    return(
      <div>
        <h3>Welcome to CA Component !!!</h3>
        <InputEmail name="email1" placeholder="Email" required={true} />
        <InputEmail name="email2" placeholder="Email" required={true} />
      </div>
    );
  }
}
