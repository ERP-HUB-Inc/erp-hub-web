import React from 'react';
import { Row, Col, Button, Breadcrumb, Icon, Divider } from 'antd';

const PageHeader = ({ 
  title, 
  subtitle, 
  breadcrumbs = [], 
  actions = [], 
  showDivider = true,
  style = {},
  titleStyle = {},
  subtitleStyle = {}
}) => {
  return (
    <div style={{ background: "#fff", padding: "25px 40px", ...style }}>
      {/* Breadcrumb Navigation */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb style={{ marginBottom: '16px' }}>
          {breadcrumbs.map((crumb, index) => (
            <Breadcrumb.Item key={index}>
              {crumb.href ? <a href={crumb.href}>{crumb.text}</a> : crumb.text}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      {/* Title and Actions Row */}
      <Row type="flex" justify="space-between" align="middle" style={{ marginTop: 30 }}>
        <Col>
          <div>
            <h1 style={{ 
              margin: 0, 
              fontSize: '28px', 
              fontWeight: 600, 
              color: '#262626',
              lineHeight: 1.2,
              ...titleStyle 
            }}>
              {title}
            </h1>
            {subtitle && (
              <p style={{ 
                margin: '4px 0 0 0', 
                color: '#8c8c8c', 
                fontSize: '14px',
                lineHeight: 1.4,
                ...subtitleStyle 
              }}>
                {subtitle}
              </p>
            )}
          </div>
        </Col>
        
        {/* Action Buttons */}
        {actions.length > 0 && (
          <Col>
            <div style={{ display: 'flex', gap: '8px' }}>
              {actions.map((action, index) => (
                <Button
                  key={index}
                  type={action.type || 'default'}
                  size={action.size || 'large'}
                  icon={action.icon}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  loading={action.loading}
                  style={action.style}
                >
                  {action.text}
                </Button>
              ))}
            </div>
          </Col>
        )}
      </Row>

      {/* Optional Divider */}
      {/* {showDivider && <Divider style={{ margin: '16px 0 0 0' }} />} */}
    </div>
  );
};

export { PageHeader };