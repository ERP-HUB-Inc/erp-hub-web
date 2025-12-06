import React, { useState } from 'react';
import * as XLSX from "xlsx";
import moment from "moment";
import sweetalert from "sweetalert";
import { PageHeader, Table, Button, Statistic, Row, Col, Tag, message, Divider, Upload, Icon, Alert, Steps } from 'antd';
import 'antd/dist/antd.css';
import ItemService from '@services/ItemService';
import StockIOService from "@services/StockIOService";
import { getLocationId } from '@helper/user';
import history from '@common/router/history';

const StockIOBulkImport = () => {
  const [loading, setLoading] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [importedData, setImportedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = (e) => {
      try {
        if (fileExtension === 'csv') {
          parseCSV(e.target.result);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          const workbook = XLSX.read(e.target.result, { type: "binary" });
          const sheetName = workbook.SheetNames[0]; // First sheet only
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet, { defval: "" });
          parseExcel(jsonData);
        }
      } catch (error) {
        message.error('Error parsing file: ' + error.message);
      }
    };

    if (fileExtension === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }

    return false;
  };

  const parseCSV = async (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const barcodeIndex = headers.findIndex(h => h.includes('sku') || h.includes('code'));
    const qtyIndex = headers.findIndex(h => h.includes('qty') || h.includes('quantity') || h.includes('amount'));

    if (barcodeIndex === -1 || qtyIndex === -1) {
      message.error('CSV must contain "barcode" and "qty" columns');
      return;
    }

    const imported = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const barcode = values[barcodeIndex];
      const qty = parseFloat(values[qtyIndex]);

      if (!barcode || isNaN(qty) || qty <= 0) {
        errors.push(`Line ${i + 1}: Invalid barcode or quantity`);
        continue;
      }

      const item = await ItemService.getItemBySKU(barcode, getLocationId());
      
      if (item && item.data && item.data.data) {
        imported.push({
          ...item,
          quantity: qty,
          lineNumber: i + 1
        });
      } else {
        errors.push(`Line ${i + 1}: Item with barcode "${barcode}" not found`);
      }
    }

    setImportedData(imported);
    setValidationErrors(errors);
    setImportStep(1);

    if (imported.length > 0) {
      message.success(`Successfully parsed ${imported.length} items`);
    }
  };

  const parseExcel = async (rows) => {
    if (!Array.isArray(rows) || rows.length === 0) {
      message.error("Excel file is empty or unreadable");
      return;
    }

    // Normalize headers (lowercase, trim)
    const headers = Object.keys(rows[0]).map((h) => h.trim().toLowerCase());

    // Identify key columns
    const skuKey = headers.find((h) => h.includes("sku"));
    const qtyKey = headers.find(
      (h) => h.includes("qty") || h.includes("quantity") || h.includes("amount")
    );

    if (!skuKey || !qtyKey) {
      message.error('Excel must contain "SKU" and "Quantity" columns');
      return;
    }

    const imported = [];
    const errors = [];
  
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const lineNumber = i + 1;

      // Convert row keys to lowercase
      const normalizedRow = {};
      Object.keys(row).forEach((key) => {
        if (key) {
          normalizedRow[key.trim().toLowerCase()] = row[key];
        }
      });

      const sku = (normalizedRow[skuKey] || "").toString().trim();
      const qty = parseFloat(normalizedRow[qtyKey]);

      if (!sku || isNaN(qty) || qty <= 0) {
        errors.push(`Row ${lineNumber}: Invalid SKU or quantity`);
        return;
      }

      const item = await ItemService.getItemBySKU(sku, getLocationId());
      
      if (item && item.data) {
        imported.push({
          itemId: item?.data?.productId,
          itemName: row["Item Name"],
          currentStock: item.data.quantity,
          quantity: qty,
          warehouse: row["Warehouse"] || item.warehouse || "",
          variantId: item?.data?.id,
          variantName: item?.data?.name || "Unknown",
          cost: 0,
          unitId: item?.data?.product?.stockUnitId,
          unitName: "",
          reason: row["Reason"] || "",
          batch: row["Batch"] || "",
          expiry: row["Expiry"] || "",
          notes: row["Notes"] || "",
          lineNumber,
        });
      } else {
        errors.push(`Row ${lineNumber}: Item SKU "${sku}" not found`);
      }
    }

    setImportedData(imported);
    setValidationErrors(errors);
    setImportStep(1);

    if (imported.length > 0) {
      message.success(`Successfully parsed ${imported.length} items`);
    }
  };

  const handleApplyImport = async () => {
    try {
      setLoading(true);
      const stockIn = {
        type: "IN",
        name: "Stock In from Supplier",
        locationId: getLocationId(),
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
        description: "",
        quantity: importedData.reduce((sum, item) => sum + item.quantity, 0),
        amount: 0,
        status: 2,
        entries: importedData,
      };
      await StockIOService.stockIn(stockIn);
    } catch (error) {
      console.error("❌ Stock In Failed:", error);

      if (error.response) {
        const apiMessage =
          error.response?.data?.message?.error?.message ||
          "Server returned an unexpected error.";

        const apiCode =
          error.response?.data?.message?.error?.code || error.response?.status;

        sweetalert({
          icon: "error",
          title: `Error ${apiCode}`,
          text: apiMessage,
        });
      } else if (error.request) {
        sweetalert({
          icon: "error",
          title: "Network Error",
          text: "No response from server. Please check your internet connection.",
        });
      } else {
        sweetalert({
          icon: "error",
          title: "Unexpected Error",
          text: error.message,
        });
      }
    } finally {
      setLoading(false);
      sweetalert({
        icon: "success",
        title: "Stock Imported!",
        text: "The stock has been imported successfully.",
        buttons: ["New Import", "Go to Stock IO"],
      }).then((confirm) => {
        setImportedData([]);
        setValidationErrors([]);
        setImportStep(0);
      
        if (confirm) {
          history.push("/inventories/stock-io");
          window.location.reload();
        }
      });
    }
  };

  const downloadTemplate = () => {
    const template = `Item Name,SKU,Quantity,Warehouse,Reason,Batch,Expiry,Notes
    Sample Item 1,8885015022115,10,WH-A,Purchase,B001,2025-12-31,First batch
    Sample Item 2,8992760121090,5,WH-B,Return,B002,2025-11-30,Second batch
    Sample Item 3,000002,3,Main-Store,Adjustment,B003,2026-01-15,Manual correction`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_in_template.csv"; // updated filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <PageHeader
        style={{
          paddingLeft: 0,
          paddingRight: 0,
        }}
        onBack={() => history.goBack()}
        title="Stock IO - Bulk Import"
        subTitle="Upload multiple stock entries at once"
      />
      <Steps current={importStep} style={{ marginBottom: "24px" }}>
        <Steps.Step title="Upload File" icon={<Icon type="upload" />} />
        <Steps.Step title="Review Data" icon={<Icon type="solution" />} />
        <Steps.Step title="Apply Import" icon={<Icon type="check-circle" />} />
      </Steps>

      {importStep === 0 && (
        <div>
          <Alert
            message="Instructions"
            description={
              <div>
                <p>
                  <strong>CSV Format Required:</strong>
                </p>
                <ul style={{ marginLeft: "20px" }}>
                  <li>
                    Column headers: <code>Item Name</code>, <code>SKU</code>,{" "}
                    <code>Quantity</code>, <code>Warehouse</code>,{" "}
                    <code>Reason</code>, <code>Batch</code>, <code>Expiry</code>
                    , <code>Notes</code>
                  </li>
                  <li>One item per row</li>
                  <li>SKU must match existing items in the system</li>
                  <li>Quantity must be a positive number</li>
                </ul>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: "24px" }}
          />

          <div style={{ textAlign: "center" }}>
            <Upload.Dragger
              beforeUpload={handleFileUpload}
              accept=".csv,.xlsx,.xls"
              showUploadList={false}
              style={{ padding: "40px" }}
            >
              <p className="ant-upload-drag-icon">
                <Icon
                  type="inbox"
                  style={{ fontSize: "48px", color: "#1890ff" }}
                />
              </p>
              <p className="ant-upload-text" style={{ fontSize: "16px" }}>
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for CSV and Excel files (.csv, .xlsx, .xls)
              </p>
            </Upload.Dragger>

            <Divider>OR</Divider>

            <Button icon="download" onClick={downloadTemplate} size="large">
              Download CSV Template
            </Button>
          </div>
        </div>
      )}

      {importStep === 1 && (
        <div>
          {validationErrors.length > 0 && (
            <Alert
              message={`Found ${validationErrors.length} errors`}
              description={
                <div style={{ overflow: "auto" }}>
                  {validationErrors.map((err, idx) => (
                    <div key={idx} style={{ fontSize: "12px" }}>
                      • {err}
                    </div>
                  ))}
                </div>
              }
              type="warning"
              showIcon
              style={{ marginBottom: "16px" }}
              closable
            />
          )}

          {importedData.length > 0 && (
            <>
              <Alert
                message={`Successfully validated ${importedData.length} items`}
                type="success"
                showIcon
                style={{ marginBottom: "16px" }}
                banner
              />

              <Table
                dataSource={importedData}
                pagination={false}
                bordered={true}
                size="middle"
                rowKey="key"
                columns={[
                  {
                    title: "Line",
                    dataIndex: "lineNumber",
                    width: "60px",
                    align: "center",
                  },
                  {
                    title: "Item Name",
                    dataIndex: "itemName",
                    render: (itemName, record) => (
                      <div>
                        <div>{itemName}</div>
                        <div style={{ fontSize: "12px", color: "#888" }}>
                          {record.sku}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: "Current Stock",
                    dataIndex: "currentStock",
                    width: "120px",
                    align: "right",
                    render: (currentStock) =>
                      currentStock ? currentStock.toFixed(2) : 0,
                  },
                  {
                    title: "Import Qty",
                    dataIndex: "quantity",
                    width: "100px",
                    align: "right",
                    render: (quantity) => (
                      <Tag color="blue">+{quantity.toFixed(2)}</Tag>
                    ),
                  },
                  {
                    title: "New Stock",
                    width: "120px",
                    align: "right",
                    render: (_, record) => (
                      <span style={{ color: "#52c41a", fontWeight: "bold" }}>
                        {(record.currentStock + record.quantity).toFixed(2)}
                      </span>
                    ),
                  },
                ]}
              />

              <div
                style={{
                  marginTop: "24px",
                  textAlign: "center",
                  padding: "20px",
                  background: "#f6ffed",
                  borderRadius: "4px",
                }}
              >
                <Row gutter={24}>
                  <Col span={12}>
                    <Statistic
                      title="Total Items"
                      value={importedData.length}
                      valueStyle={{ color: "#1890ff" }}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="Total Quantity"
                      value={importedData.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
                      precision={2}
                      valueStyle={{ color: "#52c41a" }}
                    />
                  </Col>
                </Row>
              </div>

              <div style={{ marginTop: "24px", textAlign: "right" }}>
                <Button
                  onClick={() => {
                    setImportStep(0);
                    setImportedData([]);
                    setValidationErrors([]);
                  }}
                  style={{ marginRight: "8px" }}
                  size="large"
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  disabled={loading}
                  loading={loading}
                  onClick={handleApplyImport}
                  size="large"
                >
                  Apply Import to Stock IN
                </Button>
              </div>
            </>
          )}

          {importedData.length === 0 && validationErrors.length > 0 && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <Button onClick={() => setImportStep(0)}>Back to Upload</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockIOBulkImport;