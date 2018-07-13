
import React, { Component } from "react";
import { Collapse } from "antd";
import "./index.css"; 
const Panel = Collapse.Panel;

export class ListCollapse extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Collapse accordion >
        { this.props.children }
      </Collapse>
    );
  }
}


export class ListPanels extends Component {
  render(){
    return(
      <Collapse accordion >
        <Panel header="This is panel header 2" key="3">
          ddd
        </Panel>
      </Collapse>
    );
  }
}

