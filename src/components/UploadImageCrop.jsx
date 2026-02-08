import React from "react";
import axios from "axios";
import { Button, Form, Modal, Upload } from "antd";
import {Translate} from "react-localize-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export class UploadImageCrop extends React.Component {
  state = {
    crop: {},
    fileList: [],
    visible: false,
    previewImage: "",
    previewVisible: false,
    cropFile: {},
    blobImg: null,
    uploading: false,
  };
  defaultCrop = { unit: "px", x: 20, y: 20, width: 500, height: 500 };

  componentDidMount() {
    this.setState({ crop: this.defaultCrop });
    if (this.props.fileList.length > 0) {
      this.validImage(this.props.fileList[0].url, this.initializeImage);
    }
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
  };

  validImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false,
      timer;
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
      reader.onerror = (error) => reject(error);
    });
  }

  handleChange = async ({ fileList }) => {
    if (fileList.length) {
      let file = fileList[0];
      if (!file.url) {
        file.url = await this.getBase64(file.originFileObj);
      }
      this.setState(
        {
          visible: true,
          previewImage: file.url,
          cropFile: file,
        },
        () => {
          setTimeout(() => {
            this.generateCropImage(this.state.crop, file);
          }, 1000);
        }
      );
    }
  };

  handleCroppedImage = async (c) => {
    const cropFile = JSON.parse(JSON.stringify(this.state.cropFile));
    this.generateCropImage(c, cropFile);
  };

  generateCropImage(c, cropFile, maxSizeMB = 5) {
    const TO_RADIANS = Math.PI / 180;
    const image = this.imageRef;
    const canvas = this.canvasPreviewRef;
    const scale = 1;
    const rotate = 0;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const scaleX = image.naturalWidth / image.width;
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
    ctx.translate(-cropX, -cropY);
    ctx.translate(centerX, centerY);
    ctx.rotate(rotateRads);
    ctx.scale(scale, scale);
    ctx.translate(-centerX, -centerY);

    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight
    );

    // Convert to Base64 and then Blob
    cropFile.url = canvas.toDataURL();
    const blobImg = this.convertImageURLToBlob(cropFile.url);

    // ✅ Check size in MB
    const sizeMB = blobImg.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      console.warn(
        `Cropped image is too large: ${sizeMB.toFixed(
          2
        )} MB. Maximum allowed: ${maxSizeMB} MB`
      );
      // Optional: clear blob and prevent upload
      this.setState({ cropFile: null, blobImg: null });
      return;
    }

    // Save to state if size is ok
    this.setState({ cropFile, blobImg });
  }

  handleBeforeUpload = (file) => {
    return false;
  };

  convertImageURLToBlob(dataURL) {
    let arr = dataURL.split(",");
    let mime = arr[0].match(/:(.*?);/)[1];
    let bstr = atob(arr[1]);
    let bstrLen = bstr.length;
    let u8arr = new Uint8Array(bstrLen);
    while (bstrLen--) {
      u8arr[bstrLen] = bstr.charCodeAt(bstrLen);
    }

    return new Blob([u8arr], { type: mime });
  }

  handleUpload = async (e) => {
    e.preventDefault();
    const { cropFile, blobImg } = this.state;

    if (!cropFile || !cropFile.url) {
      console.error("No image selected");
      return;
    }

    // 2. Wrap into File
    const file = new File(
      [this.state.blobImg],
      this.state.cropFile.name || "image.png",
      {
        type: this.state.blobImg.type || "image/png",
      }
    );

    // 3. Append to FormData
    const formData = new FormData();
    formData.append("file", file);

    // Debug FormData
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    try {
      const response = await axios.post(this.props.endPoint, formData);
      // this.props.responseAfterUpload(response);
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        fileList: [this.state.cropFile],
        crop: this.defaultCrop,
        visible: false,
        uploading: false,
      });
    }
  }

  handlePreviewImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  }

  handleRemove = (file) => {
    this.setState({
      fileList: [],
    });
    axios({
      method: "DELETE",
      url: `${this.props.endPointDelete}/${file.name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.props.accessToken}`,
      },
    }).then((response) => {
      this.setState({ fileList: [] });
      this.props.form.setFieldsValue({ [this.props.name]: null });
    });
  };

  handleCancel = () => {
    this.setState({
      cropFile: {},
      visible: false,
      crop: this.defaultCrop,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const uploadButton = (
      <div>
        <span className="icon-upload"></span>
        <div className="ant-upload-text">
          <div className="upload-extension-title">. JPG . PNG . GIF</div>
          <div className="upload-file-title">
            Click or drag file to this area to upload <br />
            <span>clicking here </span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="clearfix main-upload">
        <Form.Item className="wrap-upload" label={this.props.label}>
          {getFieldDecorator(this.props.name, {
            rules: this.props.rules,
            initialValue: this.props.data,
          })(
            <Upload
              action={this.props.endPoint}
              listType="picture-card"
              className="upload-image-with-crop"
              fileList={this.state.fileList}
              onChange={this.handleChange}
              onRemove={this.handleRemove}
              onPreview={this.handlePreviewImage}
              beforeUpload={this.handleBeforeUpload}
            >
              {this.state.fileList.length
                ? null
                : this.props.customerButtonUpload
                ? this.props.customerButtonUpload
                : uploadButton}
            </Upload>
          )}
        </Form.Item>
        <Modal
          title="Preview Image"
          visible={this.state.previewVisible}
          footer={null}
          className="ant-modal-crop-image"
          onCancel={() => this.setState({ previewVisible: false })}
        >
          <img
            alt="preview"
            style={{ width: "100%", marginBottom: 24 }}
            src={this.state.previewImage}
          />
        </Modal>
        <Modal
          title={<Translate id="text_crop_image" />}
          visible={this.state.visible}
          className="ant-modal-crop-image"
          footer={null}
          onCancel={this.handleCancel}
        >
          <ReactCrop
            crop={this.state.crop}
            aspect={1}
            keepSelection={true}
            locked={true}
            onChange={(crop) => this.setState({ crop })}
            onComplete={this.handleCroppedImage}
            style={{ width: "100%" }}
          >
            <img
              style={{ width: "100%" }}
              src={this.state.previewImage}
              ref={(ref) => (this.imageRef = ref)}
              alt="cropped"
            />
          </ReactCrop>

          {this.state.cropFile && (
            <canvas
              ref={(ref) => (this.canvasPreviewRef = ref)}
              style={{
                width: this.state.crop.width,
                height: this.state.crop.height,
                objectFit: "contain",
                display: "none",
              }}
            />
          )}

          <div className="ant-modal-footer">
            <Button className="danger" onClick={this.handleCancel}>
              <Translate id="text_cancel" />
            </Button>
            <Button
              htmlType="submit"
              loading={this.state.uploading}
              className="info"
              onClick={this.handleUpload}
            >
              <span id="btnModalSave">
                {this.state.uploading ? (
                  "Uploading..."
                ) : (
                  <Translate id="text_ok" />
                )}
              </span>
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}