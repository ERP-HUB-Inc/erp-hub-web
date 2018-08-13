import React from "react";
import Element from "../../common/Element";

export class Loading extends Element {
  render () {
    const antIcon = <this.Icon type="loading" style={{ fontSize: 40 }} spin />;
    return (
      <this.Spin indicator={antIcon} />
    );
  }
}