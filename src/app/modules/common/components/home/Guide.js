import React from "react";
import "./index.css";
import Component from "../Component";

export default class Duide extends Component {
  render() {
    return (
      <div className="main-guide">
        <this.Row>
          <this.Col md="12">
            <ul>
              <li>
                <this.Link to="#">
                  <span className="icon-settings"></span>
                </this.Link>
                <div className="grap-guide-title">1.SETTING UP</div>
              </li>
              <li>
                <this.Link to="#">
                  <span className="icon-settings"></span>
                </this.Link>
                <div className="grap-guide-title">1.SETTING UP</div>
              </li>
            </ul>
          </this.Col>
          {/* <this.Col md="2">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="2">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="2">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="2">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="2">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="1">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col>
          <this.Col md="1">
            <this.Link to="#">
              <span className="icon-settings"></span>
            </this.Link>
            <span className="icon-arrow-right arrow"></span><br/>   
            <div className="grap-guide-title">1.SETTING UP</div>
          </this.Col> */}
        </this.Row>
      </div>
    );
  }
}