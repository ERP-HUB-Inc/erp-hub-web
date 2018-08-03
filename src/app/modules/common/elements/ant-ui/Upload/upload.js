import React from "react";
import Element, { Form } from "../../common/Element";
import "./index.css";
import { Upload, Icon, Modal } from "antd";

export default class PicturesUpload extends Element {

  constructor(props){
    super(props);
    this.state = {
      previewImage: "",
      fileList: [],
      upload: false
    };
  }

  handleCancel () {
    this.setState({ previewVisible: false });
  }

  handlePreview(file){
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: false
    });
  }

  handleChange({ fileList }) {
    // alert(fileList);
    // this.setState({ fileList });
  }

  render() {
    const { input } = this.props;
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <span className="icon-upload"></span>
        <div className="ant-upload-text">
          <div className="upload-extension-title">. JPG  . PNG . GIF</div>
          <div className="upload-file-title">
            You can also upload files by <br/>
            <span>clicking here </span>
          </div>
        </div>
      </div>
    );
    return (
      <div className="clearfix main-upload">
        <this.FormItem label={this.props.label}>
          <Upload
            action="//jsonplaceholder.typicode.com/posts/"
            listType="picture-card"
            onPreview={this.handlePreview}
            onChange={this.handleChange}
            showUploadList={true}
          >
            {fileList.length >= 3 ? null : uploadButton}
          </Upload>
          <Modal
            visible={previewVisible}
            footer={null}
            onCancel={this.handleCancel}
          >
            <img alt="example" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </this.FormItem>
      </div>
    );
  }
}

