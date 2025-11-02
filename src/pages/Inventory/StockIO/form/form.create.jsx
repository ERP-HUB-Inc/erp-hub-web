import React, { useState, useEffect } from 'react';
import { PageHeader, Input, Select, DatePicker, Button, Table, InputNumber, Icon, Row, Col, Card, Tag, Alert, Modal, Upload, Divider, Tooltip, Form } from 'antd';
import moment from 'moment';
import ItemService from "@services/ItemService";
import LocationService from '@services/LocationService';
import history from "@router/index";
import Util from "@helper/inventory";

const { Option } = Select;
const { TextArea } = Input;

const StockIOForm = (props) => {
  const [stockIOItems, setStockIOItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [movementType, setMovementType] = useState('IN');
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [validationWarnings, setValidationWarnings] = useState({});
  let timeout = null;

  const reasons = {
    IN: [
      'Purchase',          // when buying goods from supplier
      'Customer Return',   // when customer returns goods
      'Transfer In',       // received from another branch
      'Stock Adjustment',  // manual correction
      'Production Result'  // products from production
    ],
    OUT: [
      'Sale',              // sold to customer
      'Return to Supplier',// return goods to supplier
      'Transfer Out',      // send to another branch
      'Damaged / Lost',    // broken, expired, or missing
      'Used in Production' // used as material in production
    ]
  };

  // Initialize with one empty row
  useEffect(() => {
    if (stockIOItems.length === 0) {
      addNewRow();
    }
    fetchItems();
    fetchWarehouses();
  }, []);

  const fetchItems = () => {
    ItemService.get({ limit: 15, offset: 0 })
    .then(response => {
      if (response.data) {
          setItems(response.data.data);
          setPagination(response.data.pagination);
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

  const addNewRow = () => {
    const newItem = {
      key: Date.now(),
      itemId: null,
      itemName: '',
      sku: '',
      quantity: null,
      warehouse: warehouses[0]?.id,
      reason: reasons[movementType][0],
      batch: '',
      expiry: null,
      notes: '',
      currentStock: 0,
      avgQuantity: 0
    };
    setStockIOItems([...stockIOItems, newItem]);
  };

  const removeRow = (key) => {
    setStockIOItems(stockIOItems.filter(item => item.key !== key));
  };

  const duplicateRow = (record) => {
    const newItem = {
      ...record,
      key: Date.now(),
      quantity: null
    };
    setStockIOItems([...stockIOItems, newItem]);
  };

  const updateRow = (key, field, value) => {
    const newItems = stockIOItems.map(stockIOItem => {
      if (stockIOItem.key === key) {
        const updated = { ...stockIOItem, [field]: value };
        if (field === 'itemId' && value) {
          const selectedItem = items.find(i => i.id === value);
          if (selectedItem) {
            updated.itemName = selectedItem.name;
            updated.sku = Util.getProductSku(selectedItem);
            updated.currentStock = selectedItem.currentStock;
            updated.avgQuantity = selectedItem.avgQuantity;
            updated.warehouse = selectedItem.warehouse || warehouses[0].id;
            
            // AI suggests quantity based on average
            setAiSuggestions({
              ...aiSuggestions,
              [key]: `Typical quantity: ${selectedItem.avgQuantity} units`
            });
          }
        }

        // Validation: Check stock for OUT movements
        if (field === 'quantity' && movementType === 'OUT') {
          if (value > updated.currentStock) {
            setValidationWarnings({
              ...validationWarnings,
              [key]: `⚠️ Quantity exceeds available stock (${updated.currentStock})`
            });
          } else {
            const newWarnings = { ...validationWarnings };
            delete newWarnings[key];
            setValidationWarnings(newWarnings);
          }
        }

        return updated;
      }
      return stockIOItem;
    });
    setStockIOItems(newItems);
  };

  const handleMovementTypeChange = (value) => {
    setMovementType(value);
    // Update reason for all stockIOItems
    setStockIOItems(stockIOItems.map(item => ({
      ...item,
      reason: reasons[value][0]
    })));
  };

  const columns = [
    {
      title: "Item",
      dataIndex: 'itemId',
      width: 250,
      render: (value, record) => (
        <div>
          <Form.Item style={{ marginBottom: 0 }}>
            {
              props.form.getFieldDecorator(`item[${record.key}]`, {
                rules: [
                  {
                    required: true,
                    message: 'Please select an item'
                  }
                ],
                initialValue: value
              })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Search or select item"
                  onChange={(val) => updateRow(record.key, 'itemId', val)}
                  onSearch={onSearchItem}
                  filterOption={false}
                  notFoundContent={loading ? <Icon type="loading" /> : "No items found"}
                >
                  {items.map(item => (
                    <Option key={item.id} value={item.id}>
                      <div>
                        <div>{item.name}</div>
                        <small style={{ color: '#999' }}>SKU: {Util.getProductSku(item)} | Stock: {Util.getQuantityOnHand(item)}</small>
                      </div>
                    </Option>
                  ))}
                </Select>
              )
            }
          </Form.Item>
          {/* {aiSuggestions[record.key] && (
            <Tag color="blue" style={{ marginTop: 4, fontSize: 11 }}>
              <Icon type="bulb" /> {aiSuggestions[record.key]}
            </Tag>
          )} */}
        </div>
      ),
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      width: 120,
      render: (value) => <Tag>{value || '-'}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: 'quantity',
      width: 120,
      render: (value, record) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`quantity[${record.key}]`, {
              rules: [
                {
                  required: true,
                  message: 'Please enter quantity'
                },
                {
                  type: 'number',
                  min: 1,
                  message: 'Quantity must be at least 1'
                }
              ],
              initialValue: value
            })(
              <InputNumber
                style={{ width: '100%' }}
                min={1}
                placeholder="Qty"
                onChange={(val) => updateRow(record.key, 'quantity', val)}
              />
            )
          }
          {validationWarnings[record.key] && (
            <div style={{ color: '#faad14', fontSize: 12, marginTop: 4 }}>
              <Icon type="exclamation-circle" /> {validationWarnings[record.key]}
            </div>
          )}
        </Form.Item>
      ),
    },
    {
      title: "Warehouse",
      dataIndex: 'warehouse',
      width: 160,
      render: (value, record) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`warehouse-${record.key}`, {
              rules: [
                {
                  required: true,
                  message: 'Please select warehouse'
                }
              ],
              initialValue: value
            })(
              <Select
                style={{ width: '100%' }}
                onChange={(val) => updateRow(record.key, 'warehouse', val)}
              >
                {warehouses.map(wh => (
                  <Option key={wh.id} value={wh.id}>{wh.name}</Option>
                ))}
              </Select>
            )
          }
        </Form.Item>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      width: 150,
      render: (value, record) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`reason-${record.key}`, {
              rules: [
                {
                  required: true,
                  message: 'Please select reason'
                }
              ],
              initialValue: value
            })(
              <Select
                style={{ width: '100%' }}
                onChange={(val) => updateRow(record.key, 'reason', val)}
              >
                {reasons[movementType].map(rs => (
                  <Option key={rs} value={rs}>{rs}</Option>
                ))}
              </Select>
            )
          }
        </Form.Item>
      ),
    },
    {
      title: 'Batch/Expiry',
      dataIndex: 'batch',
      width: 150,
      render: (value, record) => (
        <div>
          <Form.Item style={{ marginBottom: 4 }}>
            {
              props.form.getFieldDecorator(`batch[${record.key}]`, {
                initialValue: value
              })(
                <Input
                  size="small"
                  placeholder="Batch No."
                  onChange={(e) => updateRow(record.key, 'batch', e.target.value)}
                />
              )
            }
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            {
              props.form.getFieldDecorator(`expiry[${record.key}]`, {
                initialValue: record.expiry ? moment(record.expiry) : null
              })(
                <DatePicker
                  size="small"
                  style={{ width: '100%' }}
                  placeholder="Expiry Date"
                  onChange={(date, dateString) => updateRow(record.key, 'expiry', date)}
                />
              )
            }
          </Form.Item>
        </div>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      width: 150,
      render: (value, record) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`notes[${record.key}]`, {
              initialValue: value
            })(
              <TextArea
                rows={2}
                placeholder="Additional notes"
                onChange={(e) => updateRow(record.key, 'notes', e.target.value)}
              />
            )
          }
        </Form.Item>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 4 }}>
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
              disabled={stockIOItems.length === 1}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const calculateSummary = () => {
    const totalItems = stockIOItems.filter(i => i.quantity > 0).length;
    const totalQuantity = stockIOItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const warehouseSummary = {};
    
    stockIOItems.forEach(item => {
      if (item.warehouse && item.quantity) {
        warehouseSummary[item.warehouse] = (warehouseSummary[item.warehouse] || 0) + item.quantity;
      }
    });

    return { totalItems, totalQuantity, warehouseSummary };
  };

  const onSearchItem = search => {
    const limit = 15;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setLoading(true);
      ItemService.get({ limit, search })
      .then(response => {
        if (response && response.data) {
          setItems(response.data.data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
    }, 1000);
  };

  const handleSubmit = () => {
    props.form.validateFields((err, values) => {
      if (!err) {
          console.log('Form values:', values);
      }
    });
    // Validate
    const invalidItems = stockIOItems.filter(item => !item.itemId || !item.quantity);
    if (invalidItems.length > 0) {
      Modal.error({
        title: 'Validation Error',
        content: 'Please ensure all stockIOItems have a selected product and quantity.',
      });
      return;
    }

    if (Object.keys(validationWarnings).length > 0) {
      Modal.confirm({
        title: 'Stock Warnings Detected',
        content: 'Some stockIOItems have stock warnings. Do you want to proceed anyway?',
        onOk: () => submitData(),
      });
    } else {
      submitData();
    }
  };

  const submitData = () => {
    const summary = calculateSummary();
    Modal.success({
      title: 'Stock Movement Submitted',
      content: (
        <div>
          <p><strong>Type:</strong> Stock {movementType === 'IN' ? 'In' : 'Out'}</p>
          <p><strong>Total Items:</strong> {summary.totalItems}</p>
          <p><strong>Total Quantity:</strong> {summary.totalQuantity}</p>
          <Divider style={{ margin: '8px 0' }} />
          <p><strong>Warehouse Summary:</strong></p>
          {Object.entries(summary.warehouseSummary).map(([wh, qty]) => (
            <div key={wh}>• {wh}: {qty} units</div>
          ))}
        </div>
      ),
    });
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
            warehouse: rowData['Warehouse'] || (matchedItem ? matchedItem.warehouse : warehouses[0].name),
            reason: rowData['Reason'] || reasons[movementType][0],
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

          // AI Suggestion for unmatched stockIOItems
          if (!matchedItem) {
            setAiSuggestions(prev => ({
              ...prev,
              [newItem.key]: `⚠️ New item - not found in inventory`
            }));
          }

          parsedItems.push(newItem);
          successCount++;
        }

        // Add parsed stockIOItems to the table
        if (parsedItems.length > 0) {
          // Remove empty initial row if exists
          const filteredItems = stockIOItems.filter(item => item.itemId !== null);
          setStockIOItems([...filteredItems, ...parsedItems]);
        }

        // Show result modal
        Modal.success({
          title: 'Bulk Upload Complete',
          content: (
            <div>
              <p><Icon type="check-circle" style={{ color: '#52c41a' }} /> <strong>{successCount}</strong> stockIOItems imported successfully</p>
              {errorCount > 0 && (
                <div>
                  <p><Icon type="exclamation-circle" style={{ color: '#faad14' }} /> <strong>{errorCount}</strong> stockIOItems failed</p>
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
    return false; // Prevent default upload behavior
  };

  const summary = calculateSummary();

  return (
    <div style={{ padding: 24, background: '#f0f2f5', minHeight: '100vh' }}>
      <Form autoComplete="off" onSubmit={() => console.log("hello world")}>
        <PageHeader
            style={{
                paddingLeft: 0,
                paddingRight: 0
            }}
            onBack={() => history.goBack()}
            title={"New Stock IO"}
            subTitle={"Stock IO Management"}
          />
        <Card
          // title={
          //   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          //     <Icon type="swap" style={{ fontSize: 24 }} />
          //     <span>Stock IO Movement</span>
          //     <Tag color={movementType === 'IN' ? 'green' : 'orange'}>
          //       {movementType === 'IN' ? 'STOCK IN' : 'STOCK OUT'}
          //     </Tag>
          //   </div>
          // }
          // extra={
          //   <Button type="link" onClick={() => window.location.reload()}>
          //     <Icon type="reload" /> Reset
          //   </Button>
          // }
        >
          {/* Header Form */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              {/* <div style={{ marginBottom: 8 }}>
                <strong>Movement Type *</strong>
              </div> */}
              <Form.Item label={"Movement Type"} >
                {
                  props.form.getFieldDecorator("movementType", { 
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: movementType
                  })(
                    <Select
                      style={{ width: '100%' }}
                      onChange={handleMovementTypeChange}
                    >
                      <Option value="IN">
                        Stock In
                      </Option>
                      <Option value="OUT">
                        Stock Out
                      </Option>
                    </Select>
                  )
                }
              </Form.Item>
              
            </Col>
            <Col span={6}>
              <Form.Item label="Date">
                {
                  props.form.getFieldDecorator("date", { rules: [{ required:  true }] })
                  (
                    <DatePicker
                      style={{ width: '100%' }}
                    />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Reference No.">
                {
                  props.form.getFieldDecorator("referenceNo")
                  (
                    <Input placeholder="PO-2025-001" />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={6}>
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
            </Col>
          </Row>

          <Divider />

          {/* AI Assistant Alert */}
          <Alert
            message="AI Assistant Active"
            description="AI will auto-fill quantities, warehouse locations, and suggest typical values based on your history."
            type="info"
            icon={<Icon type="robot" />}
            showIcon
            closable
            style={{ marginBottom: 16 }}
          />

          {/* Items Table */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>
                <Icon type="unordered-list" /> Items ({stockIOItems.length})
              </h3>
              <Button type="dashed" icon="plus" onClick={addNewRow}>
                Add Item Row
              </Button>
            </div>
            <Table
              columns={columns}
              dataSource={stockIOItems}
              pagination={false}
              scroll={{ x: 1400 }}
              size="small"
              bordered
            />
          </div>

          {/* Summary Panel */}
          <Card
            size="small"
            title={"Summary"}
            style={{ background: '#fafafa' }}
          >
            <Row gutter={16}>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {summary.totalItems}
                  </div>
                  <div style={{ color: '#666' }}>Total Items</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {summary.totalQuantity}
                  </div>
                  <div style={{ color: '#666' }}>Total Quantity</div>
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>Warehouse Distribution:</strong>
                  <div style={{ marginTop: 8 }}>
                    {Object.entries(summary.warehouseSummary).map(([whId, qty]) => (
                      <Tag key={whId} color="blue" style={{ marginBottom: 4 }}>
                        {warehouses.find(w => w.id === Number(whId))?.name ?? 'Unknown'}: {qty} units
                      </Tag>
                    ))}
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Action Buttons */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button size="large">
              Save as Draft
            </Button>
            <Button
              type="primary"
              size="large"
              icon="check"
              onClick={handleSubmit}
              disabled={stockIOItems.filter(i => i.itemId).length === 0}
            >
              Submit All Items
            </Button>
          </div>
        </Card>
      </Form>
    </div>
  );
};

export default StockIOForm;