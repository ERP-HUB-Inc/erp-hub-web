import React from "react";
import axios from "axios";
import {Translate} from "react-localize-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import {
  Button,
  Form,
  Modal,
  Upload
} from "antd";

export class UploadImageCrop extends React.Component {
  state = {
    crop: {},
    fileList: [],
    visible: false,
    previewImage: "",
    cropFile: {},
    blobImg: null,
    uploading: false
  }

  initializeImage = (status) => {
    if (status === "success") {
      this.setState({
        fileList: this.props.fileList,
      });
    } else if (status === "error") {
      this.setState({
        fileList: [],
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

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  handleChange = async ({fileList}) => {
    if (fileList.length) {
      let file = fileList[0];
      if (!file.url) {
        file.url = await this.getBase64(file.originFileObj);
      }
      this.setState({
        visible: true,
        previewImage: file.url,
        cropFile: file
      });
    }
  }

  handleCroppedImage = async (c) => {
    const cropFile = JSON.parse(JSON.stringify(this.state.cropFile));
    const TO_RADIANS = Math.PI / 180;
    const image = this.imageRef;
    const canvas = this.canvasPreviewRef;
    const scale = 1;
    const rotate = 0;
    const ctx = canvas.getContext("2d");
    if (!ctx || !c.width) {
      return;
    }

    const scaleX = image.naturalHeight / image.width;
    const scaleY = image.naturalHeight / image.height;
    const pixelRatio = window.devicePixelRatio;
    canvas.width = Math.floor(c.width * scaleX * pixelRatio);
    canvas.height = Math.floor(c.height * scaleY * pixelRatio);
  
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";
    const cropX = c.x * scaleX;
    const cropY = c.y * scaleY;
  
    const rotateRads = rotate * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;
    
    ctx.save();
    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    ctx.rotate(rotateRads);
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight, 0, 0, image.naturalWidth, image.naturalHeight);
    cropFile.url = canvas.toDataURL();
    const blobImg = this.canvasImageURLToBlob(cropFile.url);
    this.setState({cropFile, blobImg});
  }

  handleBeforeUpload = (file) => {
    return false;
  }

  canvasImageURLToBlob(dataURL) {
    let arr = dataURL.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let bstrLen = bstr.length;
    let u8arr = new Uint8Array(bstrLen);
    while(bstrLen--) {
      u8arr[bstrLen] = bstr.charCodeAt(bstrLen);
    }

    return new Blob([u8arr], {type: mime});
  }

  handleUpload = (e) => {
    e.preventDefault();
    if (!this.state.blobImg) {
      return;
    }
    const file = this.state.cropFile;
    const formData = new FormData();
    formData.append("image", this.state.blobImg, file.name);
    this.setState({uploading: true});
    axios.post(this.props.endPoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${this.props.accessToken}`
      }
    })
    .then(this.props.responseAfterUpload)
    .catch(err => {
      console.log("error", err);
      if (err && err.response && err.response.data) {
        file.status = "error";
      }
    })
    .finally(() => {
      this.setState({
        fileList: [file],
        visible: false,
        uploading: false
      });
    });
  }

  handleRemove = (file) => {
    this.setState({
      fileList: []
    });
    axios({
      method: "DELETE",
      url: this.props.endPointDelete,
      data: {fileName: file.name},
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.props.accessToken}`
      }
    })
    .then(response => {
      this.setState({fileList: []});
      this.props.form.setFieldsValue({[this.props.name]: null});
    });
  }

  handleCancel = () => {
    this.setState({
      cropFile: {}, 
      visible: false, 
      crop: {}
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
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

    return (<div className="clearfix main-upload">
      <Form.Item className="wrap-upload" label={this.props.label}>
        {getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.data})(
          <Upload
            action={this.props.endPoint}
            listType="picture-card"
            fileList={this.state.fileList}
            onChange={this.handleChange}
            onRemove={this.handleRemove}
            beforeUpload={this.handleBeforeUpload}
          >
            {this.state.fileList.length ? null : this.props.customerButtonUpload ? this.props.customerButtonUpload : uploadButton}
          </Upload>
        )}
      </Form.Item>

      <Modal 
        title={<Translate id="text_crop_image" />}
        visible={this.state.visible}
        className="ant-modal-crop-image"
        footer={null}
        onCancel={this.handleCancel}
      >
        <ReactCrop 
          crop={this.state.crop} 
          onChange={crop => this.setState({crop})} 
          onComplete={this.handleCroppedImage} 
          style={{width: "100%"}}
        >
          <img style={{width: "100%"}} src={this.state.previewImage} ref={ref => this.imageRef = ref} alt="cropped" />
        </ReactCrop>

        {this.state.cropFile && 
          <canvas ref={ref => this.canvasPreviewRef = ref} style={{display: "none"}} />
        }

        <div className="ant-modal-footer">
          <Button className="danger" onClick={this.handleCancel}>
            <Translate id="text_cancel" />
          </Button>  
          <Button htmlType="submit" loading={this.state.uploading} className="info" onClick={this.handleUpload}>
            <span id="btnModalSave">{this.state.uploading ? "Uploading..." : <Translate id="text_ok" />}</span>
          </Button>
        </div>
      </Modal>
    </div>);
  }
}