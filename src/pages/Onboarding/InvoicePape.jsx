import React, { useState } from 'react';
import { Card, Table, Button, Row, Col, Statistic, Icon, Tag, Select, DatePicker, Input, Menu, Dropdown, Badge, Tooltip, Progress } from 'antd';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const InvoicingPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchText, setSearchText] = useState('');

  // Statistics data
  const statisticsData = {
    totalInvoices: 1247,
    totalAmount: 485672.50,
    paidAmount: 398245.75,
    overdueAmount: 42850.25,
    draftCount: 23,
    sentCount: 156,
    paidCount: 1034,
    overdueCount: 34
  };

  // Sample invoice data
  const invoiceData = [
    {
      key: '1',
      invoiceNumber: 'INV-2024-001',
      customer: 'Acme Corporation',
      customerEmail: 'billing@acme.com',
      amount: 12500.00,
      status: 'paid',
      issueDate: '2024-09-15',
      dueDate: '2024-10-15',
      paidDate: '2024-10-12',
      description: 'Software License & Support',
      paymentMethod: 'Bank Transfer'
    },
    {
      key: '2',
      invoiceNumber: 'INV-2024-002',
      customer: 'Tech Solutions Inc.',
      customerEmail: 'accounts@techsol.com',
      amount: 8750.50,
      status: 'overdue',
      issueDate: '2024-08-20',
      dueDate: '2024-09-20',
      paidDate: null,
      description: 'Consulting Services Q3',
      paymentMethod: null
    },
    {
      key: '3',
      invoiceNumber: 'INV-2024-003',
      customer: 'Global Enterprises',
      customerEmail: 'finance@global.com',
      amount: 15200.00,
      status: 'sent',
      issueDate: '2024-09-25',
      dueDate: '2024-10-25',
      paidDate: null,
      description: 'Product Implementation',
      paymentMethod: null
    },
    {
      key: '4',
      invoiceNumber: 'INV-2024-004',
      customer: 'Startup Hub',
      customerEmail: 'admin@startuphub.com',
      amount: 3450.00,
      status: 'draft',
      issueDate: '2024-09-27',
      dueDate: '2024-10-27',
      paidDate: null,
      description: 'Monthly Subscription',
      paymentMethod: null
    },
    {
      key: '5',
      invoiceNumber: 'INV-2024-005',
      customer: 'Manufacturing Co.',
      customerEmail: 'billing@manufacturing.com',
      amount: 22100.75,
      status: 'sent',
      issueDate: '2024-09-20',
      dueDate: '2024-10-20',
      paidDate: null,
      description: 'ERP System Integration',
      paymentMethod: null
    },
    {
      key: '6',
      invoiceNumber: 'INV-2024-006',
      customer: 'Retail Chain Ltd.',
      customerEmail: 'accounts@retailchain.com',
      amount: 7890.25,
      status: 'paid',
      issueDate: '2024-09-10',
      dueDate: '2024-10-10',
      paidDate: '2024-10-08',
      description: 'POS System Setup',
      paymentMethod: 'Credit Card'
    }
  ];

  const getStatusColor = (status) => {
    const colors = {
      'paid': 'green',
      'sent': 'blue',
      'overdue': 'red',
      'draft': 'orange'
    };
    return colors[status] || 'default';
  };

  const getStatusText = (status) => {
    const texts = {
      'paid': 'Paid',
      'sent': 'Sent',
      'overdue': 'Overdue',
      'draft': 'Draft'
    };
    return texts[status] || status;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const actionMenu = (record) => (
    <Menu>
      <Menu.Item key="view">
        <Icon type="eye" /> View Details
      </Menu.Item>
      <Menu.Item key="edit">
        <Icon type="edit" /> Edit Invoice
      </Menu.Item>
      <Menu.Item key="send">
        <Icon type="mail" /> Send Invoice
      </Menu.Item>
      <Menu.Item key="download">
        <Icon type="download" /> Download PDF
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="delete" style={{ color: '#ff4d4f' }}>
        <Icon type="delete" /> Delete Invoice
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Invoice #',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 140,
      render: (text) => <a href="#" style={{ fontWeight: 'bold' }}>{text}</a>
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      width: 180,
      render: (text, record) => (
        <div>
          <div style={{ fontWeight: '500' }}>{text}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{record.customerEmail}</div>
        </div>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      align: 'right',
      render: (amount) => (
        <span style={{ fontWeight: 'bold', fontSize: '14px' }}>
          {formatCurrency(amount)}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status).toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 'paid' },
        { text: 'Sent', value: 'sent' },
        { text: 'Overdue', value: 'overdue' },
        { text: 'Draft', value: 'draft' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Issue Date',
      dataIndex: 'issueDate',
      key: 'issueDate',
      width: 110,
      sorter: (a, b) => new Date(a.issueDate) - new Date(b.issueDate)
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 110,
      render: (date, record) => {
        const isOverdue = record.status === 'overdue';
        return (
          <span style={{ color: isOverdue ? '#ff4d4f' : 'inherit' }}>
            {date}
            {isOverdue && <Icon type="exclamation-circle" style={{ color: '#ff4d4f', marginLeft: '4px' }} />}
          </span>
        );
      },
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate)
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Dropdown overlay={actionMenu(record)} trigger={['click']}>
          <Button type="link" style={{ padding: 0 }}>
            <Icon type="more" style={{ fontSize: '16px' }} />
          </Button>
        </Dropdown>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.status === 'draft'
    })
  };

  const paidPercentage = ((statisticsData.paidAmount / statisticsData.totalAmount) * 100).toFixed(1);

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: 0, marginBottom: '8px' }}>
          Invoice Management
        </h1>
        <p style={{ color: '#666', margin: 0, fontSize: '16px' }}>
          Track and manage all your invoices in one place
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Invoices"
              value={statisticsData.totalInvoices}
              prefix={<Icon type="file-text" />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Amount"
              value={statisticsData.totalAmount}
              precision={2}
              prefix="$"
              prefix={<Icon type="dollar" />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Amount Paid"
              value={statisticsData.paidAmount}
              precision={2}
              prefix="$"
              prefix={<Icon type="check-circle" />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={parseFloat(paidPercentage)} 
              size="small" 
              showInfo={false} 
              strokeColor="#52c41a"
              style={{ marginTop: '8px' }}
            />
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              {paidPercentage}% of total amount
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Overdue Amount"
              value={statisticsData.overdueAmount}
              precision={2}
              prefix="$"
              prefix={<Icon type="exclamation-circle" />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Status Overview Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge color="orange" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{statisticsData.draftCount}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>Draft Invoices</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge color="blue" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{statisticsData.sentCount}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>Sent Invoices</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge color="green" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{statisticsData.paidCount}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>Paid Invoices</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Badge color="red" />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>{statisticsData.overdueCount}</div>
                <div style={{ color: '#666', fontSize: '12px' }}>Overdue Invoices</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card style={{ marginBottom: '16px' }}>
        <Row gutter={16} align="middle">
          <Col span={6}>
            <Search
              placeholder="Search invoices..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={4}>
            <Select
              style={{ width: '100%' }}
              placeholder="Filter by status"
              value={filterStatus}
              onChange={setFilterStatus}
            >
              <Option value="all">All Status</Option>
              <Option value="paid">Paid</Option>
              <Option value="sent">Sent</Option>
              <Option value="overdue">Overdue</Option>
              <Option value="draft">Draft</Option>
            </Select>
          </Col>
          <Col span={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
          <Col span={8}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button icon="mail">
                    Send ({selectedRowKeys.length})
                  </Button>
                  <Button icon="download">
                    Export ({selectedRowKeys.length})
                  </Button>
                </>
              )}
              <Button type="primary" icon="plus">
                Create Invoice
              </Button>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Invoice Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={invoiceData}
          rowSelection={rowSelection}
          pagination={{
            total: statisticsData.totalInvoices,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} invoices`
          }}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default InvoicingPage;