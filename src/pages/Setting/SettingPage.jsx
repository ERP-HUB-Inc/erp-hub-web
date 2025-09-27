import React, { useState } from 'react';
import { Tabs, Table, Button, Tag, Avatar, Dropdown, Menu, Icon } from 'antd';
import {
  Link
} from "react-router-dom";

const { TabPane } = Tabs;

const ERPSettings = () => {
  const [activeTab, setActiveTab] = useState('users');

  // Sample data for the users table
  const usersData = [
    {
      key: '1',
      name: 'Sophanna Morn',
      email: 'sophanna.mn@company.com',
      department: 'Finance',
      role: 'Administrator',
      status: 'ACTIVE',
      avatar: 'SM',
      lastLogin: '2025-09-26'
    },
    {
      key: '2',
      name: 'John Smith',
      email: 'john.smith@company.com',
      department: 'Sales',
      role: 'Manager',
      status: 'ACTIVE',
      avatar: 'JS',
      lastLogin: '2025-09-25'
    },
    {
      key: '3',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@company.com',
      department: 'Inventory',
      role: 'User',
      status: 'INACTIVE',
      avatar: 'SW',
      lastLogin: '2025-09-20'
    }
  ];

  // Dropdown menu for user actions
  const userActionMenu = (
    <Menu>
      <Menu.Item key="edit">
        <Icon type="edit" /> Edit User
      </Menu.Item>
      <Menu.Item key="permissions">
        <Icon type="key" /> Manage Permissions
      </Menu.Item>
      <Menu.Item key="reset">
        <Icon type="reload" /> Reset Password
      </Menu.Item>
      <Menu.Item key="deactivate">
        <Icon type="stop" /> Deactivate
      </Menu.Item>
    </Menu>
  );

  // Table columns configuration
  const columns = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar 
            size={40} 
            style={{ 
              backgroundColor: record.status === 'ACTIVE' ? '#1890ff' : '#d9d9d9',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {record.avatar}
          </Avatar>
          <div>
            <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
              {text}
            </div>
            <div style={{ fontSize: '13px', color: '#8c8c8c', marginTop: '2px' }}>
              {record.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      render: (department) => (
        <span style={{ fontSize: '14px', color: '#262626' }}>{department}</span>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <span style={{ fontSize: '14px', color: '#262626' }}>{role}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'ACTIVE' ? '#52c41a' : '#d9d9d9'}
          style={{ 
            fontSize: '11px',
            fontWeight: 500,
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px'
          }}
        >
          {status}
        </Tag>
      ),
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (date) => (
        <span style={{ fontSize: '14px', color: '#8c8c8c' }}>{date}</span>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: () => (
        <Dropdown overlay={userActionMenu} trigger={['click']}>
          <Button 
            type="link" 
            icon="more" 
            style={{ 
              color: '#8c8c8c',
              fontSize: '16px',
              padding: '4px 8px'
            }}
          />
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '6px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)'
    }}>
      {/* Header */}
      <div style={{ 
        padding: '32px 32px 0',
        borderBottom: 'none'
      }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 500, 
          margin: 0,
          color: '#262626'
        }}>
          System Settings
        </h1>
      </div>

      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        style={{ padding: '0 32px' }}
        tabBarStyle={{ 
          marginBottom: 0,
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        <TabPane tab="General" key="general">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Company Information</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure your company details, time zones, and general ERP system preferences.
            </p>
            {/* General settings content */}
          </div>
        </TabPane>
        
        <TabPane tab="Users & Permissions" key="users">
          <div style={{ padding: '24px 0' }}>
            {/* Description */}
            <div style={{ 
              marginBottom: '24px',
              fontSize: '14px',
              color: '#595959',
              lineHeight: '20px'
            }}>
              Manage system users, their roles, and access permissions. Users can be assigned different roles with varying 
              levels of access to modules like Finance, Inventory, Sales, and HR. <a href="#" style={{ color: '#1890ff' }}>Learn more</a>
            </div>

            {/* Action Bar */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <Dropdown 
                overlay={
                  <Menu>
                    <Menu.Item key="all">All Users</Menu.Item>
                    <Menu.Item key="active">Active Users</Menu.Item>
                    <Menu.Item key="inactive">Inactive Users</Menu.Item>
                    <Menu.Item key="admin">Administrators</Menu.Item>
                  </Menu>
                } 
                trigger={['click']}
              >
                <Button style={{ minWidth: '120px' }}>
                  All Users <Icon type="down" />
                </Button>
              </Dropdown>
              
              <Button type="primary" icon="plus">
                Add User
              </Button>
            </div>

            {/* Users Table */}
            <Table
              columns={columns}
              dataSource={usersData}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} users`
              }}
              size="middle"
              style={{ 
                border: '1px solid #f0f0f0',
                borderRadius: '6px'
              }}
              rowStyle={{ backgroundColor: 'white' }}
            />
          </div>
        </TabPane>
        
        <TabPane tab="Modules" key="modules">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>ERP Modules Configuration</h3>
            <p style={{ color: '#595959', marginBottom: '32px' }}>
              Configure and manage ERP modules including product setup, inventory, sales, finance, and HR settings.
            </p>
            
            {/* Module Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              
              {/* Product Management */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="appstore" style={{ color: '#1890ff' }} />
                  Items Management
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Configure product categories, brands, units, and attributes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Link to={"/categories"}>
                    <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                      <Icon type="tags" /> Categories
                    </Button>
                  </Link>
                  <Link to={"/brands"}>
                    <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                      <Icon type="crown" /> Brand Management
                    </Button>
                  </Link>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="calculator" /> Units of Measure
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="setting" /> Product Attributes
                  </Button>
                </div>
              </div>

              {/* Inventory Management */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="inbox" style={{ color: '#52c41a' }} />
                  Inventory Settings
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Configure warehouses, stock levels, and inventory policies
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="home" /> Warehouse Setup
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="alert" /> Stock Alerts
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="barcode" /> Lot/Serial Tracking
                  </Button>
                </div>
              </div>

              {/* Sales Configuration */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="shopping-cart" style={{ color: '#faad14' }} />
                  Sales Configuration
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Configure pricing, discounts, and sales processes
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="dollar" /> Price Lists
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="percentage" /> Discount Rules
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="team" /> Sales Territories
                  </Button>
                </div>
              </div>

              {/* Finance Setup */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="bank" style={{ color: '#722ed1' }} />
                  Finance Setup
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Configure chart of accounts, tax rates, and currencies
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="file-text" /> Chart of Accounts
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="calculator" /> Tax Configuration
                  </Button>
                  <Button type="link" style={{ textAlign: 'left', padding: '4px 0', height: 'auto' }}>
                    <Icon type="global" /> Currency Setup
                  </Button>
                </div>
              </div>

            </div>
          </div>
        </TabPane>
        
        <TabPane tab="Integration" key="integration">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Third-Party Integrations</h3>
            <p style={{ color: '#595959', marginBottom: '32px' }}>
              Connect your ERP with Cambodia's leading payment gateways, banking systems, and delivery services for seamless business operations.
            </p>
            
            {/* Integration Categories */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              
              {/* Payment Gateways */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="credit-card" style={{ color: '#52c41a' }} />
                  Payment Gateways
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Integrate with Cambodia's popular payment methods and gateways
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        AP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ABA PayWay</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Digital wallet & banking</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Connected</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#faad14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PG
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Pi Pay</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Mobile payment solution</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#722ed1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        WM
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Wing Money</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Mobile financial services</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        BC
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Bakong (NBC)</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>National payment system</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

              {/* Banking Integration */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="bank" style={{ color: '#1890ff' }} />
                  Banking Systems
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Connect with major Cambodian banks for automated reconciliation
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        ABA
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ABA Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Account reconciliation API</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Active</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        AC
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>ACLEDA Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Corporate banking API</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Setup</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#faad14',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Prasac Bank</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Transaction monitoring</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Setup</Button>
                  </div>
                </div>
              </div>

              {/* Delivery Systems */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="car" style={{ color: '#faad14' }} />
                  Delivery & Logistics
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Integrate with local delivery services for order fulfillment
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        NJ
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Nham24</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Food & package delivery</div>
                      </div>
                    </div>
                    <Tag color="#52c41a" style={{ fontSize: '11px' }}>Integrated</Tag>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#52c41a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        PD
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>PassApp Delivery</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>On-demand logistics</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        EX
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Express Mail Service</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Cambodia Post logistics</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#722ed1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        JT
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>J&T Express</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>International courier</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

              {/* E-commerce Platforms */}
              <div style={{ 
                border: '1px solid #f0f0f0', 
                borderRadius: '8px', 
                padding: '20px',
                backgroundColor: '#fafafa'
              }}>
                <h4 style={{ 
                  color: '#262626', 
                  marginBottom: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Icon type="shop" style={{ color: '#722ed1' }} />
                  E-commerce Integration
                </h4>
                <p style={{ color: '#8c8c8c', fontSize: '13px', marginBottom: '16px' }}>
                  Sync with popular online marketplaces and platforms
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#fa8c16',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        SP
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Shopee</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Marketplace integration</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0',
                    borderBottom: '1px solid #f5f5f5'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#f5222d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        LZ
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Lazada</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Product & order sync</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px 0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '4px', 
                        backgroundColor: '#1890ff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        FB
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 500 }}>Facebook Shop</div>
                        <div style={{ fontSize: '12px', color: '#8c8c8c' }}>Social commerce</div>
                      </div>
                    </div>
                    <Button size="small" type="primary" ghost>Connect</Button>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Quick Actions */}
            <div style={{ 
              marginTop: '32px',
              padding: '20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ marginBottom: '16px', color: '#262626' }}>Quick Actions</h4>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button type="primary" ghost icon="api">
                  API Documentation
                </Button>
                <Button type="default" icon="setting">
                  Webhook Settings
                </Button>
                <Button type="default" icon="sync">
                  Sync All Data
                </Button>
                <Button type="default" icon="file-text">
                  Integration Logs
                </Button>
              </div>
            </div>
          </div>
        </TabPane>
        
        <TabPane tab="Backup & Security" key="backup">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Data Backup & Security</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure automated backups, data retention policies, and security settings for your ERP system.
            </p>
            {/* Backup and security content */}
          </div>
        </TabPane>
        
        <TabPane tab="Workflows" key="workflows">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Business Workflows</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Set up approval workflows, automated processes, and business rules for different modules.
            </p>
            {/* Workflow configuration content */}
          </div>
        </TabPane>
        
        <TabPane tab="Reports" key="reports">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>Report Settings</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              Configure report templates, scheduled reports, and dashboard settings for different user roles.
            </p>
            {/* Reports configuration content */}
          </div>
        </TabPane>
        
        <TabPane tab="System Logs" key="logs">
          <div style={{ padding: '24px 0' }}>
            <h3 style={{ marginBottom: '16px', color: '#262626' }}>System Activity Logs</h3>
            <p style={{ color: '#595959', marginBottom: '24px' }}>
              View system logs, user activities, and audit trails for compliance and troubleshooting.
            </p>
            
            {/* Quick Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>1,247</div>
                <div style={{ fontSize: '13px', color: '#595959' }}>Total Logs Today</div>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fff2e6', 
                border: '1px solid #ffd591',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>67</div>
                <div style={{ fontSize: '13px', color: '#595959' }}>Warnings</div>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#fff1f0', 
                border: '1px solid #ffa39e',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>23</div>
                <div style={{ fontSize: '13px', color: '#595959' }}>Errors</div>
              </div>
              <div style={{ 
                padding: '16px', 
                backgroundColor: '#e6f7ff', 
                border: '1px solid #91d5ff',
                borderRadius: '6px'
              }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>45</div>
                <div style={{ fontSize: '13px', color: '#595959' }}>Active Users</div>
              </div>
            </div>

            {/* Recent Activities Preview */}
            <div style={{ 
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
              backgroundColor: 'white'
            }}>
              <div style={{ 
                padding: '16px 20px',
                borderBottom: '1px solid #f0f0f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h4 style={{ margin: 0, color: '#262626' }}>Recent Activity</h4>
                <Button 
                  type="primary"
                  icon="arrow-right"
                  onClick={() => {
                    // Navigate to System Logs page
                    window.location.href = '#/system-logs'; // This would be your routing logic
                  }}
                >
                  View All Logs
                </Button>
              </div>
              
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#1890ff' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#262626' }}>
                        User Login - sophanna.mn@company.com
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        14:30:25 • Authentication Module
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#faad14' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#262626' }}>
                        Payment Failed - ABA PayWay timeout
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        14:25:18 • Payment Gateway Module
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#52c41a' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#262626' }}>
                        Inventory Updated - Stock level changed
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        14:20:45 • Inventory Module
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f5222d' 
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', color: '#262626' }}>
                        Database Error - Connection timeout
                      </div>
                      <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                        14:15:32 • Database Module
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ 
              marginTop: '24px',
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              <Button icon="download" type="default">
                Export Logs
              </Button>
              <Button icon="setting" type="default">
                Configure Alerts
              </Button>
              <Button icon="sync" type="default">
                Refresh Data
              </Button>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ERPSettings;