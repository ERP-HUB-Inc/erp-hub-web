import React, { useState } from 'react';
import { 
  Card, 
  Avatar, 
  Tag, 
  Button, 
  Row, 
  Col, 
  Icon,
  Typography,
  Drawer,
  Divider,
  List
} from 'antd';

const { Title, Text } = Typography;

const OrdersDashboard = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // Sample orders data with detailed items
  const ordersData = [
    {
      id: '#001',
      customerName: 'Shibu V',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'New',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Delivery • Hole 5',
      items: 3,
      qty: 4,
      modifiers: 6,
      memberNumber: '#010',
      orderItems: [
        {
          name: '2 x Vodka High Noon',
          price: 20.00,
          description: 'Flavor: Pineapple'
        },
        {
          name: '1 x Grilled Chicken Sandwich',
          price: 15.25,
          description: 'Toppings: Cheese\nRemove Item: No Tomato'
        },
        {
          name: '1 x Signature Burger',
          price: 10.00,
          description: 'Temperature: Medium\nCheese: Cheddar\nSides: Sweet Potato Fries'
        }
      ],
      totalQty: 4,
      foodAllergies: 'None',
      tip: 0.00,
      salesTax: 0.00,
      total: 45.25,
      paymentMethod: 'Card Payment'
    },
    {
      id: '#002',
      customerName: 'Layla Jonas',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      status: 'Delivery',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Delivery • Hole 5',
      items: 2,
      qty: 2,
      modifiers: 0,
      memberNumber: '#002',
      orderItems: [
        {
          name: '1 x Caesar Salad',
          price: 12.50,
          description: 'Dressing: Caesar\nAdd: Grilled Chicken'
        },
        {
          name: '1 x Iced Coffee',
          price: 4.75,
          description: 'Size: Large\nMilk: Oat Milk'
        }
      ],
      totalQty: 2,
      foodAllergies: 'Nuts',
      tip: 2.50,
      salesTax: 1.25,
      total: 20.00,
      paymentMethod: 'Card Payment'
    },
    {
      id: '#003',
      customerName: 'Cicila',
      customerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      status: 'Done',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Delivery • Hole 5',
      items: 2,
      qty: 2,
      modifiers: 0,
      memberNumber: '#003',
      orderItems: [
        { name: '1 x Pizza Margherita', price: 14.99, description: 'Size: Large' },
        { name: '1 x Coca Cola', price: 2.99, description: 'Size: Medium' }
      ],
      totalQty: 2,
      foodAllergies: 'None',
      tip: 3.00,
      salesTax: 1.80,
      total: 22.78,
      paymentMethod: 'Card Payment'
    },
    {
      id: '#004',
      customerName: 'Avatar',
      customerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      status: 'Pickup',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Pickup',
      items: 2,
      qty: 2,
      modifiers: 0,
      memberNumber: '#004',
      orderItems: [
        { name: '1 x Burger', price: 12.99, description: 'Extra cheese' },
        { name: '1 x Fries', price: 4.99, description: 'Large size' }
      ],
      totalQty: 2,
      foodAllergies: 'None',
      tip: 2.50,
      salesTax: 1.50,
      total: 21.98,
      paymentMethod: 'Card Payment'
    },
    {
      id: '#005',
      customerName: 'Shibu V',
      customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      status: 'Active',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Delivery • Hole 5',
      items: 2,
      qty: 2,
      modifiers: 0,
      memberNumber: '#005',
      orderItems: [
        { name: '1 x Sandwich', price: 8.99, description: 'Turkey and cheese' },
        { name: '1 x Coffee', price: 3.99, description: 'Medium, black' }
      ],
      totalQty: 2,
      foodAllergies: 'None',
      tip: 1.50,
      salesTax: 1.25,
      total: 15.73,
      paymentMethod: 'Card Payment'
    },
    {
      id: '#006',
      customerName: 'Layla Jonas',
      customerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b77c?w=150&h=150&fit=crop&crop=face',
      status: 'Preparing',
      orderTime: '3 Dec, 24 • 3:28 PM',
      timeElapsed: '10 mins 12 secs',
      location: 'Delivery • Hole 5',
      items: 2,
      qty: 2,
      modifiers: 0,
      memberNumber: '#006',
      orderItems: [
        { name: '1 x Pasta', price: 16.99, description: 'Alfredo sauce' },
        { name: '1 x Garlic Bread', price: 5.99, description: 'Extra garlic' }
      ],
      totalQty: 2,
      foodAllergies: 'Gluten',
      tip: 4.00,
      salesTax: 2.30,
      total: 29.28,
      paymentMethod: 'Card Payment'
    }
  ];

  const statusFilters = ['All', 'Active', 'New', 'Preparing', 'Pickup', 'Delivery', 'Done'];

  const getStatusColor = (status) => {
    const colors = {
      'New': '#1890ff',
      'Active': '#52c41a',
      'Preparing': '#faad14',
      'Pickup': '#fa8c16',
      'Delivery': '#52c41a',
      'Done': '#52c41a'
    };
    return colors[status] || '#d9d9d9';
  };

  const getStatusTextColor = (status) => {
    return '#fff';
  };

  const filteredOrders = activeFilter === 'All' 
    ? ordersData 
    : ordersData.filter(order => order.status === activeFilter);

  const handleCardClick = (order) => {
    setSelectedOrder(order);
    setIsDrawerVisible(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerVisible(false);
    setSelectedOrder(null);
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <Title level={1} style={{ marginBottom: '24px', fontSize: '32px', fontWeight: 600 }}>
          Orders
        </Title>

        {/* Status Filter Tabs */}
        <div style={{ 
          marginBottom: '24px', 
          display: 'flex', 
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {statusFilters.map((filter) => (
            <Button
              key={filter}
              type={activeFilter === filter ? 'primary' : 'default'}
              shape="round"
              onClick={() => setActiveFilter(filter)}
              style={{
                backgroundColor: activeFilter === filter ? '#52c41a' : '#fff',
                borderColor: activeFilter === filter ? '#52c41a' : '#d9d9d9',
                color: activeFilter === filter ? '#fff' : '#666',
                fontWeight: activeFilter === filter ? 500 : 400,
                minWidth: '80px'
              }}
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Orders Grid */}
        <Row gutter={[16, 16]}>
          {filteredOrders.map((order, index) => (
            <Col xs={24} sm={12} md={8} lg={6} xl={6} key={`${order.id}-${index}`}>
              <Card
                style={{ 
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #f0f0f0',
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: '16px' }}
                onClick={() => handleCardClick(order)}
              >
                {/* Customer Info and Status */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Avatar 
                      src={order.customerAvatar}
                      size={32}
                      style={{ flexShrink: 0 }}
                    />
                    <div>
                      <div style={{ 
                        fontWeight: 500, 
                        fontSize: '14px', 
                        color: '#262626',
                        lineHeight: 1.2
                      }}>
                        {order.customerName}
                      </div>
                      <div style={{ 
                        fontSize: '12px', 
                        color: '#8c8c8c',
                        lineHeight: 1.2,
                        marginTop: '2px'
                      }}>
                        {order.id}
                      </div>
                    </div>
                  </div>
                  
                  <Tag 
                    style={{
                      backgroundColor: getStatusColor(order.status),
                      color: getStatusTextColor(order.status),
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '2px 8px',
                      lineHeight: 1.4
                    }}
                  >
                    {order.status}
                  </Tag>
                </div>

                {/* Order Details */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <Icon type="clock-circle" style={{ fontSize: '12px', color: '#8c8c8c' }} />
                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Order time</Text>
                    <Text style={{ fontSize: '12px', color: '#262626', marginLeft: 'auto' }}>
                      {order.orderTime}
                    </Text>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    marginBottom: '4px'
                  }}>
                    <Icon type="history" style={{ fontSize: '12px', color: '#8c8c8c' }} />
                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Time elapsed</Text>
                    <Text style={{ fontSize: '12px', color: '#262626', marginLeft: 'auto' }}>
                      {order.timeElapsed}
                    </Text>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px'
                  }}>
                    <Icon type="environment" style={{ fontSize: '12px', color: '#8c8c8c' }} />
                    <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Location</Text>
                    <Text style={{ fontSize: '12px', color: '#262626', marginLeft: 'auto' }}>
                      {order.location}
                    </Text>
                  </div>
                </div>

                {/* Order Summary */}
                <div style={{ 
                  borderTop: '1px solid #f0f0f0',
                  paddingTop: '12px'
                }}>
                  <Row gutter={8}>
                    <Col span={8}>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>
                          Items
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                          {order.items}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>
                          Qty
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                          {order.qty}
                        </div>
                      </div>
                    </Col>
                    <Col span={8}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '2px' }}>
                          Modifiers
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                          {order.modifiers}
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            color: '#8c8c8c'
          }}>
            <Icon type="inbox" style={{ fontSize: '48px', marginBottom: '16px' }} />
            <Title level={4} style={{ color: '#8c8c8c' }}>
              No orders found
            </Title>
            <Text>No orders match the selected filter</Text>
          </div>
        )}

        {/* Order Detail Drawer */}
        <Drawer
          title={null}
          placement="right"
          onClose={handleDrawerClose}
          visible={isDrawerVisible}
          width={500}
          bodyStyle={{ padding: 0 }}
          headerStyle={{ display: 'none' }}
        >
          {selectedOrder && (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {/* Drawer Header */}
              <div style={{ 
                padding: '20px 24px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fff'
              }}>
                <div>
                  <Title level={4} style={{ margin: 0 }}>
                    Order {selectedOrder.id}
                  </Title>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                    <Icon type="clock-circle" style={{ marginRight: '4px' }} />
                    {selectedOrder.orderTime}
                  </div>
                  <Tag 
                    style={{
                      backgroundColor: getStatusColor(selectedOrder.status),
                      color: getStatusTextColor(selectedOrder.status),
                      border: 'none',
                      borderRadius: '16px',
                      fontSize: '11px',
                      fontWeight: 500,
                      marginTop: '4px'
                    }}
                  >
                    {selectedOrder.status}
                  </Tag>
                </div>
              </div>

              {/* Scrollable Content */}
              <div style={{ flex: 1, overflow: 'auto', padding: '20px 24px' }}>
                {/* Order Items */}
                <List
                  dataSource={selectedOrder.orderItems}
                  renderItem={item => (
                    <List.Item style={{ padding: '16px 0', border: 'none', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ width: '100%' }}>
                        <Row justify="space-between" align="top">
                          <Col span={16}>
                            <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
                              {item.name}
                            </div>
                            {item.description && (
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#8c8c8c', 
                                marginTop: '4px',
                                whiteSpace: 'pre-line'
                              }}>
                                {item.description}
                              </div>
                            )}
                          </Col>
                          <Col span={8} style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
                              ${item.price.toFixed(2)}
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </List.Item>
                  )}
                />

                {/* Order Summary */}
                <div style={{ 
                  backgroundColor: '#fafafa',
                  padding: '16px',
                  borderRadius: '8px',
                  marginTop: '20px',
                  marginBottom: '20px'
                }}>
                  <Row justify="space-between" align="middle">
                    <Col>
                      <Text>Qty: <strong>{selectedOrder.totalQty}</strong></Text>
                    </Col>
                    <Col>
                      <Text>Food allergies: <strong>{selectedOrder.foodAllergies}</strong></Text>
                    </Col>
                  </Row>
                </div>

                {/* Customer Info */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Avatar 
                      src={selectedOrder.customerAvatar}
                      size={40}
                    />
                    <div>
                      <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
                        {selectedOrder.customerName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        Member {selectedOrder.memberNumber}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Location</div>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
                      {selectedOrder.location}
                    </div>
                  </div>
                </div>

                {/* Payment Summary */}
                <div style={{ marginBottom: '24px' }}>
                  <Row justify="space-between" style={{ marginBottom: '8px' }}>
                    <Col>
                      <Text style={{ fontSize: '14px', color: '#262626' }}>Tip</Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: '14px', color: '#262626' }}>
                        ${selectedOrder.tip.toFixed(2)}
                      </Text>
                    </Col>
                  </Row>
                  <Row justify="space-between" style={{ marginBottom: '8px' }}>
                    <Col>
                      <Text style={{ fontSize: '14px', color: '#262626' }}>Sales tax</Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: '14px', color: '#262626' }}>
                        ${selectedOrder.salesTax.toFixed(2)}
                      </Text>
                    </Col>
                  </Row>
                  <Divider style={{ margin: '12px 0' }} />
                  <Row justify="space-between" style={{ marginBottom: '16px' }}>
                    <Col>
                      <Text style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>Total</Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: '16px', fontWeight: 500, color: '#262626' }}>
                        ${selectedOrder.total.toFixed(2)}
                      </Text>
                    </Col>
                  </Row>
                  <Row justify="space-between">
                    <Col>
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>Payment method</Text>
                    </Col>
                    <Col>
                      <Text style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        {selectedOrder.paymentMethod}
                      </Text>
                    </Col>
                  </Row>
                </div>
              </div>

              {/* Fixed Footer */}
              <div style={{ 
                padding: '20px 24px', 
                borderTop: '1px solid #f0f0f0',
                backgroundColor: '#fff'
              }}>
                {/* Action Buttons */}
                <Row gutter={12} style={{ marginBottom: '16px' }}>
                  <Col span={12}>
                    <Button block size="large" onClick={handleDrawerClose}>
                      Cancel
                    </Button>
                  </Col>
                  <Col span={12}>
                    <Button 
                      type="primary" 
                      block 
                      size="large" 
                      style={{ 
                        backgroundColor: '#00d084', 
                        borderColor: '#00d084',
                        fontWeight: 500
                      }}
                    >
                      Accept (Re-print)
                    </Button>
                  </Col>
                </Row>

                {/* Bottom Actions */}
                <Row justify="space-between" align="middle">
                  <Col>
                    <Button type="link" style={{ padding: 0, height: 'auto' }}>
                      <Icon type="user" style={{ marginRight: '4px' }} />
                      Assign
                    </Button>
                  </Col>
                  <Col>
                    <Button type="link" style={{ padding: 0, height: 'auto', display: 'flex', alignItems: 'center' }}>
                      <span style={{ marginRight: '4px' }}>Chat with</span>
                      <Avatar src={selectedOrder.customerAvatar} size={20} style={{ margin: '0 4px' }} />
                      <span style={{ marginRight: '4px' }}>{selectedOrder.customerName}</span>
                      <Icon type="message" style={{ color: '#00d084' }} />
                    </Button>
                  </Col>
                </Row>
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </div>
  );
};

export default OrdersDashboard;