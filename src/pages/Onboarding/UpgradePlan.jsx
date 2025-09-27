import React from 'react';
import { Card, Button, Row, Col, Icon, Badge, Divider, List, Typography } from 'antd';

const { Title, Text } = Typography;

const UpgradePlanPage = () => {
  const plans = [
    {
      name: 'Basic',
      price: '$29',
      period: '/month',
      popular: false,
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 5 users',
        'Basic inventory management',
        'Standard reporting',
        'Email support',
        '5GB storage',
        'Basic customer management'
      ],
      buttonText: 'Current Plan',
      disabled: true,
      type: 'default'
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      popular: true,
      description: 'Best for growing businesses with advanced needs',
      features: [
        'Up to 25 users',
        'Advanced inventory management',
        'Custom reporting & analytics',
        'Priority support',
        '50GB storage',
        'CRM integration',
        'Multi-location support',
        'API access',
        'Advanced permissions'
      ],
      buttonText: 'Upgrade Now',
      disabled: false,
      type: 'primary'
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/month',
      popular: false,
      description: 'Complete solution for large organizations',
      features: [
        'Unlimited users',
        'Full ERP suite',
        'Custom dashboards',
        '24/7 dedicated support',
        'Unlimited storage',
        'White-label options',
        'Advanced integrations',
        'Custom workflows',
        'Audit trails',
        'SSO integration',
        'Data export/import tools'
      ],
      buttonText: 'Contact Sales',
      disabled: false,
      type: 'default'
    }
  ];

  const currentFeatures = [
    'Inventory Management',
    'Sales Tracking',
    'Purchase Orders',
    'Financial Reporting'
  ];

  const lockedFeatures = [
    { name: 'Advanced Analytics', plan: 'Professional' },
    { name: 'Multi-location Support', plan: 'Professional' },
    { name: 'CRM Integration', plan: 'Professional' },
    { name: 'API Access', plan: 'Professional' },
    { name: 'Custom Workflows', plan: 'Enterprise' },
    { name: 'White-label Options', plan: 'Enterprise' },
    { name: 'SSO Integration', plan: 'Enterprise' }
  ];

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <Title level={1} style={{ marginBottom: '16px' }}>
          Unlock More Features for Your ERP
        </Title>
        <Text style={{ fontSize: '18px', color: '#666' }}>
          Choose the perfect plan to scale your business operations
        </Text>
      </div>

      {/* Current Plan Status */}
      <Card style={{ marginBottom: '32px' }}>
        <Row gutter={24} align="middle">
          <Col span={12}>
            <Title level={3}>Current Plan: Basic</Title>
            <Text type="secondary">You have access to these features:</Text>
            <List
              size="small"
              dataSource={currentFeatures}
              renderItem={item => (
                <List.Item>
                  <Icon type="check-circle" style={{ color: '#52c41a', marginRight: '8px' }} />
                  {item}
                </List.Item>
              )}
              style={{ marginTop: '16px' }}
            />
          </Col>
          <Col span={12}>
            <Title level={4} style={{ color: '#fa8c16' }}>Locked Features</Title>
            <Text type="secondary">Upgrade to unlock:</Text>
            <List
              size="small"
              dataSource={lockedFeatures}
              renderItem={item => (
                <List.Item>
                  <Icon type="lock" style={{ color: '#fa8c16', marginRight: '8px' }} />
                  <span style={{ marginRight: '8px' }}>{item.name}</span>
                  <Badge color="#108ee9" text={item.plan} />
                </List.Item>
              )}
              style={{ marginTop: '16px' }}
            />
          </Col>
        </Row>
      </Card>

      {/* Pricing Plans */}
      <Row gutter={24}>
        {plans.map((plan, index) => (
          <Col span={8} key={index}>
            <Card
              style={{
                height: '100%',
                position: 'relative',
                border: plan.popular ? '2px solid #1890ff' : '1px solid #d9d9d9'
              }}
            >
              {plan.popular && (
                <Badge text="Most Popular" color="blue">
                  <div />
                </Badge>
              )}
              
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Title level={2} style={{ marginBottom: '8px' }}>
                  {plan.name}
                </Title>
                <div style={{ marginBottom: '16px' }}>
                  <span style={{ fontSize: '48px', fontWeight: 'bold', color: '#1890ff' }}>
                    {plan.price}
                  </span>
                  <span style={{ fontSize: '16px', color: '#666' }}>
                    {plan.period}
                  </span>
                </div>
                <Text type="secondary">{plan.description}</Text>
              </div>

              <Divider />

              <List
                size="small"
                dataSource={plan.features}
                renderItem={item => (
                  <List.Item style={{ border: 'none', padding: '8px 0' }}>
                    <Icon type="check" style={{ color: '#52c41a', marginRight: '8px' }} />
                    {item}
                  </List.Item>
                )}
              />

              <div style={{ position: 'absolute', bottom: '24px', left: '24px', right: '24px' }}>
                <Button
                  type={plan.type}
                  size="large"
                  block
                  disabled={plan.disabled}
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {plan.buttonText}
                </Button>
              </div>

              <div style={{ height: '60px' }} /> {/* Spacer for button */}
            </Card>
          </Col>
        ))}
      </Row>

      {/* Additional Information */}
      <Card style={{ marginTop: '32px', textAlign: 'center' }}>
        <Title level={3}>Need Help Choosing?</Title>
        <Text style={{ fontSize: '16px', display: 'block', marginBottom: '16px' }}>
          Our team is here to help you find the perfect plan for your business needs.
        </Text>
        <Button type="default" size="large" style={{ marginRight: '16px' }}>
          <Icon type="phone" /> Schedule a Demo
        </Button>
        <Button type="default" size="large">
          <Icon type="message" /> Contact Sales
        </Button>
      </Card>

      {/* FAQ Section */}
      <Card style={{ marginTop: '32px' }}>
        <Title level={3}>Frequently Asked Questions</Title>
        <Row gutter={48}>
          <Col span={12}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Can I change my plan anytime?</Title>
              <Text>Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.</Text>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Is there a setup fee?</Title>
              <Text>No setup fees for Basic and Professional plans. Enterprise plans may include implementation assistance.</Text>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>What payment methods do you accept?</Title>
              <Text>We accept all major credit cards, PayPal, and bank transfers for Enterprise customers.</Text>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>Is there a free trial?</Title>
              <Text>Yes! All plans come with a 14-day free trial. No credit card required to get started.</Text>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default UpgradePlanPage;