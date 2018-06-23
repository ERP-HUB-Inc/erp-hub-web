import React from "react";
import Component from "../../Component";
import { Layout } from "antd";
const { Footer } = Layout;

export default class Footers extends Component {
  render() {
    return (
      <div>
        {/* <this.Translate id="text_contact_us"/> */}
        <Footer style={{ textAlign: "center" }}>
            Ca Design ©2018 Created by CA
        </Footer>
      </div>
    );
  }
}