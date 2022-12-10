import React from "react";
import {
  Form,
  PageHeader,
  Upload,
  Icon,
  Button,
  Tabs,
  message,
  Row,
  Col,
  Modal
} from "antd";
import { Translate } from "react-localize-redux";
import axios from "axios";
import history from "../../../../common/router/history";
import Util from "../../../../common/util";
import Enums from "../../../../common/enums";

const { Dragger } = Upload;
const { TabPane } = Tabs;

export default function ProductImport() {
  const [fileList, setFileList] = React.useState([]);
  const [uploading, setUploading] = React.useState(false);
  const [responseError, setReponseError] = React.useState(null);
  const [showError, setShowError] = React.useState(false);

  const clientId = (new Util()).getClientId();

  const handleUpload = () => {
    if (!fileList.length) {
      return Modal.warning({
        title: "Please upload file for import",
        className: "sv-modal-confirm"
      });
    }

    const formData = new FormData();
    fileList.forEach(file => {
      formData.append("csv", file);
    });
    
    setUploading(true);
    setShowError(false);
    setReponseError(null);

    axios({
      method: "POST",
      url: `${generateAPIUrl()}/inventory/product/v1/import?clientId=${clientId}`,
      headers: {
        "content-type": "multipart/form-data",
        "Authorization": `Bearer ${(new Util()).getAccessToken()}`
      },
      data: formData
    })
    .then(() => {
      Modal.confirm({
        title: "Continue uplaod ?",
        okText: "Yes",
        cancelText: "Return to list",
        className:"sv-modal-confirm",
        onOk: () => {
          setFileList([]);
          setReponseError(null);
        },
        onCancel: () => {
          history.push({pathname: "/products/list" });
        }
      });
    })
    .catch(err => {
      const error = err.response && err.response.data && err.response.data.error;
      let errorMessage = "";
      if (error.code === Enums.RECORD_EXIST) {
        errorMessage = "Duplicate barcode or existing product";
      }
      message.error(errorMessage);
      setReponseError(err.response && err.response.data && err.response.data.error);
    })
    .finally(() => setUploading(false));
  };

  const onViewLog = () => {
    setShowError(!showError);
  };

  const generateAPIUrl = () => {
    let host = process.env.REACT_APP_API_HOST;
    let port = process.env.REACT_APP_API_PROD_PORT;
    if (process.env.REACT_APP_ENV === "DEV") {
      host = process.env.REACT_APP_API_DEV_HOST;
      port = process.env.REACT_APP_API_PORT;
    } else if (process.env.REACT_APP_ENV === "PRE_PROD") {
      port = process.env.REACT_APP_API_PRE_PROD_PORT;
    }

    const rootPath = process.env.REACT_APP_API_ROOT;
    const url = `${host}:${port}/${rootPath}`;
    return url;
  };

  function renderErrorContent() {
    const existProducts = responseError.message.existProducts;
    const dupProduct = responseError.message.duplicateProducts;
    return (
      <Tabs defaultActiveKey="1" tabPosition="left" style={{ marginBottom: 15 }} className="sv-tabs">
        <TabPane tab="Exist products" key="1">
          <table style={{ width: "85%", lineHeight: "26px" }}>
            <thead>
              <tr>
                <th><Translate id="text_barcode" /></th>
                <th><Translate id="text_name" /></th>
              </tr>
            </thead>
            <tbody>
              {
                existProducts.length ?
                  existProducts.map((product, index) =>
                    <tr key={index}>
                      <td style={{width: 200}}>{product.barcode}</td>
                      <td>{product.name}</td>
                    </tr>
                  )
                  : null
              }
            </tbody>
          </table>
        </TabPane>
        <TabPane tab="Duplicate products" key="2">
          <table style={{ width: "85%", lineHeight: "26px" }}>
            <thead>
              <tr>
                <th style={{width: 200}}><Translate id="text_barcode" /></th>
                <th><Translate id="text_name" /></th>
              </tr>
            </thead>
            <tbody>
              {
                dupProduct.length ?
                  dupProduct.map((product, index) =>
                    <tr key={index}>
                      <td>{product.barcode}</td>
                      <td>{product.name}</td>
                    </tr>
                  )
                  : null
              }
            </tbody>
          </table>
        </TabPane>
      </Tabs>
    );
  }

  const draggerProps = {
    name: "csv",
    multiple: false,
    accept: [".csv", ".xlsx", ".xls"],
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      const acceptFiles = ["xlsx", "csv", "xls"];
      let fileType = "";

      if (file) {
        fileType = file.name;
        fileType = fileType.split(".");
        fileType = fileType[fileType.length - 1];

        if (!(acceptFiles.includes(fileType))) {
          return Modal.error({
            title: "Invalid file type",
            className: "sv-modal-confirm"
          });
        }
      }
      
      setFileList([file]);
      return false;
    },
    fileList
  };

  return (
    <div style={{ marginBottom: 25}}>
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
          position: "relative"
        }}
        onBack={() => history.goBack()}
        title={<Translate id="text_product" />}
        subTitle={<Translate id="text_import" />}
        extra={[
          <div>
            <a href={"/product_import_template.xlsx"} className="ant-btn" download={"Product Import Template.xlsx"}>
              <Icon type="download" /> <Translate id="text_download_template" />
            </a>
          </div>
        ]} />
      
      <Row>
        <Col md={8}>
          <Form >
            <div style={{fontSize: 18, fontWeight: 600, color: "#093163", marginBottom: 10}}>Attach Document </div>
            <div style={{ height: 306 }}>
              <Dragger {...draggerProps}>
                <p className="ant-upload-drag-icon">
                  <Icon type="cloud-upload" style={{color: "#093163"}} />
                </p>
                <p className="ant-upload-text" style={{color: "#093163"}}>Upload a spreatsheet to import products</p>
                <p className="ant-upload-hint">
                  Drag and drop a file (CSV, XLSX, XLS) anywhere, browse youre file
                </p>

                <p style={{position: "absolute", bottom: 5, left: 10, color: "red"}}><strong>Note: </strong>accept only csv, xlsx, xls file</p>
              </Dragger>
            </div>
            {responseError && responseError.code === Enums.RECORD_EXIST ?
              <div style={{ textAlign: "center", marginTop: 38}}>
                <div style={{cursor: "pointer", minWidth: 100, color: "red", textDecoration: "underline"}} onClick={onViewLog}>
                  {showError ? <Translate id="text_close" /> : <Translate id="text_view_log" />}       
                </div>
              </div>
              : null}
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                type="primary"
                onClick={handleUpload}
                loading={uploading}
                style={{ marginTop: responseError ? 10 : 38, background: "#093163", borderColor: "#093163", width: "48%"}}
              >
                <span className="icon-import icon-padding-right"></span> <Translate id="text_import_product" />
              </Button>
            </div>
          </Form>
        </Col>
        <Col md={16} style={{paddingLeft: 20}}>
          {showError ? renderErrorContent() : null}
        </Col>
      </Row>
    </div>
  );
}