import React from "react";
import Component from "../Component";
import {Button} from "../../elements/ant-ui/Button";
import {Util} from "../../util";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
    this.Util = new Util();
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true
    });
  }
  
  render() {
    if (this.state.hasError) {
      return <div style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#6351BF",
          padding: 30
        }}>
          <div style={{
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }}>
            <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
            <img src={this.Util.getImageFromSpace("storeVein/error-system.png")} alt="storeVein" style={{ marginBottom: 20, width: 250 }} />
            </div>
            <div style={{
              textAlign: "center",
              fontSize: "40pt",
              color: "white",
              textTransform: "uppercase",
              marginBottom: 15
          }}>
            <this.Translate id="text_sorry" />!!!
          </div>
          <h3 style={{ color: "white" }}><this.Translate id="text_sorry_server_has_issue" /></h3>

          <div style={{ color: "white", marginTop: 25, marginBottom: 10 }}><this.Translate id="text_try"/>:</div>
            <ol style={{color: "white"}}>
              <li><this.Translate id="text_please_try_refresh_page" /></li>
              <li><this.Translate id="text_please_contact_us" /></li>
            </ol>
          <Button style={{ backgroundColor: "#FFD627", marginTop: 30 }} onClick={() => window.location.reload(true)}><this.Translate id="text_reload" /></Button>
          </div>
        </div>;
    }
    // Normally, just render children
    return this.props.children;
  }  
}