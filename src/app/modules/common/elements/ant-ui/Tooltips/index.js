import React, { Component } from "react";
import { Tooltip, Button } from "antd";
import "./index.css"; 

const text = <span>prompt text dd dff ddd</span>;
const buttonWidth = 70;

export class Tooltips extends Component {
  render(){
    return(
      <div className="main-tooltip" style={{ width: buttonWidth, marginLeft: (buttonWidth * 4) + 24 }}>
        <Tooltip placement="rightTop" title={text}>
          <Button>RT</Button>
        </Tooltip>
      </div>
    );
  }
}
