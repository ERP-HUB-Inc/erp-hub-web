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
        label={this.props.label}
        rules={this.rules}
        data={this.props.data}
        fileList={this.props.fileList}
        endPoint={this.props.endPoint}
        endPointDelete={this.props.endPointDelete}
        accessToken={this.props.accessToken}
        beforeUpload={this.props.beforeUpload}
        handleCardChange={this.handleCardChange}
      />
    );
  }   
}


