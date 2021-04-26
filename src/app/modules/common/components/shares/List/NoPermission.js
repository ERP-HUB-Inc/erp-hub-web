import React from "react";
import Component from "../../Component";

export default class NoPermission extends Component {
  render() {
    return (
      <div id="wrap-no-permission">
        <div>
          <img style={{width: "120px"}} src={`${this.Util.getGeneralImage("storeVein/no-permission.svg").url}`} alt="" />
          <h2>
            <this.Translate id="text_no_permission_title" />
          </h2>
          <p>
            <this.Translate id="text_no_permission_detail" />
          </p>
        </div>
      </div>
    );
  }
}