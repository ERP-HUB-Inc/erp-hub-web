import React, { useState, useRef } from 'react';
import { Card, Table, Input, Button, Drawer, Statistic, Row, Col, InputNumber, Tag, message, Divider, Modal, Upload, Icon, Alert, Steps } from 'antd';
import 'antd/dist/antd.css';

const StockIOAIImport = () => {
  const [stockData, setStockData] = useState([
    {
      key: '1',
      id: '1',
      name: 'IRVNS តែបៃតង កញ្ចប់ធំ 105g',
      barcode: '8885015022115',
      category: 'Banana',
      currentStock: 25.00,
      qtyIn: 0,
      image: '📱'
    },
    {
      key: '2',
      id: '2',
      name: 'OREO Peant butter and Chocolate flavor នំសំណ',
      barcode: '8992760121090',
      category: 'Uncategorized',
      currentStock: -7.00,
      qtyIn: 0,
      image: '📱'
    },
    {
      key: '3',
      id: '3',
      name: 'System Unit Dell Dell (VGAដំឡើង) T5810',
      barcode: '000002',
      category: 'Uncategorized',
      currentStock: 0.00,
      qtyIn: 0,
      image: '💻'
    },
    {
      key: '4',
      id: '4',
      name: 'កាតប្រយុទ្ធ',
      barcode: 'កាមុយដូ',
      category: 'Access Control',
      currentStock: -1.00,
      qtyIn: 0,
      image: '📱'
    },
    {
      key: '5',
      id: '5',
      name: 'ឡំពុទ្ធកម្ពុជា',
      barcode: '445018',
      category: 'Uncategorized',
      currentStock: 0.00,
      qtyIn: 0,
      image: '📦'
    }
  ]);

  const [drawerVisible, setDrawerVisible] = useState(false);
  const [printModalVisible, setPrintModalVisible] = useState(false);
  const [stockInData, setStockInData] = useState(null);
  const [barcodeBuffer, setBarcodeBuffer] = useState('');
  const [barcodeTimeout, setBarcodeTimeout] = useState(null);
  const [bulkImportVisible, setBulkImportVisible] = useState(false);
  const [importStep, setImportStep] = useState(0);
  const [importedData, setImportedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState([]);
  const [aiImportVisible, setAiImportVisible] = useState(false);
  const [isProUser, setIsProUser] = useState(true); // Set to true to test Pro features
  const [upgradeVisible, setUpgradeVisible] = useState(false);
  const [aiProcessing, setAiProcessing] = useState(false);
  const [aiExtractedData, setAiExtractedData] = useState(null);
  const [aiGenerateVisible, setAiGenerateVisible] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [generationPrompt, setGenerationPrompt] = useState('');
  const [generatedItems, setGeneratedItems] = useState([]);
  const printRef = useRef();

  // Barcode scanner listener
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      // Ignore if user is typing in an input field
      if (e.target.tagName === 'INPUT' && e.target.type !== 'number') {
        return;
      }

      // Clear previous timeout
      if (barcodeTimeout) {
        clearTimeout(barcodeTimeout);
      }

      // Add character to buffer
      if (e.key.length === 1) {
        const newBuffer = barcodeBuffer + e.key;
        setBarcodeBuffer(newBuffer);

        // Set timeout to process barcode (barcode scanners are fast, typically < 100ms between chars)
        const timeout = setTimeout(() => {
          if (newBuffer.length > 3) { // Minimum barcode length
            handleBarcodeScanned(newBuffer);
          }
          setBarcodeBuffer('');
        }, 100);

        setBarcodeTimeout(timeout);
      }
    };

    window.addEventListener('keypress', handleKeyPress);

    return () => {
      window.removeEventListener('keypress', handleKeyPress);
      if (barcodeTimeout) {
        clearTimeout(barcodeTimeout);
      }
    };
  }, [barcodeBuffer, barcodeTimeout]);

  const handleBarcodeScanned = (barcode) => {
    const trimmedBarcode = barcode.trim();
    
    // Find item by barcode
    const item = stockData.find(item => 
      item.barcode.toLowerCase() === trimmedBarcode.toLowerCase()
    );

    if (item) {
      // Increment quantity by 1
      handleQtyChange((item.qtyIn || 0) + 1, item);
      message.success(`${item.name} - Qty increased to ${(item.qtyIn || 0) + 1}`);
    } else {
      message.warning(`Item with barcode "${trimmedBarcode}" not found`);
    }
  };

  const handleQtyChange = (value, record) => {
    const newData = stockData.map(item => {
      if (item.key === record.key) {
        return { ...item, qtyIn: value || 0 };
      }
      return item;
    });
    setStockData(newData);
  };

  const getTotalItems = () => {
    return stockData.filter(item => item.qtyIn > 0).length;
  };

  const getTotalQuantity = () => {
    return stockData.reduce((sum, item) => sum + (item.qtyIn || 0), 0);
  };

  const getItemsToStockIn = () => {
    return stockData.filter(item => item.qtyIn > 0);
  };

  const handleConfirmStockIn = () => {
    const items = getItemsToStockIn();
    if (items.length === 0) {
      message.warning('Please add quantity to at least one item');
      return;
    }
    setDrawerVisible(true);
  };

  const handleFinalConfirm = () => {
    const items = getItemsToStockIn();
    
    // Store stock in data for printing
    const stockInRecord = {
      date: new Date().toLocaleString(),
      items: items,
      totalItems: items.length,
      totalQuantity: getTotalQuantity()
    };
    
    // Update stock data
    const newData = stockData.map(item => {
      const stockInItem = items.find(i => i.key === item.key);
      if (stockInItem) {
        return {
          ...item,
          currentStock: item.currentStock + item.qtyIn,
          qtyIn: 0
        };
      }
      return item;
    });
    
    setStockData(newData);
    setStockInData(stockInRecord);
    setDrawerVisible(false);
    message.success(`Successfully stocked in ${items.length} items with total quantity of ${getTotalQuantity()}`);
  };

  const handlePrintSlip = () => {
    const items = getItemsToStockIn();
    if (items.length === 0) {
      message.warning('No items to print');
      return;
    }
    
    const stockInRecord = {
      date: new Date().toLocaleString(),
      items: items,
      totalItems: items.length,
      totalQuantity: getTotalQuantity()
    };
    
    setStockInData(stockInRecord);
    setPrintModalVisible(true);
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Stock IN Slip</title>');
    printWindow.document.write('<style>');
    printWindow.document.write(`
      body { font-family: Arial, sans-serif; padding: 20px; }
      .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
      .header h1 { margin: 0; font-size: 28px; }
      .header p { margin: 5px 0; color: #666; }
      .info-section { margin-bottom: 20px; }
      .info-row { display: flex; justify-content: space-between; margin: 8px 0; }
      .info-label { font-weight: bold; }
      table { width: 100%; border-collapse: collapse; margin: 20px 0; }
      th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
      th { background-color: #f5f5f5; font-weight: bold; }
      .text-right { text-align: right; }
      .text-center { text-align: center; }
      .total-row { font-weight: bold; background-color: #f0f0f0; }
      .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; }
      .signature-section { display: flex; justify-content: space-between; margin-top: 60px; }
      .signature-box { text-align: center; width: 40%; }
      .signature-line { border-top: 1px solid #000; padding-top: 5px; margin-top: 50px; }
      @media print {
        body { padding: 10px; }
        button { display: none; }
      }
    `);
    printWindow.document.write('</style></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
  };

  const handleFileUpload = (file) => {
    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop().toLowerCase();

    reader.onload = (e) => {
      try {
        if (fileExtension === 'csv') {
          parseCSV(e.target.result);
        } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
          message.info('Excel parsing would require XLSX library. For demo, using CSV format.');
          // In production, you would use a library like 'xlsx' or 'sheetjs'
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

    return false; // Prevent default upload behavior
  };

  const parseCSV = (csvText) => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const barcodeIndex = headers.findIndex(h => h.includes('barcode') || h.includes('code'));
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

      const item = stockData.find(item => 
        item.barcode.toLowerCase() === barcode.toLowerCase()
      );

      if (item) {
        imported.push({
          ...item,
          importQty: qty,
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

  const handleApplyImport = () => {
    const newData = stockData.map(item => {
      const importedItem = importedData.find(imp => imp.key === item.key);
      if (importedItem) {
        return {
          ...item,
          qtyIn: (item.qtyIn || 0) + importedItem.importQty
        };
      }
      return item;
    });

    setStockData(newData);
    setBulkImportVisible(false);
    setImportStep(0);
    setImportedData([]);
    setValidationErrors([]);
    message.success(`Imported ${importedData.length} items successfully!`);
  };

  const downloadTemplate = () => {
    const template = 'barcode,qty\n8885015022115,10\n8992760121090,5\n000002,3';
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stock_in_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleAiImportClick = () => {
    if (!isProUser) {
      setUpgradeVisible(true);
    } else {
      setAiImportVisible(true);
    }
  };

  const handleAiFileUpload = (file) => {
    if (!isProUser) {
      message.error('This feature requires Pro plan');
      return false;
    }

    setAiProcessing(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Mock AI extracted data
      const mockExtracted = {
        documentType: 'Purchase Order',
        documentNumber: 'PO-2025-001234',
        date: '2025-10-12',
        supplier: 'ABC Supply Co.',
        items: [
          {
            description: 'IRVNS តែបៃតង កញ្ចប់ធំ 105g',
            barcode: '8885015022115',
            quantity: 50,
            confidence: 0.95,
            matched: true
          },
          {
            description: 'OREO Chocolate flavor',
            barcode: '8992760121090',
            quantity: 30,
            confidence: 0.88,
            matched: true
          },
          {
            description: 'Dell Computer System',
            barcode: '000002',
            quantity: 2,
            confidence: 0.75,
            matched: true
          }
        ],
        rawText: file.name
      };

      setAiExtractedData(mockExtracted);
      setAiProcessing(false);
      message.success('AI successfully extracted data from document!');
    }, 3000);

    return false;
  };

  const handleApplyAiExtraction = () => {
    const validItems = aiExtractedData.items.filter(item => item.matched);
    
    const newData = stockData.map(item => {
      const extractedItem = validItems.find(ext => ext.barcode === item.barcode);
      if (extractedItem) {
        return {
          ...item,
          qtyIn: (item.qtyIn || 0) + extractedItem.quantity
        };
      }
      return item;
    });

    setStockData(newData);
    setAiImportVisible(false);
    setAiExtractedData(null);
    message.success(`AI imported ${validItems.length} items successfully!`);
  };

  const handleAiGenerateClick = () => {
    if (!isProUser) {
      setUpgradeVisible(true);
    } else {
      setAiGenerateVisible(true);
    }
  };

  const handleAiGenerate = () => {
    if (!generationPrompt.trim()) {
      message.warning('Please enter a description');
      return;
    }

    setAiGenerating(true);

    // Simulate AI generation
    setTimeout(() => {
      const mockGenerated = [
        {
          key: 'gen_' + Date.now() + '_1',
          id: 'AI_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: 'Premium Green Tea Matcha Latte Mix 250g',
          barcode: 'AI' + Math.random().toString().substr(2, 12),
          category: 'Beverages',
          currentStock: 0,
          qtyIn: 0,
          image: '🍵',
          isNew: true
        },
        {
          key: 'gen_' + Date.now() + '_2',
          id: 'AI_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: 'Organic Matcha Green Tea Powder 100g',
          barcode: 'AI' + Math.random().toString().substr(2, 12),
          category: 'Beverages',
          currentStock: 0,
          qtyIn: 0,
          image: '🍵',
          isNew: true
        },
        {
          key: 'gen_' + Date.now() + '_3',
          id: 'AI_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: 'Japanese Ceremonial Matcha Tea Set',
          barcode: 'AI' + Math.random().toString().substr(2, 12),
          category: 'Tea Accessories',
          currentStock: 0,
          qtyIn: 0,
          image: '🫖',
          isNew: true
        }
      ];

      setGeneratedItems(mockGenerated);
      setAiGenerating(false);
      message.success('AI generated 3 product suggestions!');
    }, 2500);
  };

  const handleApplyGeneratedItems = () => {
    const selectedItems = generatedItems.filter(item => item.selected);
    
    if (selectedItems.length === 0) {
      message.warning('Please select at least one item to add');
      return;
    }

    const newStockData = [...stockData, ...selectedItems.map(item => ({
      ...item,
      selected: undefined,
      isNew: undefined
    }))];

    setStockData(newStockData);
    setAiGenerateVisible(false);
    setGeneratedItems([]);
    setGenerationPrompt('');
    message.success(`Added ${selectedItems.length} new items to inventory!`);
  };

  const toggleItemSelection = (key) => {
    setGeneratedItems(generatedItems.map(item => 
      item.key === key ? { ...item, selected: !item.selected } : item
    ));
  };

  const columns = [
    {
      title: 'Item Info',
      dataIndex: 'name',
      key: 'name',
      width: '40%',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '24px' }}>{record.image}</div>
          <div>
            <div style={{ fontWeight: 500, marginBottom: '4px' }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>
              {record.barcode} • {record.category}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Stock on Hand',
      dataIndex: 'currentStock',
      key: 'currentStock',
      width: '15%',
      align: 'right',
      render: (value) => (
        <span style={{ 
          color: value < 0 ? '#f5222d' : value === 0 ? '#faad14' : '#000',
          fontWeight: 500 
        }}>
          {value.toFixed(2)}
        </span>
      )
    },
    {
      title: 'Qty IN',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      width: '20%',
      render: (value, record) => (
        <InputNumber
          min={0}
          value={value}
          onChange={(val) => handleQtyChange(val, record)}
          style={{ width: '100%' }}
          placeholder="0.00"
        />
      )
    },
    {
      title: 'Expected Stock',
      key: 'expectedStock',
      width: '15%',
      align: 'right',
      render: (_, record) => {
        const expected = record.currentStock + (record.qtyIn || 0);
        return (
          <span style={{ 
            color: expected < 0 ? '#f5222d' : '#52c41a',
            fontWeight: 500 
          }}>
            {expected > record.currentStock && record.qtyIn > 0 && '+'}
            {expected.toFixed(2)}
          </span>
        );
      }
    }
  ];

  const drawerColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ fontSize: '20px' }}>{record.image}</div>
          <div>
            <div style={{ fontWeight: 500 }}>{text}</div>
            <div style={{ fontSize: '12px', color: '#888' }}>{record.barcode}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Current',
      dataIndex: 'currentStock',
      key: 'currentStock',
      align: 'right',
      render: (value) => <span>{value.toFixed(2)}</span>
    },
    {
      title: 'Qty IN',
      dataIndex: 'qtyIn',
      key: 'qtyIn',
      align: 'right',
      render: (value) => (
        <Tag color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
          +{value.toFixed(2)}
        </Tag>
      )
    },
    {
      title: 'New Stock',
      key: 'newStock',
      align: 'right',
      render: (_, record) => (
        <span style={{ color: '#52c41a', fontWeight: 600 }}>
          {(record.currentStock + record.qtyIn).toFixed(2)}
        </span>
      )
    }
  ];

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>Stock IN Management</h1>
          <p style={{ margin: '4px 0 0 0', color: '#888' }}>Add quantities to stock in items</p>
        </div>
        <div>
          <Button 
            type="default" 
            size="large"
            icon="robot"
            onClick={handleAiImportClick}
            style={{ marginRight: '12px' }}
          >
            <span>🤖 AI Smart Import</span>
            {!isProUser && (
              <Tag color="gold" style={{ marginLeft: '8px' }}>PRO</Tag>
            )}
          </Button>
          <Button 
            type="dashed" 
            size="large"
            icon="upload"
            onClick={() => setBulkImportVisible(true)}
          >
            Bulk Import Stock IN
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <Card style={{ marginBottom: '100px' }}>
        {/* Table Actions */}
        <div style={{ 
          marginBottom: '16px', 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 16px',
          background: '#fafafa',
          borderRadius: '4px'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 500 }}>
            Stock Items ({stockData.length})
          </div>
          <div>
            <Button
              type="primary"
              icon="bulb"
              onClick={handleAiGenerateClick}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none'
              }}
            >
              🤖 AI Generate Products
              {!isProUser && (
                <Tag color="gold" style={{ marginLeft: '8px' }}>PRO</Tag>
              )}
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={stockData}
          pagination={false}
          size="middle"
        />
      </Card>

      {/* Sticky Summary Bar at Bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: '#fff',
        boxShadow: '0 -2px 8px rgba(0,0,0,0.15)',
        zIndex: 999,
        padding: '16px 24px',
        borderTop: '1px solid #e8e8e8'
      }}>
        <Row gutter={24} align="middle">
          <Col span={6}>
            <Statistic
              title="Total Items to Stock IN"
              value={getTotalItems()}
              suffix={`/ ${stockData.length}`}
              valueStyle={{ color: '#1890ff', fontWeight: 600, fontSize: '20px' }}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Total Quantity"
              value={getTotalQuantity()}
              precision={2}
              valueStyle={{ color: '#52c41a', fontWeight: 600, fontSize: '20px' }}
            />
          </Col>
          <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="primary"
              size="large"
              onClick={handleConfirmStockIn}
              disabled={getTotalItems() === 0}
              style={{ width: '250px', height: '48px', fontSize: '16px' }}
            >
              Review & Confirm Stock IN
            </Button>
          </Col>
        </Row>
      </div>

      {/* Confirmation Drawer */}
      <Drawer
        title="Confirm Stock IN"
        placement="right"
        width={720}
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button 
              onClick={() => setDrawerVisible(false)} 
              size="large"
              style={{ marginRight: 12, width: '150px' }}
            >
              Cancel
            </Button>
            <Button 
              type="primary" 
              onClick={handleFinalConfirm}
              size="large"
              style={{ width: '200px' }}
            >
              Confirm Stock IN
            </Button>
          </div>
        }
      >
        {/* Summary Section */}
        <Card style={{ marginBottom: '24px', background: '#f6ffed', borderColor: '#b7eb8f' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic
                title="Items to Stock IN"
                value={getTotalItems()}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
              />
            </Col>
            <Col span={12}>
              <Statistic
                title="Total Quantity"
                value={getTotalQuantity()}
                precision={2}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 600 }}
              />
            </Col>
          </Row>
        </Card>

        <Divider orientation="left">Items Details</Divider>

        {/* Items Detail Table */}
        <Table
          columns={drawerColumns}
          dataSource={getItemsToStockIn()}
          pagination={false}
          size="small"
        />

        <div style={{ 
          marginTop: '24px', 
          padding: '16px', 
          background: '#fffbe6', 
          border: '1px solid #ffe58f',
          borderRadius: '4px'
        }}>
          <strong>⚠️ Important:</strong> Once confirmed, the stock quantities will be updated and cannot be undone. Please review carefully before confirming.
        </div>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Button 
            onClick={() => setDrawerVisible(false)} 
            size="large"
            style={{ marginRight: 12, width: '150px' }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handlePrintSlip}
            size="large"
            style={{ marginRight: 12, width: '180px' }}
          >
            Print Stock IN Slip
          </Button>
          <Button 
            type="primary" 
            onClick={handleFinalConfirm}
            size="large"
            style={{ width: '200px' }}
          >
            Confirm Stock IN
          </Button>
        </div>
      </Drawer>

      {/* Print Modal */}
      <Modal
        title="Stock IN Slip Preview"
        visible={printModalVisible}
        onCancel={() => setPrintModalVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setPrintModalVisible(false)}>
            Close
          </Button>,
          <Button key="print" type="primary" onClick={handlePrint}>
            Print
          </Button>
        ]}
      >
        <div ref={printRef}>
          {/* Header */}
          <div className="header">
            <h1>STOCK IN SLIP</h1>
            <p>Items Management System</p>
            <p style={{ fontSize: '12px', color: '#888' }}>Stock Receiving Document</p>
          </div>

          {/* Document Info */}
          <div className="info-section">
            <div className="info-row">
              <span className="info-label">Document No:</span>
              <span>SI-{new Date().getTime().toString().slice(-8)}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Date & Time:</span>
              <span>{stockInData?.date || new Date().toLocaleString()}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Received By:</span>
              <span>____________________________</span>
            </div>
          </div>

          <Divider />

          {/* Items Table */}
          <table>
            <thead>
              <tr>
                <th style={{ width: '5%' }}>No.</th>
                <th style={{ width: '40%' }}>Item Description</th>
                <th style={{ width: '20%' }}>Barcode</th>
                <th className="text-right" style={{ width: '15%' }}>Previous Stock</th>
                <th className="text-right" style={{ width: '10%' }}>Qty IN</th>
                <th className="text-right" style={{ width: '10%' }}>New Stock</th>
              </tr>
            </thead>
            <tbody>
              {stockInData?.items.map((item, index) => (
                <tr key={item.key}>
                  <td className="text-center">{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.barcode}</td>
                  <td className="text-right">{item.currentStock.toFixed(2)}</td>
                  <td className="text-right" style={{ fontWeight: 'bold', color: '#1890ff' }}>
                    {item.qtyIn.toFixed(2)}
                  </td>
                  <td className="text-right" style={{ fontWeight: 'bold', color: '#52c41a' }}>
                    {(item.currentStock + item.qtyIn).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr className="total-row">
                <td colSpan="4" className="text-right">TOTAL:</td>
                <td className="text-right">{stockInData?.totalQuantity.toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>

          {/* Summary */}
          <div style={{ 
            background: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px',
            marginTop: '20px'
          }}>
            <div className="info-row">
              <span className="info-label">Total Items:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{stockInData?.totalItems}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Quantity Received:</span>
              <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#52c41a' }}>
                {stockInData?.totalQuantity.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Signature Section */}
          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-line">
                Prepared By
              </div>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>Name & Signature</p>
            </div>
            <div className="signature-box">
              <div className="signature-line">
                Approved By
              </div>
              <p style={{ margin: '5px 0', fontSize: '12px', color: '#888' }}>Name & Signature</p>
            </div>
          </div>

          {/* Footer */}
          <div className="footer" style={{ textAlign: 'center', fontSize: '11px', color: '#999' }}>
            <p>This is a computer-generated document. No signature is required.</p>
            <p>For any inquiries, please contact the inventory department.</p>
          </div>
        </div>
      </Modal>

      {/* Bulk Import Modal */}
      <Modal
        title="Bulk Import Stock IN"
        visible={bulkImportVisible}
        onCancel={() => {
          setBulkImportVisible(false);
          setImportStep(0);
          setImportedData([]);
          setValidationErrors([]);
        }}
        width={900}
        footer={null}
      >
        <Steps current={importStep} style={{ marginBottom: '24px' }}>
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
                  <p><strong>CSV Format Required:</strong></p>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>Column headers: <code>barcode</code>, <code>qty</code></li>
                    <li>One item per row</li>
                    <li>Barcode must match existing items</li>
                    <li>Quantity must be a positive number</li>
                  </ul>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Upload.Dragger
                beforeUpload={handleFileUpload}
                accept=".csv,.xlsx,.xls"
                showUploadList={false}
                style={{ padding: '40px' }}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" style={{ fontSize: '48px', color: '#1890ff' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '16px' }}>
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                  Support for CSV and Excel files (.csv, .xlsx, .xls)
                </p>
              </Upload.Dragger>

              <Divider>OR</Divider>

              <Button 
                icon="download" 
                onClick={downloadTemplate}
                size="large"
              >
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
                  <div style={{ maxHeight: '120px', overflow: 'auto' }}>
                    {validationErrors.map((err, idx) => (
                      <div key={idx} style={{ fontSize: '12px' }}>• {err}</div>
                    ))}
                  </div>
                }
                type="warning"
                showIcon
                style={{ marginBottom: '16px' }}
                closable
              />
            )}

            {importedData.length > 0 && (
              <>
                <Alert
                  message={`Successfully validated ${importedData.length} items`}
                  type="success"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />

                <Table
                  dataSource={importedData}
                  pagination={false}
                  scroll={{ y: 300 }}
                  size="small"
                  rowKey="key"
                  columns={[
                    {
                      title: 'Line',
                      dataIndex: 'lineNumber',
                      width: '60px',
                      align: 'center'
                    },
                    {
                      title: 'Item Name',
                      dataIndex: 'name',
                      render: (text, record) => (
                        <div>
                          <div>{text}</div>
                          <div style={{ fontSize: '12px', color: '#888' }}>
                            {record.barcode}
                          </div>
                        </div>
                      )
                    },
                    {
                      title: 'Current Stock',
                      dataIndex: 'currentStock',
                      width: '120px',
                      align: 'right',
                      render: (val) => val.toFixed(2)
                    },
                    {
                      title: 'Import Qty',
                      dataIndex: 'importQty',
                      width: '100px',
                      align: 'right',
                      render: (val) => (
                        <Tag color="blue">+{val.toFixed(2)}</Tag>
                      )
                    },
                    {
                      title: 'New Stock',
                      width: '120px',
                      align: 'right',
                      render: (_, record) => (
                        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
                          {(record.currentStock + record.importQty).toFixed(2)}
                        </span>
                      )
                    }
                  ]}
                />

                <div style={{ 
                  marginTop: '24px', 
                  textAlign: 'center',
                  padding: '20px',
                  background: '#f6ffed',
                  borderRadius: '4px'
                }}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Statistic
                        title="Total Items"
                        value={importedData.length}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="Total Quantity"
                        value={importedData.reduce((sum, item) => sum + item.importQty, 0)}
                        precision={2}
                        valueStyle={{ color: '#52c41a' }}
                      />
                    </Col>
                  </Row>
                </div>

                <div style={{ marginTop: '24px', textAlign: 'right' }}>
                  <Button 
                    onClick={() => {
                      setImportStep(0);
                      setImportedData([]);
                      setValidationErrors([]);
                    }}
                    style={{ marginRight: '8px' }}
                  >
                    Back
                  </Button>
                  <Button 
                    type="primary" 
                    onClick={handleApplyImport}
                    size="large"
                  >
                    Apply Import to Stock IN
                  </Button>
                </div>
              </>
            )}

            {importedData.length === 0 && validationErrors.length > 0 && (
              <div style={{ textAlign: 'center', marginTop: '24px' }}>
                <Button onClick={() => setImportStep(0)}>
                  Back to Upload
                </Button>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* AI Smart Import Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '24px' }}>🤖</span>
            <span>AI Smart Import - Purchase Order Reader</span>
            <Tag color="gold">PRO</Tag>
          </div>
        }
        visible={aiImportVisible}
        onCancel={() => {
          setAiImportVisible(false);
          setAiExtractedData(null);
          setAiProcessing(false);
        }}
        width={1000}
        footer={null}
      >
        {!aiExtractedData && !aiProcessing && (
          <div>
            <Alert
              message="✨ AI-Powered Document Reading"
              description={
                <div>
                  <p><strong>Our AI can automatically extract stock information from:</strong></p>
                  <ul style={{ marginLeft: '20px', marginTop: '12px' }}>
                    <li>📄 Purchase Orders (PO)</li>
                    <li>📋 Delivery Notes / Packing Lists</li>
                    <li>📊 Supplier Invoices</li>
                    <li>📑 Inventory Transfer Documents</li>
                    <li>🖼️ Scanned Documents & Images (PDF, JPG, PNG)</li>
                  </ul>
                  <p style={{ marginTop: '12px' }}>
                    <strong>The AI will intelligently:</strong>
                  </p>
                  <ul style={{ marginLeft: '20px' }}>
                    <li>🔍 Extract item descriptions, barcodes, and quantities</li>
                    <li>🎯 Match items with your existing inventory</li>
                    <li>✅ Validate and highlight confidence scores</li>
                    <li>⚡ Save hours of manual data entry</li>
                  </ul>
                </div>
              }
              type="info"
              showIcon
              style={{ marginBottom: '24px' }}
            />

            <div style={{ textAlign: 'center', padding: '40px' }}>
              <Upload.Dragger
                beforeUpload={handleAiFileUpload}
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                showUploadList={false}
                style={{ padding: '60px' }}
              >
                <p className="ant-upload-drag-icon">
                  <Icon type="file-text" style={{ fontSize: '64px', color: '#faad14' }} />
                </p>
                <p className="ant-upload-text" style={{ fontSize: '18px', fontWeight: 500 }}>
                  Drop your Purchase Order or Document here
                </p>
                <p className="ant-upload-hint" style={{ fontSize: '14px' }}>
                  Support for PDF, Images (JPG, PNG), Word documents
                </p>
                <p style={{ marginTop: '16px', color: '#faad14', fontWeight: 500 }}>
                  🤖 AI will automatically read and extract all items
                </p>
              </Upload.Dragger>
            </div>
          </div>
        )}

        {aiProcessing && (
          <div style={{ textAlign: 'center', padding: '80px 40px' }}>
            <Icon type="loading" style={{ fontSize: '48px', color: '#1890ff' }} />
            <h3 style={{ marginTop: '24px', fontSize: '18px' }}>AI is analyzing your document...</h3>
            <p style={{ color: '#888', marginTop: '12px' }}>
              Reading text, identifying items, matching with inventory
            </p>
            <div style={{ marginTop: '24px' }}>
              <Tag color="processing">Extracting Text</Tag>
              <Tag color="processing">Identifying Items</Tag>
              <Tag color="processing">Matching Barcodes</Tag>
            </div>
          </div>
        )}

        {aiExtractedData && !aiProcessing && (
          <div>
            <Card style={{ marginBottom: '24px', background: '#fffbe6', borderColor: '#ffe58f' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Document Type</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {aiExtractedData.documentType}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Document No.</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {aiExtractedData.documentNumber}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Date</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {aiExtractedData.date}
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ fontSize: '12px', color: '#888' }}>Supplier</div>
                  <div style={{ fontSize: '16px', fontWeight: 600 }}>
                    {aiExtractedData.supplier}
                  </div>
                </Col>
              </Row>
            </Card>

            <Alert
              message={`AI extracted ${aiExtractedData.items.length} items from document`}
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />

            <Table
              dataSource={aiExtractedData.items.map((item, idx) => ({ ...item, key: idx }))}
              pagination={false}
              scroll={{ y: 300 }}
              size="small"
              columns={[
                {
                  title: 'Status',
                  width: '80px',
                  align: 'center',
                  render: (_, record) => (
                    record.matched ? 
                      <Icon type="check-circle" style={{ color: '#52c41a', fontSize: '20px' }} /> :
                      <Icon type="exclamation-circle" style={{ color: '#faad14', fontSize: '20px' }} />
                  )
                },
                {
                  title: 'Description',
                  dataIndex: 'description',
                  render: (text, record) => (
                    <div>
                      <div>{text}</div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        Barcode: {record.barcode}
                      </div>
                    </div>
                  )
                },
                {
                  title: 'Quantity',
                  dataIndex: 'quantity',
                  width: '100px',
                  align: 'right',
                  render: (val) => <Tag color="blue" style={{ fontSize: '14px' }}>+{val}</Tag>
                },
                {
                  title: 'AI Confidence',
                  dataIndex: 'confidence',
                  width: '140px',
                  align: 'center',
                  render: (val) => {
                    const color = val >= 0.9 ? '#52c41a' : val >= 0.7 ? '#faad14' : '#ff4d4f';
                    return (
                      <div>
                        <div style={{ 
                          width: '100%', 
                          height: '8px', 
                          background: '#f0f0f0', 
                          borderRadius: '4px',
                          overflow: 'hidden'
                        }}>
                          <div style={{ 
                            width: `${val * 100}%`, 
                            height: '100%', 
                            background: color,
                            transition: 'width 0.3s'
                          }} />
                        </div>
                        <div style={{ fontSize: '12px', marginTop: '4px', color }}>
                          {(val * 100).toFixed(0)}%
                        </div>
                      </div>
                    );
                  }
                }
              ]}
            />

            <div style={{ 
              marginTop: '24px', 
              padding: '20px',
              background: '#f6ffed',
              borderRadius: '4px'
            }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Statistic
                    title="Items Extracted"
                    value={aiExtractedData.items.length}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Successfully Matched"
                    value={aiExtractedData.items.filter(i => i.matched).length}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
                <Col span={8}>
                  <Statistic
                    title="Total Quantity"
                    value={aiExtractedData.items.reduce((sum, item) => sum + item.quantity, 0)}
                    valueStyle={{ color: '#52c41a' }}
                  />
                </Col>
              </Row>
            </div>

            <div style={{ marginTop: '24px', textAlign: 'right' }}>
              <Button 
                onClick={() => {
                  setAiExtractedData(null);
                }}
                style={{ marginRight: '8px' }}
              >
                Upload Another Document
              </Button>
              <Button 
                type="primary" 
                onClick={handleApplyAiExtraction}
                size="large"
                icon="check"
              >
                Apply AI Extracted Data
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Upgrade to Pro Modal */}
      <Modal
        visible={upgradeVisible}
        onCancel={() => setUpgradeVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚀</div>
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>Upgrade to Pro Plan</h2>
          <p style={{ fontSize: '16px', color: '#666', marginBottom: '32px' }}>
            Unlock AI-powered document reading and save hours of manual data entry
          </p>

          <Card style={{ textAlign: 'left', marginBottom: '24px' }}>
            <h3 style={{ marginTop: 0 }}>Pro Plan Features:</h3>
            <div style={{ marginLeft: '20px' }}>
              {[
                '🤖 AI Smart Import - Read Purchase Orders automatically',
                '📄 Support for PDF, Images, Word documents',
                '🎯 Intelligent item matching with high accuracy',
                '⚡ 10x faster than manual entry',
                '📊 Advanced analytics and reporting',
                '🔒 Priority support',
                '☁️ Unlimited cloud storage'
              ].map((feature, idx) => (
                <div key={idx} style={{ padding: '8px 0', fontSize: '15px' }}>
                  {feature}
                </div>
              ))}
            </div>
          </Card>

          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '32px',
            borderRadius: '8px',
            marginBottom: '24px'
          }}>
            <div style={{ fontSize: '14px', opacity: 0.9 }}>Starting from</div>
            <div style={{ fontSize: '48px', fontWeight: 'bold' }}>$29</div>
            <div style={{ fontSize: '16px', opacity: 0.9 }}>per month</div>
          </div>

          <Button 
            type="primary" 
            size="large" 
            style={{ 
              width: '100%',
              height: '56px',
              fontSize: '18px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none'
            }}
            onClick={() => {
              message.success('Redirecting to upgrade page...');
              // In production: window.location.href = '/upgrade';
            }}
          >
            Upgrade to Pro Now
          </Button>

          <div style={{ marginTop: '16px', fontSize: '12px', color: '#888' }}>
            30-day money-back guarantee • Cancel anytime
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StockIOAIImport;