import React from "react";
import InputEmail from "../../../../common/elements/ant-ui/InputEmail";
import Component from "../../Component";

export default class Add extends Component {
  render() {
    return (
      <div>
        <InputEmail name="name" placeholder="Name" required={true} />
        <InputEmail name="description" placeholder="Description" required={true} />
      </div>
    );
  }
}