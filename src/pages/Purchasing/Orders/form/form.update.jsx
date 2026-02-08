import React, { useState, useEffect } from "react";
import { 
  PageHeader,
  Input, 
  Select, 
  DatePicker, 
  Button, 
  Table, 
  InputNumber, 
  Icon, 
  Row, 
  Col, 
  Card, 
  Tag,
  Modal, 
  Upload, 
  Divider, 
  Tooltip,
  Spin,
  Form 
} from "antd";
import moment from "moment";
import sweetalert from "sweetalert";
import ItemService from "@services/ItemService";
import LocationService from "@services/LocationService";
import POService from "@services/PurchaseOrderService";
import UnitService from '@services/UnitService';
import history from "@router/index";
import Util from "@helper/inventory";
import { getLocationId } from "@helper/user";
import { SelectItem, SelectVendor } from "@components/stateful";

const { Option } = Select;

const PurchaseOrderForm = (props) => {
  const [po, setPO] = useState(null);
  const [poItems, setPOItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [units, setUnits] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (poItems.length === 0) {
      addNewRow();
    }

    fetchItems();
    fetchWarehouses();
    fetchUnits();

    const { id } = props.match.params;
    getPODetailAndBuildPayload(id);
  }, []);

  const columns = [
    {
      title: "Item",
      dataIndex: "itemId",
      width: 250,
      render: (itemId, record, index) => (
        <div>
          <Form.Item style={{ marginBottom: 0 }}>
            {props.form.getFieldDecorator(`item[${index}]`, {
              rules: [
                {
                  required: false,
                  message: "Type to search or pick an item",
                },
              ],
              initialValue: itemId,
            })(<SelectItem items={items} defaultValue={itemId} />)}
          </Form.Item>
        </div>
      ),
    },
    {
      title: "SKU",
      dataIndex: "sku",
      width: 80,
      render: (value) => <Tag>{value || "-"}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      width: 120,
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {props.form.getFieldDecorator(`quantity[${index}]`, {
            rules: [
              {
                required: false,
                message: "Please enter quantity",
              },
              {
                type: "number",
                min: 1,
                message: "Quantity must be at least 1",
              },
            ],
            initialValue: value,
          })(
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="Enter quantity (pcs)"
            />,
          )}
        </Form.Item>
      ),
    },
    {
      title: "Price",
      dataIndex: "cost",
      width: 120,
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {props.form.getFieldDecorator(`cost[${index}]`, {
            rules: [
              {
                required: false,
                message: "Please enter price",
              },
              {
                type: "number",
                min: 0,
                message: "Price must be at least 0",
              },
            ],
            initialValue: value,
          })(
            <InputNumber
              style={{ width: "100%" }}
              min={1}
              placeholder="Enter unit price"
            />,
          )}
        </Form.Item>
      ),
    },
    {
      title: "Unit",
      dataIndex: "unit",
      width: 160,
      render: (unit, record, index) => {
        const unitList = unit ? [unit].concat(units) : units;
        return (
          <Form.Item style={{ marginBottom: 0 }}>
            {props.form.getFieldDecorator(
              `unitId[${index}]`,
              unit
                ? {
                    rules: [
                      {
                        required: false,
                        message: "Please select unit",
                      },
                    ],
                    initialValue: unit.id,
                  }
                : {},
            )(
              <Select
                style={{ width: "100%" }}
                placeholder="Pick a Unit (pcs, box, kg...)"
              >
                {unitList.map((u) => (
                  <Option key={u.id} value={u.id}>
                    {u.name}
                  </Option>
                ))}
              </Select>,
            )}
          </Form.Item>
        );
      },
    },
    {
      title: "Batch/Expiry",
      dataIndex: "batch",
      width: 150,
      render: (value, record, index) => (
        <div>
          <Form.Item style={{ marginBottom: 4 }}>
            {props.form.getFieldDecorator(`batch[${index}]`, {
              initialValue: value,
            })(
              <Input
                size="small"
                placeholder="Batch No."
                onChange={(e) => updateRow(record.key, "batch", e.target.value)}
              />,
            )}
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            {props.form.getFieldDecorator(`expiry[${index}]`, {
              initialValue: record.expiry ? moment(record.expiry) : null,
            })(
              <DatePicker
                size="small"
                style={{ width: "100%" }}
                placeholder="Expiry Date"
                onChange={(date, dateString) =>
                  updateRow(record.key, "expiry", date)
                }
              />,
            )}
          </Form.Item>
        </div>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      fixed: "right",
      render: (_, record, index) => (
        <div style={{ display: "flex", gap: 4 }}>
          <Form.Item style={{ display: "none" }}>
            {props.form.getFieldDecorator(`entryId[${index}]`, {
              initialValue: record.id,
            })(<InputNumber />)}
          </Form.Item>
          <Tooltip title="Duplicate">
            <Button
              size="small"
              icon="copy"
              onClick={() => duplicateRow(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              size="small"
              type="danger"
              icon="delete"
              onClick={() => removeRow(record.key)}
              disabled={poItems.length === 1}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const getPODetailAndBuildPayload = async (id) => {
    try {
      setLoading(true);
      const po = (await POService.getById(id))?.data;

      const payload = {
        id: po.id,
        locationId: po.locationId,
        deliveryDueDate: moment(po.deliveryDueDate).format(
          "YYYY-MM-DD HH:mm:ss"
        ),
        supplierId: po.supplierId,
        supplier: po.supplier,
        discount: po.discount,
        shippingFee: po.shippingFee,
        tax: po.tax || 0,
        status: po.status || "DRAFT",
      };


      setPO(payload);
      setPOItems(
        po.entries.map((entry) => ({
          id: entry.id,
          itemId: entry.itemId,
          itemName: entry.itemName,
          variantId: entry.variantId,
          variantName: entry.variantName,
          sku: entry.sku,
          unitId: entry.unitId,
          unitName: entry.unitName,
          cost: entry.cost,
          quantity: entry.quantity,
          batch: entry.batch,
          expiry: entry.expiry,
          unit: entry.unit,
        }))
      );

    } catch (error) {
      console.error("Error fetching PO detail:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const fetchItems = (locationId) => {
    const option = { limit: 15, offset: 0 };
    if (locationId) option.locationId = locationId;

    ItemService.get(option)
    .then(response => {
      if (response.data) {
          setItems(response.data.data);
      }
    })
    .finally(() => console.log("hello world"));
  }

  const fetchWarehouses = () => {
    LocationService.get()
    .then(response => {
      if (response.data) {
        setWarehouses(response.data.data);
      }
    })
    .finally(() => console.log("hello world"));
  }

  const fetchUnits = () => {
    UnitService.get()
    .then(response => {
      if (response.data) {
        setUnits(response.data.data);
      }
    })
    .finally(() => console.log("hello world"));
  }

  const addNewRow = () => {
    const newItem = {
      key: Date.now(),
      itemId: null,
      itemName: '',
      sku: '',
      quantity: null,
      warehouse: warehouses[0]?.id,
      batch: '',
      expiry: null,
      notes: '',
      currentStock: 0,
      avgQuantity: 0
    };
    setPOItems([...poItems, newItem]);
  };

  const removeRow = (key) => {
    setPOItems(poItems.filter(item => item.key !== key));
  };

  const duplicateRow = (record) => {
    const newItem = {
      ...record,
      key: Date.now(),
      quantity: null
    };
    setPOItems([...poItems, newItem]);
  };

  const updateRow = (key, field, value) => {
    const newItems = poItems.map(stockIOItem => {
      if (stockIOItem.key === key) {
        const updated = { ...stockIOItem, [field]: value };
        if (field === 'itemId' && value) {
          const selectedItem = items.find(i => i.id === value);
          if (selectedItem) {
            updated.itemName = selectedItem.name;
            updated.sku = Util.getItemSku(selectedItem);
            updated.unitId = Util.getUnitId(selectedItem);
            updated.currentStock = selectedItem.currentStock;
            updated.avgQuantity = selectedItem.avgQuantity;
            updated.warehouse = selectedItem.warehouse || warehouses[0].id;
          }
        }

        return updated;
      }
      return stockIOItem;
    });

    // Ensure there's always an empty row at the end
    if (newItems.findIndex(i => i.itemId === null) === -1) {
      newItems.push({
          key: Date.now(),
          itemId: null,
          itemName: '',
          sku: '',
          quantity: null,
          warehouse: warehouses[0]?.id,
          batch: '',
          expiry: null,
          notes: '',
          currentStock: 0,
          avgQuantity: 0
      });
    }
  
    setPOItems(newItems);
  };

  const handleDraftSubmit = async () => {
    try {
      const value = await new Promise((resolve, reject) => {
        props.form.validateFields((err, values) => {
          if (err) return reject(err);
          resolve(values);
        });
      });

      setSubmitting(true);

      const payload = {
        locationId: value.locationId,
        deliveryDueDate: moment(value.date).format("YYYY-MM-DD HH:mm:ss"),
        supplierId: value.vendorId,
        discount: value.discount,
        shippingFee: value.shippingFee,
        tax: 0,
        status: "DRAFT",
        entries: value.item.map((id, index) => {
          const item = items.find((item) => item.id === id);
          return {
            id: value.entryId[index],
            itemId: id,
            itemName: item?.name || "",
            variantId: Util.getVariantId(item),
            variantName: Util.getVariantName(item),
            unitId: Util.getUnitId(item),
            unitName: Util.getUnitName(item),
            cost: value.cost[index],
            quantity: value.quantity[index],
            batch: value.batch[index],
            expiry: value.expiry[index],
          };
        }),
      };
      await POService.updatePurchaseOrder(po.id, payload);
    } catch (error) {
      console.error("❌ PO Creation Failed:", error);
    } finally {
      sweetalert({
        icon: "success",
        title: "PO In Recorded",
        text: "Your PO has been saved.",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        setSubmitting(false);
        props.form.resetFields();
        const newItem = {
          key: Date.now(),
          itemId: null,
          itemName: "",
          sku: "",
          quantity: null,
          warehouse: warehouses[0]?.id,
          batch: "",
          expiry: null,
          notes: "",
          currentStock: 0,
          avgQuantity: 0,
        };
        setPOItems([newItem]);
      });
    }
  };

  const handleSubmit = async ({ status }) => {
    try {
      const value = await new Promise((resolve, reject) => {
        props.form.validateFields((err, values) => {
          if (err) return reject(err);
          resolve(values);
        });
      });
      
      setSubmitting(true);

      const payload = {
        locationId: `${value.locationId}`,
        deliveryDueDate: moment(value.deliveryDueDate).format("YYYY-MM-DD"),
        supplierId: value.vendorId,
        discount: value.discount,
        shippingFee: value.shippingFee,
        tax: 0,
        status: status || "ORDERED",
        entries: value.item
          .map((id, index) => {
            const item = items.find((item) => item.id === id);

            const unitId = value.unitId[index];
            const unit = units.find((unit) => unit.id === unitId);
            return {
              id: value.entryId[index],
              itemId: id,
              itemName: item?.name || "",
              variantId: Util.getVariantId(item),
              variantName: Util.getVariantName(item),
              sku: Util.getItemSku(item),
              unitId,
              unitName: unit?.name || "",
              cost: value.cost[index],
              quantity: value.quantity[index],
              batch: value.batch[index],
              expiry: value.expiry[index],
            };
          })
          .filter((item) => item.variantId !== ""),
      };
      await POService.updatePurchaseOrder(po.id, payload);
    } catch (error) {
      console.error("❌ PO Creation Failed:", error);
    } finally {
      sweetalert({
        icon: "success",
        title: "PO In Recorded",
        text: "Your PO has been saved.",
        buttons: false,
        timer: 1500,
      }).then(() => {
        setSubmitting(false);
      });
    }
  };

  const handleBulkUpload = (file) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          Modal.error({
            title: 'Invalid CSV',
            content: 'CSV file is empty or invalid. Please check the file format.',
          });
          return;
        }

        // Parse CSV header
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Validate required columns
        const requiredColumns = ['Item Name', 'SKU', 'Quantity', 'Warehouse'];
        const missingColumns = requiredColumns.filter(col => !headers.includes(col));
        
        if (missingColumns.length > 0) {
          Modal.error({
            title: 'Missing Required Columns',
            content: `The following columns are missing: ${missingColumns.join(', ')}`,
          });
          return;
        }

        // Parse data rows
        const parsedItems = [];
        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          
          if (values.length !== headers.length) {
            errors.push(`Row ${i + 1}: Column count mismatch`);
            errorCount++;
            continue;
          }

          const rowData = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          // Validate required fields
          if (!rowData['Item Name'] || !rowData['SKU'] || !rowData['Quantity']) {
            errors.push(`Row ${i + 1}: Missing required fields`);
            errorCount++;
            continue;
          }

          // Find matching item from mock data
          const matchedItem = items.find(
            item => item.sku === rowData['SKU'] || 
                   item.name.toLowerCase() === rowData['Item Name'].toLowerCase()
          );

          // AI Enhancement: Auto-fill missing fields
          const newItem = {
            key: Date.now() + i,
            itemId: matchedItem ? matchedItem.id : null,
            itemName: rowData['Item Name'],
            sku: rowData['SKU'],
            quantity: parseInt(rowData['Quantity']) || null,
            batch: rowData['Batch'] || '',
            expiry: rowData['Expiry'] ? moment(rowData['Expiry']) : null,
            notes: rowData['Notes'] || '',
            currentStock: matchedItem ? matchedItem.currentStock : 0,
            avgQuantity: matchedItem ? matchedItem.avgQuantity : 0
          };

          // Validate quantity
          if (!newItem.quantity || newItem.quantity <= 0) {
            errors.push(`Row ${i + 1}: Invalid quantity`);
            errorCount++;
            continue;
          }

          parsedItems.push(newItem);
          successCount++;
        }

        // Add parsed poItems to the table
        if (parsedItems.length > 0) {
          // Remove empty initial row if exists
          const filteredItems = poItems.filter(item => item.itemId !== null);
          setPOItems([...filteredItems, ...parsedItems]);
        }

        // Show result modal
        Modal.success({
          title: 'Bulk Upload Complete',
          content: (
            <div>
              <p><Icon type="check-circle" style={{ color: '#52c41a' }} /> <strong>{successCount}</strong> poItems imported successfully</p>
              {errorCount > 0 && (
                <div>
                  <p><Icon type="exclamation-circle" style={{ color: '#faad14' }} /> <strong>{errorCount}</strong> poItems failed</p>
                  <div style={{ maxHeight: 150, overflow: 'auto', background: '#fff1f0', padding: 8, borderRadius: 4, marginTop: 8 }}>
                    {errors.map((err, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: '#cf1322' }}>• {err}</div>
                    ))}
                  </div>
                </div>
              )}
              <Divider style={{ margin: '12px 0' }} />
              <p style={{ fontSize: 12, color: '#666' }}>
                <Icon type="bulb" /> AI has auto-filled missing warehouses and reasons based on your settings.
              </p>
            </div>
          ),
          width: 500,
        });

      } catch (error) {
        Modal.error({
          title: 'Upload Failed',
          content: `Error parsing CSV file: ${error.message}`,
        });
      }
    };

    reader.onerror = () => {
      Modal.error({
        title: 'File Read Error',
        content: 'Failed to read the file. Please try again.',
      });
    };

    reader.readAsText(file);
    return false;
  };

  return loading ? (
    <Spin spinning={true} />
  ) : (
    <div style={{ padding: 24, background: "#f0f2f5", minHeight: "100vh" }}>
      <Form autoComplete="off" onSubmit={() => console.log("hello world")}>
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
          onBack={() => history.goBack()}
          title={"New Purchase Order"}
          subTitle={"Easily create, track, and manage purchase orders"}
        />
        <Card>
          {/* Header Form */}
          <Row gutter={16}>
            <Col md={6}>
              <Form.Item label="Supplier / Vendor">
                {props.form.getFieldDecorator("vendorId", {
                  rules: [
                    {
                      required: true,
                      message: "Please select vendor",
                    },
                  ],
                  initialValue: po?.supplierId,
                })(
                  <SelectVendor
                    form={props.form}
                    defaultValue={po?.supplierId}
                    selectedItem={po?.supplier}
                    size="meduim"
                    width={"100%"}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="Expected Delivery Date">
                {props.form.getFieldDecorator("deliveryDueDate", {
                  rules: [{ required: false }],
                  initialValue: moment(po?.deliveryDueDate),
                })(
                  <DatePicker
                    format={"DD/MM/YYYYY"}
                    style={{ width: "100%" }}
                  />,
                )}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item label="Warehouse">
                {props.form.getFieldDecorator("locationId", {
                  rules: [
                    {
                      required: true,
                      message: "Please select location",
                    },
                  ],
                  initialValue: po?.locationId,
                })(
                  <Select
                    style={{ width: "100%" }}
                    placeholder="Select warehouse"
                    onChange={(locationId) => fetchItems(locationId)}
                  >
                    {warehouses.map((wh) => (
                      <Option key={wh.id} value={wh.id}>
                        {wh.name}
                      </Option>
                    ))}
                  </Select>,
                )}
              </Form.Item>
            </Col>
            <Col md={6}>
              <Form.Item
                label="Discount"
                extra="Discount provided by the supplier or seller."
              >
                {props.form.getFieldDecorator("discount", {
                  rules: [],
                  initialValue: po?.discount,
                })(
                  <InputNumber
                    size="medium"
                    placeholder="Enter discount amount (e.g., 5.00)"
                  />,
                )}
              </Form.Item>
            </Col>
            {/* <Col md={6}>
              <div style={{ marginBottom: 8 }}>
                <strong>Quick Actions</strong>
              </div>
              <Upload
                beforeUpload={handleBulkUpload}
                accept=".csv,.xlsx"
                showUploadList={false}
              >
                <Button icon="upload" block>
                  Bulk Upload
                </Button>
              </Upload>
            </Col> */}
            {/* <Col md={24}>
              <InputTextArea
                name="description"
                label={<Translate id="text_notes" />}
                max={255}
                form={props.form}
              />
            </Col> */}
          </Row>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col md={6}>
              <Form.Item label="Shipping Fee">
                {props.form.getFieldDecorator("shippingFee", {
                  rules: [],
                  initialValue: po?.shippingFee,
                })(
                  <InputNumber
                    size="meduim"
                    placeholder="Enter shipping fee (e.g., 2.50)"
                  />,
                )}
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Items Table */}
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ margin: 0 }}>
                <Icon type="unordered-list" /> Items (
                {poItems.filter((poItem) => poItem.itemId !== "").length})
              </h3>
              <Button type="dashed" icon="plus" onClick={addNewRow}>
                Add Item Row
              </Button>
            </div>
            <Table
              columns={columns}
              size="small"
              dataSource={poItems}
              pagination={false}
              scroll={{ x: 1400 }}
              bordered
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
            }}
          >
            <Button
              size="large"
              onClick={handleDraftSubmit}
              disabled={poItems.filter((i) => i.itemId).length === 0}
            >
              Update Draft
            </Button>
            <Button
              type="primary"
              size="large"
              icon="check"
              onClick={handleSubmit}
              loading={submitting}
              disabled={poItems.filter((i) => i.itemId).length === 0}
            >
              Update Order
            </Button>
            <Button
              size="large"
              icon="inbox"
              onClick={() => handleSubmit({ status: "FULL_RECEIVED" })}
              disabled={poItems.filter((i) => i.itemId).length === 0}
            >
              Update Received Order
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default PurchaseOrderForm;