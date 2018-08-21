import React from "react";
import Component from "../../Component";

export default class FormElement extends Component {
  render() {
    return (
      <div>
        <this.InputText name="name" label="Name" placeholder="Please input your name" required={true} max={100}/>
        <this.InputText name="description" label="Description" placeholder="Description" max={255}/>
      </div>
    );
  }
}