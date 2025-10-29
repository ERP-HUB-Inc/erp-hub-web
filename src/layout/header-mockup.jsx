import React from 'react';
import { Layout, Icon, Dropdown, Menu, Divider, Badge, Avatar, Button, Tooltip, Empty } from 'antd';
import { Link } from 'react-router-dom';

const { Header } = Layout;

// Lucide Icon Component
class LucideIcon extends React.Component {
  componentDidMount() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  componentDidUpdate() {
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  render() {
    const { name, size = 20, color, style, className } = this.props;
    return (
      <i 
        data-lucide={name} 
        style={{ width: size, height: size, color, ...style }}
        className={className}
      />
    );
  }
}

// Enhanced Notification component
const NotificationMenu = ({ onMarkAllRead, onClearAll }) => {
  // Sample notifications - replace with your actual data
  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      description: 'Order #12345 has been placed by John Doe',
      time: '5 min ago',
      type: 'order',
      read: false,
      priority: 'high'
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      description: 'Product XYZ quantity is below minimum threshold',
      time: '1 hour ago',
      type: 'alert',
      read: false,
      priority: 'urgent'
    },
    {
      id: 3,
      title: 'Payment Confirmed',
      description: 'Invoice #67890 paid successfully via credit card',
      time: '2 hours ago',
      type: 'payment',
      read: true,
      priority: 'normal'
    },
    {
      id: 4,
      title: 'New Customer Registration',
      description: 'Sarah Smith has created a new account',
      time: '3 hours ago',
      type: 'user',
      read: true,
      priority: 'normal'
    },
    {
      id: 5,
      title: 'System Update Available',
      description: 'Version 2.5.0 is ready to install',
      time: '5 hours ago',
      type: 'system',
      read: false,
      priority: 'normal'
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIconConfig = (type) => {
    const configs = {
      order: { icon: 'shopping-cart', color: '#14b8a6', bg: '#ecfdf5' },
      alert: { icon: 'alert-triangle', color: '#f59e0b', bg: '#fef3c7' },
      payment: { icon: 'credit-card', color: '#10b981', bg: '#d1fae5' },
      user: { icon: 'user-plus', color: '#8b5cf6', bg: '#ede9fe' },
      system: { icon: 'settings', color: '#6366f1', bg: '#e0e7ff' },
      default: { icon: 'bell', color: '#6b7280', bg: '#f3f4f6' }
    };
    return configs[type] || configs.default;
  };

  const getPriorityDot = (priority) => {
    const colors = {
      urgent: '#ef4444',
      high: '#f59e0b',
      normal: '#14b8a6'
    };
    return colors[priority] || colors.normal;
  };

  const handleNotificationClick = (notification) => {
    console.log('Notification clicked:', notification);
    // Add your notification click handler here
  };

  const handleMarkAllRead = () => {
    if (onMarkAllRead) onMarkAllRead();
    console.log('Mark all as read');
  };

  const handleClearAll = () => {
    if (onClearAll) onClearAll();
    console.log('Clear all notifications');
  };

  return (
    <div style={{ width: 380, maxHeight: 500, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ 
        padding: '16px 16px 12px',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LucideIcon name="bell" size={18} color="#14b8a6" />
            <span style={{ fontWeight: 'bold', fontSize: 16 }}>Notifications</span>
          </div>
          {unreadCount > 0 && (
            <Badge 
              count={unreadCount} 
              style={{ 
                backgroundColor: '#14b8a6',
                boxShadow: '0 0 0 1px #fff'
              }} 
            />
          )}
        </div>
        {unreadCount > 0 && (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button 
              size="small" 
              type="link" 
              style={{ padding: 0, height: 'auto', color: '#14b8a6' }}
              onClick={handleMarkAllRead}
            >
              <LucideIcon name="check-check" size={14} style={{ marginRight: 4 }} />
              Mark all read
            </Button>
            <Button 
              size="small" 
              type="link" 
              style={{ padding: 0, height: 'auto', color: '#ef4444' }}
              onClick={handleClearAll}
            >
              <LucideIcon name="trash-2" size={14} style={{ marginRight: 4 }} />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notification List */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <Empty 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No notifications"
            />
          </div>
        ) : (
          notifications.map(item => {
            const iconConfig = getIconConfig(item.type);
            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                style={{
                  padding: '12px 16px',
                  cursor: 'pointer',
                  backgroundColor: item.read ? '#fff' : '#f0fdfa',
                  borderBottom: '1px solid #f0f0f0',
                  transition: 'all 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = item.read ? '#fff' : '#f0fdfa'}
              >
                <div style={{ display: 'flex', gap: 12 }}>
                  {/* Icon */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: iconConfig.bg,
                      flexShrink: 0
                    }}
                  >
                    <LucideIcon name={iconConfig.icon} size={20} color={iconConfig.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'start', gap: 8, marginBottom: 4 }}>
                      <span style={{ 
                        fontSize: 14, 
                        fontWeight: item.read ? 'normal' : '600',
                        color: '#262626',
                        flex: 1
                      }}>
                        {item.title}
                      </span>
                      {!item.read && (
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: getPriorityDot(item.priority),
                            marginTop: 4,
                            flexShrink: 0
                          }}
                        />
                      )}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      color: '#595959',
                      marginBottom: 6,
                      lineHeight: 1.4
                    }}>
                      {item.description}
                    </div>
                    <div style={{ 
                      fontSize: 11, 
                      color: '#8c8c8c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4
                    }}>
                      <LucideIcon name="clock" size={11} />
                      {item.time}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div style={{ 
          padding: '12px 16px',
          textAlign: 'center',
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa'
        }}>
          <Link 
            to="/notifications" 
            style={{ 
              color: '#14b8a6',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            View All Notifications
            <LucideIcon name="arrow-right" size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

// Your modified header component
class ERPHeader extends React.Component {
  componentDidMount() {
    // Load Lucide icons
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.min.js';
    script.async = true;
    document.body.appendChild(script);
  }

  render() {
    const { isPOSPage, collapsed, onToggle, onLogout, userName = "Marco JR" } = this.props;

    const userMenu = (
      <Menu>
        <Menu.Item>
          <Link to="/profile">
            <Icon type="user" />
            Profile
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Icon type="redo" />
          Update Now
        </Menu.Item>
        <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        <Menu.Item onClick={onLogout}>
          <Icon type="logout" />
          Logout
        </Menu.Item>
      </Menu>
    );

    return (
      <>
        <style>{`
          :root {
            --primary-color: #14b8a6;
            --secondary-light-teal: #7dd3fc;
            --secondary-cyan: #06b6d4;
          }

          .erp-header {
            background: #fff;
            padding: 0;
            position: fixed;
            z-index: 1000;
            width: 100%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .header-left {
            display: flex;
            align-items: center;
          }

          .trigger {
            font-size: 18px;
            padding: 0 24px;
            cursor: pointer;
            transition: color 0.3s;
            height: 64px;
            line-height: 64px;
          }

          .trigger:hover {
            color: var(--primary-color);
          }

          .logo-section {
            display: flex;
            align-items: center;
            margin-left: 16px;
          }

          .company-name {
            font-size: 1.3rem;
            font-weight: bold;
            letter-spacing: 0.05em;
            color: var(--primary-color);
            margin: 0;
            line-height: 1.2;
          }

          .slogan {
            font-size: 0.55rem;
            font-weight: 600;
            letter-spacing: 0.15em;
            color: var(--secondary-cyan);
            margin: 0;
            margin-top: 2px;
          }

          .header-right {
            display: flex;
            align-items: center;
            padding-right: 24px;
            gap: 24px;
          }

          .pos-link {
            padding: 4px 16px;
            border: 1px solid var(--primary-color);
            border-radius: 4px;
            color: var(--primary-color);
            transition: all 0.3s;
          }

          .pos-link:hover {
            background: var(--primary-color);
            color: #fff;
          }

          .notification-bell {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            background: transparent;
          }

          .notification-bell:hover {
            background: #f0f0f0;
          }

          .notification-bell .anticon {
            font-size: 18px;
            color: #595959;
          }

          .notification-bell:hover .anticon {
            color: var(--primary-color);
          }

          .user-section {
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            padding: 4px 12px;
            border-radius: 4px;
            transition: background 0.3s;
          }

          .user-section:hover {
            background: #f0f0f0;
          }

          .user-name {
            color: #262626;
            font-weight: 500;
          }

          @media (max-width: 768px) {
            .logo-section {
              display: none;
            }
            
            .company-name {
              font-size: 1rem;
            }
            
            .slogan {
              font-size: 0.45rem;
            }
          }
        `}</style>

        {!isPOSPage ? (
          <Header className="erp-header">
            <div className="header-left">
              <Icon
                className="trigger"
                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                onClick={onToggle}
              />
              <div className="logo-section">
                <div>
                  <h1 className="company-name">ERP HUB INC.</h1>
                  <p className="slogan">CONNECTED. EFFICIENT</p>
                </div>
              </div>
            </div>

            <div className="header-right">
              <Link to="/pos" className="pos-link">
                <Icon type="shop" /> POS
              </Link>

              <Dropdown 
                overlay={<NotificationMenu />} 
                trigger={["click"]}
                placement="bottomRight"
              >
                <div className="notification-bell">
                  <Badge count={5} offset={[-2, 2]}>
                    <Icon type="bell" />
                  </Badge>
                </div>
              </Dropdown>

              <Dropdown 
                overlay={userMenu} 
                trigger={["hover"]}
                placement="bottomRight"
              >
                <div className="user-section">
                  <Avatar icon="user" size="small" style={{ backgroundColor: 'var(--primary-color)' }} />
                  <span className="user-name">{userName}</span>
                  <Icon type="down" style={{ fontSize: 12 }} />
                </div>
              </Dropdown>
            </div>
          </Header>
        ) : (
          <React.Fragment />
        )}
      </>
    );
  }
}

export default ERPHeader;