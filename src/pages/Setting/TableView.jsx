import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Button, 
  Row, 
  Col, 
  Icon,
  Typography,
  Input,
  Badge,
  Tooltip
} from 'antd';

const { Title, Text } = Typography;
const { Search } = Input;

const RestaurantTableView = () => {
  const [activeFloor, setActiveFloor] = useState('1st Floor');
  const [selectedTable, setSelectedTable] = useState(null);

  // Sample table data
  const tablesData = {
    '1st Floor': [
      { id: 'A1', status: 'available', x: 1, y: 1, size: 'regular' },
      { id: 'A2', status: 'reserved', x: 2, y: 1, size: 'regular' },
      { id: 'A3', status: 'dine-in', x: 3, y: 1, size: 'regular' },
      { id: 'A4', status: 'dine-in', x: 4, y: 1, size: 'regular' },
      { id: 'A5', status: 'dine-in', x: 5, y: 1, size: 'regular' },
      { id: 'A6', status: 'dine-in', x: 1, y: 2, size: 'regular' },
      { id: 'A7', status: 'dine-in', x: 2, y: 2, size: 'regular' },
      { id: 'A8', status: 'available', x: 3, y: 2, size: 'large' },
      { id: 'A9', status: 'available', x: 4, y: 2, size: 'large' },
      { id: 'A10', status: 'reserved', x: 5, y: 2, size: 'regular' },
      { id: 'A11', status: 'reserved', x: 1, y: 3, size: 'regular' },
      { id: 'A12', status: 'dine-in', x: 2, y: 3, size: 'regular' },
      { id: 'A13', status: 'dine-in', x: 3, y: 3, size: 'regular' },
      { id: 'A14', status: 'reserved', x: 4, y: 3, size: 'regular' },
      { id: 'A15', status: 'dine-in', x: 5, y: 3, size: 'regular' }
    ],
    '2nd Floor': [
      { id: 'B1', status: 'available', x: 1, y: 1, size: 'regular' },
      { id: 'B2', status: 'dine-in', x: 2, y: 1, size: 'regular' },
      { id: 'B3', status: 'reserved', x: 3, y: 1, size: 'regular' },
      { id: 'B4', status: 'available', x: 4, y: 1, size: 'regular' },
      { id: 'B5', status: 'dine-in', x: 5, y: 1, size: 'regular' },
      { id: 'B6', status: 'available', x: 1, y: 2, size: 'large' },
      { id: 'B7', status: 'reserved', x: 3, y: 2, size: 'regular' },
      { id: 'B8', status: 'dine-in', x: 4, y: 2, size: 'regular' }
    ],
    '3rd Floor': [
      { id: 'C1', status: 'available', x: 1, y: 1, size: 'regular' },
      { id: 'C2', status: 'dine-in', x: 2, y: 1, size: 'regular' },
      { id: 'C3', status: 'reserved', x: 3, y: 1, size: 'regular' },
      { id: 'C4', status: 'available', x: 4, y: 1, size: 'large' },
      { id: 'C5', status: 'dine-in', x: 1, y: 2, size: 'regular' },
      { id: 'C6', status: 'available', x: 2, y: 2, size: 'regular' }
    ]
  };

  const floors = ['1st Floor', '2nd Floor', '3rd Floor'];

  const getTableStatusColor = (status) => {
    const colors = {
      'available': {
        background: '#fff',
        border: '#d9d9d9',
        text: '#595959'
      },
      'dine-in': {
        background: '#e6f7ff',
        border: '#91d5ff',
        text: '#1890ff'
      },
      'reserved': {
        background: '#fff2e8',
        border: '#ffbb96',
        text: '#fa8c16'
      }
    };
    return colors[status] || colors.available;
  };

  const getStatusStats = (tables) => {
    const stats = tables.reduce((acc, table) => {
      acc[table.status] = (acc[table.status] || 0) + 1;
      return acc;
    }, {});
    
    return {
      available: stats.available || 0,
      'dine-in': stats['dine-in'] || 0,
      reserved: stats.reserved || 0
    };
  };

  const handleTableClick = (table) => {
    setSelectedTable(table.id === selectedTable ? null : table.id);
  };

  const currentTables = tablesData[activeFloor] || [];
  const stats = getStatusStats(currentTables);

  // Create grid layout
  const maxX = Math.max(...currentTables.map(t => t.x));
  const maxY = Math.max(...currentTables.map(t => t.y));

  const renderTable = (table) => {
    const colors = getTableStatusColor(table.status);
    const isSelected = selectedTable === table.id;
    const isLarge = table.size === 'large';

    return (
      <div
        key={table.id}
        onClick={() => handleTableClick(table)}
        style={{
          position: 'absolute',
          left: `${(table.x - 1) * 200 + 20}px`,
          top: `${(table.y - 1) * 150 + 20}px`,
          width: isLarge ? '180px' : '140px',
          height: isLarge ? '120px' : '100px',
          backgroundColor: isSelected ? '#1890ff' : colors.background,
          border: `2px solid ${isSelected ? '#1890ff' : colors.border}`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isSelected ? '0 4px 12px rgba(24, 144, 255, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
          transform: isSelected ? 'translateY(-2px)' : 'none'
        }}
      >
        <Text 
          style={{ 
            fontSize: isLarge ? '18px' : '16px', 
            fontWeight: 500,
            color: isSelected ? '#fff' : colors.text
          }}
        >
          {table.id}
        </Text>
      </div>
    );
  };

  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#fff', 
        padding: '16px 24px', 
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                backgroundColor: '#1890ff', 
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Icon type="shop" style={{ color: '#fff', fontSize: '20px' }} />
              </div>
              <div>
                <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                  Aleo Resto
                </Title>
                <Text style={{ color: '#8c8c8c', fontSize: '12px' }}>
                  Outlet Sukabumi
                </Text>
              </div>
            </div>
          </Col>
          
          <Col>
            <Search
              placeholder="Search here"
              style={{ width: 300 }}
              size="large"
            />
          </Col>
          
          <Col>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Badge count={2} offset={[0, 0]}>
                <Icon type="bell" style={{ fontSize: '18px', color: '#595959' }} />
              </Badge>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Avatar 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                  size={32}
                />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>Intan Fauziah</div>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Cashier</div>
                </div>
                <Icon type="down" style={{ fontSize: '12px', color: '#8c8c8c' }} />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Main Content */}
      <div style={{ padding: '24px' }}>
        {/* Page Header */}
        <Row justify="space-between" align="middle" style={{ marginBottom: '24px' }}>
          <Col>
            <Title level={2} style={{ margin: 0, fontSize: '28px', fontWeight: 600 }}>
              Table View
            </Title>
          </Col>
          <Col>
            {/* Floor Tabs */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {floors.map((floor) => (
                <Button
                  key={floor}
                  type={activeFloor === floor ? 'primary' : 'default'}
                  onClick={() => setActiveFloor(floor)}
                  style={{
                    backgroundColor: activeFloor === floor ? '#1890ff' : '#fff',
                    borderColor: activeFloor === floor ? '#1890ff' : '#d9d9d9',
                    color: activeFloor === floor ? '#fff' : '#595959',
                    borderRadius: '6px',
                    fontWeight: activeFloor === floor ? 500 : 400
                  }}
                >
                  {floor}
                </Button>
              ))}
            </div>
          </Col>
        </Row>

        {/* Table Layout */}
        <Card 
          style={{ 
            marginBottom: '24px',
            minHeight: '500px',
            position: 'relative'
          }}
          bodyStyle={{ 
            padding: '20px',
            position: 'relative',
            overflow: 'auto'
          }}
        >
          <div 
            style={{ 
              position: 'relative',
              width: `${maxX * 200 + 40}px`,
              height: `${maxY * 150 + 40}px`,
              minWidth: '100%',
              minHeight: '400px'
            }}
          >
            {currentTables.map(renderTable)}
          </div>

          {/* Zoom Controls */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <Button 
              shape="circle" 
              icon="plus" 
              size="large"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <Button 
              shape="circle" 
              icon="minus" 
              size="large"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            />
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginTop: '8px',
              fontSize: '12px',
              color: '#8c8c8c'
            }}>
              <Icon type="fullscreen" />
              Scale to Fit
            </div>
          </div>
        </Card>

        {/* Status Legend */}
        <Row justify="space-between" align="middle">
          <Col>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#d9d9d9',
                  borderRadius: '50%'
                }} />
                <Text>Available : {stats.available}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#1890ff',
                  borderRadius: '50%'
                }} />
                <Text>Dine in : {stats['dine-in']}</Text>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  backgroundColor: '#fa8c16',
                  borderRadius: '50%'
                }} />
                <Text>Reserved : {stats.reserved}</Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Bottom Navigation */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        borderTop: '1px solid #f0f0f0',
        padding: '12px 0',
        zIndex: 1000
      }}>
        <Row justify="center">
          <Col span={20}>
            <Row justify="space-around" align="middle">
              <Col style={{ textAlign: 'center' }}>
                <Button type="link" style={{ height: 'auto', padding: '8px' }}>
                  <div>
                    <Icon type="home" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }} />
                    <Text style={{ fontSize: '12px' }}>Home</Text>
                  </div>
                </Button>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Button type="link" style={{ height: 'auto', padding: '8px' }}>
                  <div>
                    <Icon type="file-text" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }} />
                    <Text style={{ fontSize: '12px' }}>Orders</Text>
                  </div>
                </Button>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  backgroundColor: '#1890ff',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px'
                }}>
                  <Icon type="appstore" style={{ fontSize: '24px', color: '#fff' }} />
                </div>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Button type="link" style={{ height: 'auto', padding: '8px', color: '#1890ff' }}>
                  <div>
                    <Icon type="table" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }} />
                    <Text style={{ fontSize: '12px', color: '#1890ff' }}>Table</Text>
                  </div>
                </Button>
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Button type="link" style={{ height: 'auto', padding: '8px' }}>
                  <div>
                    <Icon type="more" style={{ fontSize: '20px', display: 'block', marginBottom: '4px' }} />
                    <Text style={{ fontSize: '12px' }}>More</Text>
                  </div>
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default RestaurantTableView;