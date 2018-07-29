import React from "react";
import ReactDOM from "react-dom";
// import "antd/dist/antd.css";
// import "./index.css";
import { Upload, Icon, Modal } from "antd";

class PicturesUpload extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      previewImage: "",
      fileList: [
        {
          uid: -1,
          name: "xxx.png",
          status: "done",
          url:
            "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
        }
      ]
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
    this.setState({ fileList });
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
        <label>{ this.props.label }</label>
        <Upload
          action="//jsonplaceholder.typicode.com/posts/"
          listType="picture-card"
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          showUploadList={true}
          {...input}
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
      </div>
    );
  }
}

export default PicturesUpload;
