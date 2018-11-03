import React from "react";
import Component from "../Component";
import "./index.css";

export default class ParentLayout extends Component {
  render() {
    return (
      <this.Row>
        <this.Col sm="12" className={this.props.classBlogLogin}>
          <this.Col sm="12" className="clear-padding inner-client-login">
            <div className={this.props.clasBlogLogo}>
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
              {/* <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div> */}
              <div className="header text-right">
                <div className="title"><strong>store</strong>Vein</div>
                <div className="back-office">Backoffice</div>
              </div>
              { this.props.children }
            </div>
          </this.Col>
        </this.Col>
      </this.Row>
    );
  }

}

ParentLayout.defaultProps = {
  clasBlogLogo: "wrap-blog-logo",
  classBlogLogin: "clear-padding wrap-client-login"
};

