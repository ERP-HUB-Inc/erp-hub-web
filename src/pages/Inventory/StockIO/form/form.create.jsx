import React, { useState, useEffect } from 'react';
import { PageHeader, Input, Select, DatePicker, Button, Table, InputNumber, Icon, Row, Col, Card, Tag, Alert, Modal, Upload, Divider, Tooltip, Form } from 'antd';
import moment from 'moment';
import sweetalert from "sweetalert";
import ItemService from "@services/ItemService";
import LocationService from '@services/LocationService';
import StockIOService from '@services/StockIOService';
import UnitService from '@services/UnitService';
import history from "@router/index";
import Util from "@helper/inventory";
import { getLocationId } from '@helper/user';

const { Option } = Select;
const { TextArea } = Input;

const StockIOForm = (props) => {
  const [stockIOItems, setStockIOItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [units, setUnits] = useState([]);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({});
  const [movementType, setMovementType] = useState('IN');
  const [aiSuggestions, setAiSuggestions] = useState({});
  const [validationWarnings, setValidationWarnings] = useState({});
  let timeout = null;

  const reasons = {
    IN: [
      "Buy from Supplier",
      "Customer Returned Item",
      "Received from Another Branch",
      "Fix Stock Mistake",
      "Made in Production",
      "Start Initial Stock",
      "Stock on Consignment",
      "Free Item from Supplier",
      "Returned from Branch",
      "Split / Repack Item",
      "Free Item / Donation"
    ],
    OUT: [
      "Sale",
      "Return to Supplier",
      "Transfer Out",
      "Damaged / Lost",
      "Used in Production",
      "Opening Adjustment",
      "Internal Use / Staff Use",
      "Sample / Demo Use",
      "Donation / Charity",
      "Promotion / Free Gift",
      "Expired / Spoiled Write-Off",
      "Repack / Unit Conversion"
    ]
  };

  // Initialize with one empty row
  useEffect(() => {
    if (stockIOItems.length === 0) {
      addNewRow();
    }
    fetchItems();
    fetchWarehouses();
    fetchUnits();
  }, []);

  const fetchItems = (locationId) => {
    const option = { limit: 15, offset: 0 };
    if (locationId) option.locationId = locationId;

    ItemService.get(option)
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
            updated.unitId = Util.getUnitId(selectedItem);
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

    // Ensure there's always an empty row at the end
    if (newItems.findIndex(i => i.itemId === null) === -1) {
      newItems.push({
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
      });
    }
  
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

  const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg width='200' height='200' viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='200' height='200' fill='%23f0f0f0'/%3E%3Cg transform='translate(50, 50)'%3E%3Crect x='10' y='15' width='80' height='70' fill='none' stroke='%23bfbfbf' stroke-width='3' rx='4'/%3E%3Cpolygon points='15,75 35,50 55,65 75,45 85,75' fill='%23d9d9d9'/%3E%3Ccircle cx='70' cy='30' r='8' fill='%23bfbfbf'/%3E%3C/g%3E%3Ctext x='100' y='130' font-family='Arial, sans-serif' font-size='12' fill='%23999' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E";

  const columns = [
    {
      title: "Item",
      dataIndex: 'itemId',
      width: 250,
      render: (value, record, index) => (
        <div>
          <Form.Item style={{ marginBottom: 0 }}>
            {
              props.form.getFieldDecorator(`item[${index}]`, {
                rules: [
                  {
                    required: false,
                    message: 'Type to search or pick an item'
                  }
                ],
              })(
                <Select
                  showSearch
                  style={{ width: '100%' }}
                  placeholder="Type to search or pick an item"
                  onChange={(val) => updateRow(record.key, 'itemId', val)}
                  onSearch={onSearchItem}
                  filterOption={false}
                  notFoundContent={loading ? <Icon type="loading" /> : "No items found"}
                >
                  {items.map(item => (
                    <Option key={item.id} value={item.id}>
                      <Tooltip title={item.name} placement="right">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img 
                            src={item.thumbnail || item.image || '/placeholder-image.png'} 
                            alt={item.name}
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              objectFit: 'cover',
                              borderRadius: '4px',
                              flexShrink: 0
                            }}
                            onError={(e) => {
                              e.target.src = FALLBACK_IMAGE;
                            }}
                          />
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ 
                              fontWeight: 500,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}>
                              {item.name}
                            </div>
                            <small style={{ color: '#999' }}>
                              SKU: {Util.getProductSku(item)} | Stock: {Util.getQuantityOnHand(item)}
                            </small>
                          </div>
                        </div>
                      </Tooltip>
                    </Option>
                  ))}
                </Select>
              )
            }
          </Form.Item>
          {aiSuggestions[record.key] && (
            <Tag color="blue" style={{ marginTop: 4, fontSize: 11 }}>
              <Icon type="bulb" /> {aiSuggestions[record.key]}
            </Tag>
          )}
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
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`quantity[${index}]`, {
              rules: [
                {
                  required: false,
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
                placeholder="Enter quantity (pcs)"
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
      title: "Unit",
      dataIndex: 'unitId',
      width: 160,
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`unitId[${index}]`, value ? {
              rules: [
                {
                  required: false,
                  message: 'Please select unit'
                }
              ],
              initialValue: value
            } : {}
            )(
              <Select
                style={{ width: '100%' }}
                placeholder="Pick a Unit (pcs, box, kg...)"
                onChange={(val) => updateRow(record.key, 'unitId', val)}
              >
                {units.map(u => (
                  <Option key={u.id} value={u.id}>{u.name}</Option>
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
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`reason[${index}]`, {
              rules: [
                {
                  required: false,
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
                  <Option key={rs} value={rs}>
                    <Tooltip title={rs} placement="right">
                      {rs}
                    </Tooltip>
                  </Option>
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
      render: (value, record, index) => (
        <div>
          <Form.Item style={{ marginBottom: 4 }}>
            {
              props.form.getFieldDecorator(`batch[${index}]`, {
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
              props.form.getFieldDecorator(`expiry[${index}]`, {
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
      render: (value, record, index) => (
        <Form.Item style={{ marginBottom: 0 }}>
          {
            props.form.getFieldDecorator(`notes[${index}]`, {
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
    const totalItems = stockIOItems.filter(i => i.quantity > 0 && i.itemId).length;
    const totalQuantity = stockIOItems.filter(i => i.quantity > 0 && i.itemId).reduce((sum, item) => sum + (item.quantity || 0), 0);
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

  const handleSubmit = async () => {
    try {
      const value = await new Promise((resolve, reject) => {
        props.form.validateFields((err, values) => {
          if (err) return reject(err);
          resolve(values);
        });
      });
      setSubmitting(true);

      const payload = {
        type: value.movementType,
        name: "Stock In from Supplier",
        locationId: value.locationId,
        date: moment(value.date).format("YYYY-MM-DD HH:mm:ss"),
        description: value.referenceNo,
        quantity: value.quantity.reduce((sum, q) => sum + q, 0),
        amount: 0,
        status: 2,
        entries: value.item.map((id, index) => {
          const item = items.find(item => item.id === id);
          return {
            itemId: id,
            itemName: item?.name || "",
            variantId: Util.getVariantId(item),
            variantName: Util.getVariantName(item),
            unitId: value.unitId[index],
            unitName: units.find(unit => unit.id === value.unitId[index])?.name || "",
            quantity: value.quantity[index],
            reason: value.reason[index],
            batch: value.batch[index],
            expiryDate: moment(value.expiry[index]).isValid() ? moment(value.expiry[index]).format("YYYY-MM-DD") : null,
            notes: value.notes[index]
          };
        })
      };
      await StockIOService.stockIn(payload);

    } catch (error) {
      console.error("❌ Stock In Failed:", error);
    } finally {
      sweetalert({
        icon: "success",
        title: props.form.getFieldValue("movementType") === "IN" ? "Stock In Recorded" : "Stock Out Recorded",
        text: "Your stock quantity has been updated.",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        setSubmitting(false);
        setStockIOItems([]);
        props.form.resetFields();
      });
    }
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
        type: value.movementType,
        name: "Stock In from Supplier",
        locationId: value.locationId,
        date: moment(value.date).format("YYYY-MM-DD HH:mm:ss"),
        description: value.referenceNo,
        quantity: value.quantity.reduce((sum, q) => sum + q, 0),
        amount: 0,
        status: 0,
        entries: value.item.map((id, index) => {
          const item = items.find(item => item.id === id);
          return {
            itemId: id,
            itemName: item?.name || "",
            variantId: Util.getVariantId(item),
            variantName: Util.getVariantName(item),
            unitId: Util.getUnitId(item),
            unitName: Util.getUnitName(item),
            quantity: value.quantity[index],
            reason: value.reason[index],
            batch: value.batch[index],
            expiry: value.expiry[index],
            notes: value.notes[index]
          };
        })
      };

      await StockIOService.stockIn(payload);

    } catch (error) {
      console.error("❌ Stock In Failed:", error);
    } finally {
      sweetalert({
        icon: "success",
        title: "Stock In Recorded",
        text: "Your stock quantity has been updated.",
        buttons: false,
        timer: 1500
      })
      .then(() => {
        setSubmitting(false);
        setStockIOItems([]);
        props.form.resetFields();
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
                  props.form.getFieldDecorator("date", { 
                    rules: [{ required:  true }],
                    initialValue: moment(new Date())
                  })
                  (
                    <DatePicker
                      style={{ width: '100%' }}
                    />
                  )
                }
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="Warehouse">
                {
                  props.form.getFieldDecorator('locationId', {
                    rules: [
                      {
                        required: true,
                        message: 'Please select location'
                      }
                    ],
                    initialValue: getLocationId()
                  })(
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Select warehouse"
                      onChange={locationId => {
                        fetchItems(locationId)
                      }}
                    >
                      {warehouses.map(wh => (
                        <Option key={wh.id} value={wh.id}>{wh.name}</Option>
                      ))}
                    </Select>
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
                    <Tag color="blue" style={{ marginBottom: 4 }}>
                      {warehouses.find(wh => wh.id === Number(props.form.getFieldValue("locationId")))?.name ?? 'Unknown'}: {summary.totalQuantity} units
                    </Tag>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Action Buttons */}
          <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              size="large"
              onClick={handleDraftSubmit}
              disabled={stockIOItems.filter(i => i.itemId).length === 0}
            >
              Save as Draft
            </Button>
            <Button
              type="primary"
              size="large"
              icon="check"
              onClick={handleSubmit}
              loading={submitting}
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