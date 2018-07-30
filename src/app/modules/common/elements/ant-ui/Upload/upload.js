import React from "react";
import Element, { Form } from "../../common/Element";
import { Upload, Icon, Modal } from "antd";

export default class PicturesUpload extends Element {

  constructor(props){
    super(props);
    this.state = {
      previewImage: "",
      fileList: []
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
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
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

