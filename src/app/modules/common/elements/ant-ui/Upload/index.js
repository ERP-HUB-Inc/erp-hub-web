import React from "react";
import PicturesUpload from "./upload";
import Element from "../../common/Element";

export class UploadImg extends Element {

  render() {
    return (
      <PicturesUpload 
        name={ this.props.name }
        form={this.props.form}
        label={ this.props.label }
      />
    );
  }   
}

