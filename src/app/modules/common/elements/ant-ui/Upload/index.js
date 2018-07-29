import React from "react";
import PicturesUpload from "./upload";
import Element from "../../common/Element";
// import "./index.css";

export class UploadImg extends Element {

  render() {
    return (
      <this.Field 
        name={this.props.name}
        type="file"
        // placeholder={this.props.placeholder}
        component={ PicturesUpload }
        label={this.props.label}
        data={this.props.data}
        // required = {this.props.required}
      />
    );
  }   
}

