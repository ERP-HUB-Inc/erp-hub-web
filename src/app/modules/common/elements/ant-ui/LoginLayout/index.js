import React from "react";
import { Col,Row } from "reactstrap";
import "./main.css";

export class LoginLayout extends React.Component {
  render() {
    const { clasBlogLogo,classBlogLogin } = this.props;
    return (
      <Row>
        <Col className={ classBlogLogin }>
          <Col className="clear-padding wrap-client-login">
            <div className={ clasBlogLogo }>
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
        </Col>
      </Row>
    );
  }

}

LoginLayout.defaultProps = {
  clasBlogLogo: "wrap-blog-logo",
  classBlogLogin: "clear-padding wrap-client-login"
};

