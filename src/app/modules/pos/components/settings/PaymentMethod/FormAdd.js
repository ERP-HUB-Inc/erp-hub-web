import React from "react";
import InputEmail from "../../../../common/elements/ant-ui/InputEmail";
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
        <InputEmail name="name" label="Name" placeholder="Please input your name"/>
        <InputEmail  name="description" label="Description" placeholder="Description"/>
        <Select name="status" label="Status" placeholder="Please select status" dataSource={dataSource} defaultValue={1}/>
      </div>
    );
  }
}