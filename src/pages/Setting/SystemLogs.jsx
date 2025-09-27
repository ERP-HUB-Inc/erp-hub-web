import React, { useState } from 'react';
import { Table, Button, Tag, Input, Select, DatePicker, Card, Row, Col, Statistic, Icon, Dropdown, Menu } from 'antd';

const { Search } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const SystemLogs = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  // Sample log data
  const logsData = [
    {
      key: '1',
      timestamp: '2025-09-27 14:30:25',
      level: 'INFO',
      action: 'User Login',
      user: 'sophanna.mn@company.com',
      module: 'Authentication',
      description: 'User logged in successfully from IP 192.168.1.100',
      details: 'Location: Phnom Penh, Cambodia | Browser: Chrome 118',
      ip: '192.168.1.100'
    },
    {
      key: '2',
      timestamp: '2025-09-27 14:25:18',
      level: 'WARNING',
      action: 'Failed Payment',
      user: 'system@company.com',
      module: 'Payment Gateway',
      description: 'ABA PayWay payment failed for Order #ORD-2025-001',
      details: 'Error: Insufficient funds | Amount: $150.00',
      ip: '10.0.0.1'
    },
    {
      key: '3',
      timestamp: '2025-09-27 14:20:45',
      level: 'SUCCESS',
      action: 'Inventory Update',
      user: 'john.smith@company.com',
      module: 'Inventory',
      description: 'Stock level updated for Product SKU: LAPTOP-001',
      details: 'Previous: 25 | New: 23 | Location: Warehouse A',
      ip: '192.168.1.105'
    },
    {
      key: '4',
      timestamp: '2025-09-27 14:15:32',
      level: 'ERROR',
      action: 'Database Error',
      user: 'system@company.com',
      module: 'Database',
      description: 'Connection timeout to backup database server',
      details: 'Server: db-backup-01 | Timeout: 30s | Retries: 3',
      ip: '10.0.0.1'
    },
    {
      key: '5',
      timestamp: '2025-09-27 14:10:12',
      level: 'INFO',
      action: 'Order Created',
      user: 'sarah.wilson@company.com',
      module: 'Sales',
      description: 'New order created: ORD-2025-002',
      details: 'Customer: John Doe | Amount: $89.50 | Items: 3',
      ip: '192.168.1.110'
    },
    {
      key: '6',
      timestamp: '2025-09-27 14:05:55',
      level: 'INFO',
      action: 'Report Generated',
      user: 'admin@company.com',
      module: 'Reports',
      description: 'Monthly sales report generated successfully',
      details: 'Report: sales_2025_09.pdf | Size: 2.3MB | Recipients: 5',
      ip: '192.168.1.101'
    },
    {
      key: '7',
      timestamp: '2025-09-27 14:00:33',
      level: 'WARNING',
      action: 'Integration Sync',
      user: 'system@company.com',
      module: 'Integration',
      description: 'Shopee inventory sync partially failed',
      details: 'Success: 245 items | Failed: 12 items | Next retry: 15:00',
      ip: '10.0.0.1'
    }
  ];

  const getLevelColor = (level) => {
    switch (level) {
      case 'ERROR': return '#f5222d';
      case 'WARNING': return '#faad14';
      case 'SUCCESS': return '#52c41a';
      case 'INFO': return '#1890ff';
      default: return '#d9d9d9';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'ERROR': return 'close-circle';
      case 'WARNING': return 'exclamation-circle';
      case 'SUCCESS': return 'check-circle';
      case 'INFO': return 'info-circle';
      default: return 'question-circle';
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 160,
      sorter: true,
      render: (timestamp) => (
        <div style={{ fontSize: '13px', color: '#595959' }}>
          {timestamp}
        </div>
      )
    },
    {
      title: 'Level',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      filters: [
        { text: 'ERROR', value: 'ERROR' },
        { text: 'WARNING', value: 'WARNING' },
        { text: 'SUCCESS', value: 'SUCCESS' },
        { text: 'INFO', value: 'INFO' }
      ],
      render: (level) => (
        <Tag 
          color={getLevelColor(level)}
          icon={<Icon type={getLevelIcon(level)} />}
          style={{ fontSize: '11px', fontWeight: 500 }}
        >
          {level}
        </Tag>
      )
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 150,
      render: (action) => (
        <span style={{ fontSize: '14px', fontWeight: 500, color: '#262626' }}>
          {action}
        </span>
      )
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 180,
      render: (user) => (
        <span style={{ fontSize: '13px', color: '#595959' }}>
          {user}
        </span>
      )
    },
    {
      title: 'Module',
      dataIndex: 'module',
      key: 'module',
      width: 120,
      filters: [
        { text: 'Authentication', value: 'Authentication' },
        { text: 'Payment Gateway', value: 'Payment Gateway' },
        { text: 'Inventory', value: 'Inventory' },
        { text: 'Sales', value: 'Sales' },
        { text: 'Database', value: 'Database' },
        { text: 'Reports', value: 'Reports' },
        { text: 'Integration', value: 'Integration' }
      ],
      render: (module) => (
        <Tag style={{ fontSize: '11px', backgroundColor: '#f0f2f5', color: '#595959', border: 'none' }}>
          {module}
        </Tag>
      )
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (description, record) => (
        <div>
          <div style={{ fontSize: '14px', color: '#262626', marginBottom: '4px' }}>
            {description}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.details}
          </div>
        </div>
      )
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Dropdown 
          overlay={
            <Menu>
              <Menu.Item key="view">
                <Icon type="eye" /> View Details
              </Menu.Item>
              <Menu.Item key="copy">
                <Icon type="copy" /> Copy Log
              </Menu.Item>
              <Menu.Item key="export">
                <Icon type="download" /> Export
              </Menu.Item>
            </Menu>
          } 
          trigger={['click']}
        >
          <Button type="link" icon="more" style={{ color: '#8c8c8c' }} />
        </Dropdown>
      )
    }
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  return (
    <div style={{ 
      padding: '32px 40px',
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 500, 
            margin: 0,
            color: '#262626'
          }}>
            System Activity Logs
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button icon="download">Export</Button>
            <Button icon="sync">Refresh</Button>
            <Button type="primary" icon="setting">Settings</Button>
          </div>
        </div>
        <p style={{ color: '#8c8c8c', margin: 0 }}>
          Monitor system activities, user actions, and audit trails for compliance and troubleshooting
        </p>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Logs Today"
              value={1247}
              prefix={<Icon type="file-text" style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Errors"
              value={23}
              prefix={<Icon type="close-circle" style={{ color: '#f5222d' }} />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Warnings"
              value={67}
              prefix={<Icon type="exclamation-circle" style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Users"
              value={45}
              prefix={<Icon type="user" style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Search
            </span>
            <Search
              placeholder="Search logs..."
              style={{ width: 200 }}
              allowClear
            />
          </div>
          
          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Log Level
            </span>
            <Select
              value={filterType}
              onChange={setFilterType}
              style={{ width: 120 }}
            >
              <Option value="all">All Levels</Option>
              <Option value="ERROR">Error</Option>
              <Option value="WARNING">Warning</Option>
              <Option value="SUCCESS">Success</Option>
              <Option value="INFO">Info</Option>
            </Select>
          </div>

          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              User
            </span>
            <Select
              value={filterUser}
              onChange={setFilterUser}
              style={{ width: 160 }}
            >
              <Option value="all">All Users</Option>
              <Option value="system">System</Option>
              <Option value="admin">Administrators</Option>
              <Option value="regular">Regular Users</Option>
            </Select>
          </div>

          <div>
            <span style={{ display: 'block', marginBottom: '4px', fontSize: '13px', color: '#595959' }}>
              Date Range
            </span>
            <RangePicker style={{ width: 240 }} />
          </div>

          <div style={{ alignSelf: 'flex-end' }}>
            <Button type="primary" ghost>Apply Filters</Button>
          </div>
        </div>
      </Card>

      {/* Action Bar */}
      {selectedRowKeys.length > 0 && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '12px 16px', 
          backgroundColor: '#e6f7ff', 
          borderRadius: '6px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: '#1890ff' }}>
            {selectedRowKeys.length} log(s) selected
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button size="small" icon="download">Export Selected</Button>
            <Button size="small" icon="delete" type="danger" ghost>Archive</Button>
          </div>
        </div>
      )}

      {/* Logs Table */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={logsData}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} logs`,
            pageSizeOptions: ['10', '20', '50', '100']
          }}
          size="middle"
          scroll={{ x: 1200 }}
          rowClassName={(record) => {
            if (record.level === 'ERROR') return 'log-row-error';
            if (record.level === 'WARNING') return 'log-row-warning';
            return '';
          }}
        />
      </Card>

      {/* Custom CSS */}
      <style jsx>{`
        .log-row-error {
          background-color: #fff2f0 !important;
        }
        .log-row-warning {
          background-color: #fffbe6 !important;
        }
      `}</style>
    </div>
  );
};

export default SystemLogs;