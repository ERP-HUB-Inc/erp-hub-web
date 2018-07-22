import React, { Component } from "react";
import { Radio } from "antd";
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class RadioRegister extends Component {

  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
  }

  render() {
    return (
      <div style={{ marginTop: 16 }}>
        <RadioGroup onChange={ this.onChange } defaultValue="a">
          <RadioButton value="a">GLOBAL</RadioButton>
          <RadioButton value="c">CAMBODIA</RadioButton>
          <RadioButton value="d">MYANMAR</RadioButton>
        </RadioGroup>
      </div>
    );
  }
}
