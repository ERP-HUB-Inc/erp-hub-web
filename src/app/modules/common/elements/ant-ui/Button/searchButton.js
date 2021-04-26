import React,{ Component } from "react";
import "./index.css";
import { Button } from "antd";

export class SearchButton extends Component {
  render() {
    return (
      <div className="main-search-button">
        <Button htmlType="submit" loading={false} className={ `info ${this.props.className}` }>
          {/* <span className="icon-save icon-padding-right"></span>Save */}
          <span className="icon-search icon-padding-right"></span>
        </Button>
      </div>
    );
  }
}
