import React from "react";
import PicturesUpload from "./upload";
import Element from "../../common/Element";

export class UploadImg extends Element {

  constructor(props){
    super(props);
    this.rules = [
      {
        required : this.props.required,
        message: this.props.errorRequired
      }
    ];

  }

  render() {
    return (
      <PicturesUpload 
        name={ this.props.name }
        form={this.props.form}
        label={ this.props.label }
        rules={ this.rules }
        beforeUpload={ this.props.beforeUpload }
      />
    );
  }   
}


