// import React, { Component } from "react";
// import { Tooltip, Button } from "antd";

// const text = <span>prompt text</span>;
// const buttonWidth = 70;

// export class Tooltips extends Component {
//   render(){
//     return(
//       <div className="main-tooltip" style={{ width: buttonWidth, marginLeft: (buttonWidth * 4) + 24 }}>
//         <Tooltip className="main-tooltip" placement="rightTop" title={text}>
//           <Button>RT</Button>
//         </Tooltip>
//       </div>
//     );
//   }
// }

import React, { Component } from "react";
import { Tooltip } from "reactstrap";

export class Tooltips extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      tooltipOpen: false
    };
  }

  toggle() {
    this.setState({
      tooltipOpen: !this.state.tooltipOpen
    });
  }

  render() {
    return (
      <div>
        <p>Somewhere in here is a <a href="#" id="TooltipExample">tooltip</a>.</p>
        <Tooltip placement="right" isOpen={this.state.tooltipOpen} target="TooltipExample" toggle={this.toggle}>
          Hello world!
        </Tooltip>
      </div>
    );
  }
}