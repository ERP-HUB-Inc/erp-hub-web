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
    this._isMounted = false;
    this.state = {
      cardPreviewImage: "",
      isRemoveImage: false,
      cardPreviewVisible: false,
      cardImgList: null,
      fileList: []
    };
  }

  initializeImage = (status) => {
    if (this._isMounted) {
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
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.fileList.length > 0) {
      this.validImage(this.props.fileList[0].url, this.initializeImage);
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
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

  handleCardChange = ({fileList, file}) => {
    if (!this.state.isRemoveImage) {
      this.setState({
        cardImgList: file.name,
        fileList
      });
      let formData = new FormData();
      formData.append("image", file);
      axios.post(this.props.endPoint, formData, {
        headers: {
          "content-type": "multipart/form-data",
          "Authorization": `Bearer ${this.props.accessToken}`
        }
      }).then(this.props.responseAfterUpload);
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
            this.props.responseAfterUpload(response);
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
      // accept: "image/*",
      listType: "picture-card",
      className: this.props.className
    };

    const {
      cardImgList,
      cardPreviewVisible,
      cardPreviewImage
    } = this.state;
    const { getFieldDecorator } = this.props.form;
    
    return <div className="clearfix main-upload">
        <this.FormItem label={this.props.label} className="wrap-upload">
          {
            getFieldDecorator(this.props.name, { rules: this.props.rules, initialValue: this.props.data } )(
              <Upload {...cardImgProps}>
                {cardImgList ? null : this.props.customerButtonUpload ? this.props.customerButtonUpload : uploadButton}
              </Upload>
            )
          }
          <Modal visible={cardPreviewVisible} footer={null}>
            <img alt="example" style={{ width: "100%" }} src={cardPreviewImage} />
          </Modal>
        </this.FormItem>
      </div>;
  }
}

PicturesUpload.defaultProps = {
  fileList: []
};