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
      cardImgList: null,
      fileList: []
    };
    this.handleCardChange = this.handleCardChange.bind(this);
    this.initializeImage = this.initializeImage.bind(this);
  }

  initializeImage(status) {
    if (status === "success") {
      this.setState({
        fileList: this.props.fileList,
        cardImgList: this.props.fileList[0].name
      });
    } else if (status === "error") {
      this.setState({
        fileList: [],
        cardImgList: null
      });
    }
  }

  componentDidMount() {
    if (this.props.fileList.length > 0) {
      this.validImage(this.props.fileList[0].url, this.initializeImage);
    }
  }

  validImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false, timer;
    var img = new Image();
    img.onerror = img.onabort = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("error");
      }
    };
    img.onload = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("success");
      }
    };
    img.src = url;
    timer = setTimeout(() => {
      timedOut = true;
      callback("timeout");
    }, timeout); 
  }

  handleCardChange(fileList){
    if (!this.state.isRemoveImage) {
      let formData = new FormData();
      formData.append("image", fileList.file);
      axios.post(this.props.endPoint, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${this.props.accessToken}`
        }
      })
        .then((response) => {
          this.setState({
            cardImgList: response.data.key,
            fileList: [{
              uid: "-1",
              name: fileList.file.name,
              url: response.data.location
            }]
          });
        })
        .catch((error) => {
          
        });
    } else {
      this.setState({
        isRemoveImage: false,
        cardImgList: "image"
      });
    }
  }

  render() {
    const cardImgProps = {
      action: this.props.endPoint,
      
      onRemove: (file) => {
        axios({
          method: "DELETE",
          url: this.props.endPointDelete,
          data: {fileName: file.name} ,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.props.accessToken}`
          }})
          .then((response) => {
            this.setState({
              cardImgList: null,
              isRemoveImage: false
            });
            this.props.form.setFieldsValue({[this.props.name]: null});
          })
          .catch((error) => {
            
          });
        this.setState({
          isRemoveImage: true,
          fileList: []
        });
      },
      beforeUpload: (file) => {
        return false;
      },
      fileList: this.state.fileList,
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
                {cardImgList ? null : uploadButton}
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
  fileList: []
};