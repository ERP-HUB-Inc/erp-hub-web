import React, { Component } from "react";
import { Radio } from "antd";
import "./index.css";

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

export class RadioRegister extends Component {

  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
  }

  render() {
    return (
      <div className="main-radio" style={{ marginTop: 16 }}>
        <RadioGroup onChange={ this.onChange } defaultValue="a">
          <RadioButton value="a">
            <div className="radio-group">
              <div className="radio-title">GLOBAL</div>
              <div className="language">
              English <br/>
              USD</div>
            </div>
          </RadioButton>
          <RadioButton value="b">
            <div className="radio-group">
              <div className="radio-title">GLOBAL</div>
              <div className="language">
              English <br/>
              USD</div>
            </div>
          </RadioButton>
          <RadioButton value="c">
            <div className="radio-group">
              <div className="radio-title">GLOBAL</div>
              <div className="language">
              English <br/>
              USD</div>
            </div>
          </RadioButton>
        </RadioGroup>
      </div>
    );
  }
}
