import React,{ Component } from "react";
import { Button } from "antd";

export class saveButton extends Component {
  render() {
    return (
      <Button htmlType="submit" loading={false} className={ `info ${this.props.className}` }>
        <span className="icon-save icon-padding-right"></span>Save
      </Button>
    );
  }
}
