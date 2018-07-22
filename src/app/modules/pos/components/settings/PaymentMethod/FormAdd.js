import React from "react";
import InputText from "../../../../common/elements/ant-ui/InputText";
import Select from "../../../../common/elements/ant-ui/Select";
import Component from "../../Component";

export default class Add extends Component {
  render() {
    const dataSource = [
      {
        name: "Active",
        value: 1
      },
      {
        name: "Deactive",
        value: 0
      }
    ];
    return (
      <div>
        <InputText name="name" label="Name" placeholder="Please input your name" required={true}/>
        <InputText name="description" label="Description" placeholder="Description"/>
        <Select name="status" label="Status" placeholder="Please select status" dataSource={dataSource} defaultValue={1}/>
      </div>
    );
  }
}