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
      cardPreviewVisible: false,
      cardImgList: [],
    };
    this.handleCardChange = this.handleCardChange.bind(this); 
  }

  handleCardChange({fileList}){
    alert("handle change");
    this.setState({ cardImgList: fileList });
    const handleCardChange =handleCardChange;
    handleCardChange && handleCardChange({fileList});

    let formData = new FormData();
    axios.post("http://178.128.217.131:3000/api/employee/v1/upload/file", formData,{
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwMDAwMDAwMS0wMDAxLTIwMTgtMDAwMS0wMDAwMDAwMSIsImlhdCI6MTUzNDI5Njk2M30.pmMNo0pASQmlYjwTn2NPDgBTTTUlXjUamYctOH89DAw"
      }
    })
      .then(function (response) {
        console.log("response",response);
      })
      .catch(function (error) {
        alert(error);
      });

  }

  render() {
    
    const cardImgProps = {

      action: "http://178.128.217.131:3000/api/employee/v1/upload/file",
      
      onRemove: (file) => {

        alert("dd");

        this.setState(({ cardImgList }) => {
          const index = cardImgList.indexOf(file);
          const newFileList = cardImgList.slice();
          newFileList.splice(index, 1);
          return {
            cardImgList: newFileList,
          };
        });
      },
      beforeUpload: (file) => {
        alert("dd");
        this.setState(({ cardImgList }) => ({
          cardImgList: [...cardImgList, file],
        }));
        return false;
      },
      fileList: this.state.cardImgList,
      onPreview: this.handleCardPreview,
      onChange: this.handleCardChange,
      accept: "image/*",
      listType: "picture-card"
    };

    const {cardImgList, cardPreviewVisible, cardPreviewImage} = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <div className="clearfix main-upload">
       
        <this.FormItem label={this.props.label}>
          {
            getFieldDecorator(this.props.name, { rules: this.props.rules } )(
              <Upload {...cardImgProps}>
                {cardImgList.length >= this.props.length ? null : uploadButton}
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