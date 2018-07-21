import React from "react";
import { Col,Row } from "reactstrap";
import "./index.css";

export class LoginLayout extends React.Component {
  render() {
    return (
      <Row>
        <Col className="clear-padding wrap-client-login">
          <div className="wrap-blog-logo">
            <div className="blog-logo text-center">
              <div className="inner-logo">
                <div className="logo">
                  <span className="icon-logo"></span>
                </div>
                <div className="text">
                  <strong>store</strong>Vein
                </div>
              </div>
            </div>
          </div>
          <div className="blog-login">
            <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div>
            <div className="header text-right">
              <div className="title"><strong>store</strong>Vein</div>
              <div className="back-office">Backoffice</div>
            </div>
            { this.props.children }
          </div>
        </Col>
      </Row>
    );
  }

}
