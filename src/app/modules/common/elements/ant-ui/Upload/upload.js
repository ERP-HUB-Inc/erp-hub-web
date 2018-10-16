import React from "react";
import Element from "../../common/Element";
import "./index.css";
import { Upload, Modal } from "antd";
import axios from "axios";

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

export default class PicturesUpload extends Element {

  constructor(props){
    super(props);
    this.state = {
      cardPreviewImage: "",
      isRemoveImage: false,
      cardPreviewVisible: false,
      cardImgList: [],
    };
    this.handleCardChange = this.handleCardChange.bind(this); 
  }

  handleCardChange(fileList){
    if (!this.state.isRemoveImage) {
      const cardImgList = this.state.cardImgList;
      cardImgList.push(fileList.file);
      this.setState({cardImgList});
      let formData = new FormData();
      formData.append("image", fileList.file);
      axios.post(this.props.endPoint, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${this.props.accessToken}`
        }
      })
        .then(function (response) {
          console.log("Upload Response:", response);
        })
        .catch(function (error) {
          // alert(error);
        });
    } else {
      this.setState({isRemoveImage: false});
    }
  }

  render() {
    const cardImgProps = {
      action: "http://127.0.0.1:3000/api/employee/v1/upload/file",
      
      onRemove: (file) => {
        this.setState({
          cardImgList: [],
          isRemoveImage: true
        });
      },
      beforeUpload: (file) => {
        this.setState(({ cardImgList }) => ({
          cardImgList: [...cardImgList, file],
        }));
        return false;
      },
      // showUploadList: false,
      defaultFileList: this.props.fileList,
      onPreview: this.handleCardPreview,
      onChange: this.handleCardChange,
      accept: "image/*",
      listType: "picture-card"
    };

    const {cardImgList, cardPreviewVisible, cardPreviewImage} = this.state;
    const { getFieldDecorator } = this.props.form;
    
    return (
      <div className="clearfix main-upload">
        <this.FormItem label={this.props.label} className="wrap-upload">
          {
            getFieldDecorator(this.props.name, { rules: this.props.rules } )(
              <Upload {...cardImgProps}>
                {cardImgList.length > 0 ? null : uploadButton}
              </Upload>
            )
          }
          <Modal visible={cardPreviewVisible} footer={null}>
            <img alt="example" style={{ width: "100%" }} src={cardPreviewImage} />
          </Modal>
        </this.FormItem>
      </div>
    );
  }
}

PicturesUpload.defaultProps = { 
  length : 1
};