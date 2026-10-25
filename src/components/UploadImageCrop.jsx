import React from "react";
import axios from "axios";
import { Button, Form, message, Modal, Upload } from "antd";
import {Translate} from "react-localize-redux";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

export class UploadImageCrop extends React.Component {
  state = {
    crop: null,
    fileList: [],
    visible: false,
    previewImage: "",
    previewVisible: false,
    cropFile: {},
    blobImg: null,
    uploading: false,
  };

  componentDidMount() {
    if (this.props.fileList && this.props.fileList[0]) {
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

  handleChange = async ({ file, fileList }) => {
    if (!fileList.length || (file && file.status === "removed")) return;

    const selectedFile = (file && fileList.find(item => item.uid === file.uid)) ||
      file || fileList[fileList.length - 1];
    if (selectedFile.type && !["image/jpeg", "image/png", "image/gif"].includes(selectedFile.type)) {
      message.error("Please choose a JPG, PNG or GIF image.");
      return;
    }
    try {
      const url = selectedFile.url || await this.getBase64(selectedFile.originFileObj || selectedFile);
      this.setState({
        visible: true,
        previewImage: url,
        cropFile: { ...selectedFile, name: selectedFile.name, type: selectedFile.type, url },
        crop: null,
        blobImg: null,
      });
    } catch (error) {
      message.error("Unable to read this image. Please choose another file.");
    }
  };

  handleImageLoad = (event) => {
    const { width, height } = event.currentTarget;
    if (!width || !height) return;
    const size = Math.min(width, height);
    const crop = {
      unit: "%",
      x: (width - size) / width * 50,
      y: (height - size) / height * 50,
      width: size / width * 100,
      height: size / height * 100,
    };
    this.setState({ crop }, () => this.generateCropImage(crop, this.state.cropFile));
  };

  handleCroppedImage = (crop) => {
    this.generateCropImage(crop, this.state.cropFile);
  };

  generateCropImage(crop, cropFile, maxSizeMB = 5) {
    const image = this.imageRef;
    const canvas = this.canvasPreviewRef;
    if (!crop || !cropFile || !canvas || !image || !image.naturalWidth ||
        !image.naturalHeight || !image.width || !image.height) {
      this.setState({ blobImg: null });
      return;
    }

    // Percent crops remain accurate if the modal changes size.
    const scaleX = crop.unit === "%" ? image.naturalWidth / 100 : image.naturalWidth / image.width;
    const scaleY = crop.unit === "%" ? image.naturalHeight / 100 : image.naturalHeight / image.height;
    const x = Math.max(0, crop.x * scaleX);
    const y = Math.max(0, crop.y * scaleY);
    const width = Math.min(crop.width * scaleX, image.naturalWidth - x);
    const height = Math.min(crop.height * scaleY, image.naturalHeight - y);
    if (![x, y, width, height].every(Number.isFinite) || width < 1 || height < 1) {
      this.setState({ blobImg: null });
      return;
    }

    try {
      // Export source pixels, independent of the screen's device pixel ratio.
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(image, x, y, width, height, 0, 0, canvas.width, canvas.height);
      const url = canvas.toDataURL("image/png");
      const blobImg = this.convertImageURLToBlob(url);
      if (blobImg.size > maxSizeMB * 1024 * 1024) {
        this.setState({ blobImg: null });
        message.error(`Cropped image exceeds ${maxSizeMB} MB. Please select a smaller area.`);
        return;
      }
      this.setState({ cropFile: { ...cropFile, url }, blobImg });
    } catch (error) {
      this.setState({ blobImg: null });
      message.error("Unable to crop this image. Please choose another file.");
    }
  }

  handleBeforeUpload = () => {
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
    const { cropFile, blobImg, uploading } = this.state;
    if (uploading || !cropFile || !blobImg) return;

    const formData = new FormData();
    // The canvas exports PNG, so the filename must match the encoded content.
    const filename = `${(cropFile.name || "image").replace(/\.[^.]+$/, "")}.png`;
    formData.append("file", blobImg, filename);
    this.setState({ uploading: true });
    try {
      const response = await axios.post(this.props.endPoint, formData, {
        headers: { Authorization: `Bearer ${this.props.accessToken}` },
      });
      const uploadedFile = {
        ...cropFile,
        name: response.data.filename || filename,
        status: "done",
        response: response.data,
      };
      this.props.form.setFieldsValue({
        [this.props.name]: { file: uploadedFile, fileList: [uploadedFile] },
      });
      this.setState({
        fileList: [uploadedFile],
        cropFile: {},
        blobImg: null,
        crop: null,
        visible: false,
      });
      if (this.props.responseAfterUpload) this.props.responseAfterUpload(response);
    } catch (error) {
      message.error("Unable to upload the image. Please try again.");
    } finally {
      this.setState({ uploading: false });
    }
  };

  handlePreviewImage = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await this.getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  }

  handleRemove = async (file) => {
    try {
      await axios({
        method: "DELETE",
        url: `${this.props.endPointDelete}/${encodeURIComponent(file.name)}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.props.accessToken}`,
        },
      });
      this.setState({ fileList: [] });
      this.props.form.setFieldsValue({ [this.props.name]: null });
    } catch (error) {
      message.error("Unable to delete the image. Please try again.");
    }
    // Removal is managed here; do not reopen the crop dialog via Upload.onChange.
    return false;
  };

  handleCancel = () => {
    if (this.state.uploading) return;
    const file = this.state.fileList[0];
    this.props.form.setFieldsValue({
      [this.props.name]: file ? { file, fileList: this.state.fileList } : null,
    });
    this.setState({ cropFile: {}, blobImg: null, visible: false, crop: null });
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
              accept="image/jpeg,image/png,image/gif"
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
            disabled={this.state.uploading}
            onChange={(crop, percentCrop) => this.setState({ crop: percentCrop, blobImg: null })}
            onComplete={this.handleCroppedImage}
            style={{ width: "100%" }}
          >
            <img
              key={this.state.cropFile.uid}
              style={{ width: "100%" }}
              src={this.state.previewImage}
              ref={(ref) => (this.imageRef = ref)}
              onLoad={this.handleImageLoad}
              onError={() => {
                this.setState({ blobImg: null });
                message.error("Unable to load this image. Please choose another file.");
              }}
              alt="cropped"
            />
          </ReactCrop>

          {this.state.cropFile && (
            <canvas
              ref={(ref) => (this.canvasPreviewRef = ref)}
              style={{ display: "none" }}
            />
          )}

          <div className="ant-modal-footer">
            <Button className="danger" disabled={this.state.uploading} onClick={this.handleCancel}>
              <Translate id="text_cancel" />
            </Button>
            <Button
              htmlType="button"
              disabled={!this.state.blobImg || this.state.uploading}
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
