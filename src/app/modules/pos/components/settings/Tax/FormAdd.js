import React from "react";
import InputText from "../../../../common/elements/ant-ui/InputText";
import Component from "../../Component";

export default class Add extends Component {
  render() {
    return (
      <div>
        <this.Button className="info" onClick={() => alert("Payment Method")}>Payment Method</this.Button>
        <InputText name="name" label="Name" required={true} />
        <InputText name="description" label="Description" required={false} />
      </div>
    );
  }
}