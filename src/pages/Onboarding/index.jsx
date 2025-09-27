import React, { useState } from 'react';
import { Steps, Button, Card, Form, Input, Select, Upload, Icon, Row, Col, Typography, Progress, message, Divider } from 'antd';

const { Step } = Steps;
const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: {},
    admin: {},
    business: {},
    preferences: {}
  });

  const handleNext = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setCurrentStep(currentStep + 1);
      setLoading(false);
      message.success('Step completed successfully!');
    }, 1000);
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleFinish = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Welcome to your ERP System! Setup completed successfully.');
    }, 2000);
  };

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const progress = ((currentStep + 1) / 5) * 100;

  const steps = [
    {
      title: 'Welcome',
      content: (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '24px', color: '#1890ff' }}>
            🚀
          </div>
          <Title level={2}>Welcome to Your ERP Journey!</Title>
          <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Let's get your business set up in just a few simple steps. This process will take about 5-10 minutes
            and will customize the system specifically for your SME needs.
          </Paragraph>
          <Row gutter={[24, 24]} style={{ marginTop: '40px' }}>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Icon type="setting" style={{ fontSize: '24px', color: '#52c41a' }} />
                <Title level={4}>Easy Setup</Title>
                <Text>Quick configuration tailored for SMEs</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Icon type="team" style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={4}>Team Ready</Title>
                <Text>Multi-user support from day one</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Icon type="rocket" style={{ fontSize: '24px', color: '#722ed1' }} />
                <Title level={4}>Instant Start</Title>
                <Text>Begin managing your business immediately</Text>
              </Card>
            </Col>
          </Row>
        </div>
      )
    },
    {
      title: 'Company Info',
      content: (
        <Card title="Tell us about your company" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Company Name <span style={{ color: 'red' }}>*</span></div>
                  <Input 
                    placeholder="Enter your company name"
                    size="large"
                    onChange={e => updateFormData('company', { name: e.target.value })}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Industry <span style={{ color: 'red' }}>*</span></div>
                  <Select 
                    placeholder="Select your industry"
                    size="large"
                    style={{ width: '100%' }}
                    onChange={value => updateFormData('company', { industry: value })}
                  >
                    <Option value="retail">Retail</Option>
                    <Option value="manufacturing">Manufacturing</Option>
                    <Option value="services">Services</Option>
                    <Option value="technology">Technology</Option>
                    <Option value="healthcare">Healthcare</Option>
                    <Option value="education">Education</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </div>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Company Size</div>
                  <Select 
                    placeholder="Number of employees"
                    size="large"
                    style={{ width: '100%' }}
                    onChange={value => updateFormData('company', { size: value })}
                  >
                    <Option value="1-10">1-10 employees</Option>
                    <Option value="11-50">11-50 employees</Option>
                    <Option value="51-200">51-200 employees</Option>
                    <Option value="200+">200+ employees</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12}>
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Country <span style={{ color: 'red' }}>*</span></div>
                  <Select 
                    placeholder="Select country"
                    size="large"
                    style={{ width: '100%' }}
                    showSearch
                    onChange={value => updateFormData('company', { country: value })}
                  >
                    <Option value="us">United States</Option>
                    <Option value="uk">United Kingdom</Option>
                    <Option value="ca">Canada</Option>
                    <Option value="au">Australia</Option>
                    <Option value="de">Germany</Option>
                    <Option value="fr">France</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </div>
              </Col>
            </Row>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ marginBottom: '8px', fontWeight: 'bold' }}>Company Address</div>
              <TextArea 
                placeholder="Enter your company address"
                rows={3}
                onChange={e => updateFormData('company', { address: e.target.value })}
              />
            </div>
          </div>
        </Card>
      )
    },
    {
      title: 'Admin Account',
      content: (
        <Card title="Create your admin account" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="First Name" required>
                  <Input 
                    placeholder="Enter first name"
                    size="large"
                    onChange={e => updateFormData('admin', { firstName: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Last Name" required>
                  <Input 
                    placeholder="Enter last name"
                    size="large"
                    onChange={e => updateFormData('admin', { lastName: e.target.value })}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Email Address" required>
              <Input 
                type="email"
                placeholder="Enter your business email"
                size="large"
                onChange={e => updateFormData('admin', { email: e.target.value })}
              />
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Phone Number">
                  <Input 
                    placeholder="Enter phone number"
                    size="large"
                    onChange={e => updateFormData('admin', { phone: e.target.value })}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Job Title">
                  <Input 
                    placeholder="e.g., CEO, Manager"
                    size="large"
                    onChange={e => updateFormData('admin', { jobTitle: e.target.value })}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Password" required>
              <Input.Password 
                placeholder="Create a secure password"
                size="large"
                onChange={e => updateFormData('admin', { password: e.target.value })}
              />
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      title: 'Business Setup',
      content: (
        <Card title="Configure your business preferences" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Form layout="vertical">
            <Form.Item label="Currency" required>
              <Select 
                placeholder="Select your primary currency"
                size="large"
                onChange={value => updateFormData('business', { currency: value })}
              >
                <Option value="USD">USD - US Dollar</Option>
                <Option value="EUR">EUR - Euro</Option>
                <Option value="GBP">GBP - British Pound</Option>
                <Option value="CAD">CAD - Canadian Dollar</Option>
                <Option value="AUD">AUD - Australian Dollar</Option>
              </Select>
            </Form.Item>
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="Timezone" required>
                  <Select 
                    placeholder="Select timezone"
                    size="large"
                    showSearch
                    onChange={value => updateFormData('business', { timezone: value })}
                  >
                    <Option value="UTC-8">Pacific Time (UTC-8)</Option>
                    <Option value="UTC-5">Eastern Time (UTC-5)</Option>
                    <Option value="UTC+0">GMT (UTC+0)</Option>
                    <Option value="UTC+1">Central European Time (UTC+1)</Option>
                    <Option value="UTC+8">Singapore Time (UTC+8)</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Fiscal Year Start">
                  <Select 
                    placeholder="Select month"
                    size="large"
                    onChange={value => updateFormData('business', { fiscalYear: value })}
                  >
                    <Option value="january">January</Option>
                    <Option value="april">April</Option>
                    <Option value="july">July</Option>
                    <Option value="october">October</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Primary Business Activities (Select all that apply)">
              <Select 
                mode="multiple"
                placeholder="Select your business activities"
                size="large"
                onChange={value => updateFormData('business', { activities: value })}
              >
                <Option value="sales">Sales & CRM</Option>
                <Option value="inventory">Inventory Management</Option>
                <Option value="accounting">Accounting & Finance</Option>
                <Option value="hr">Human Resources</Option>
                <Option value="project">Project Management</Option>
                <Option value="purchasing">Purchasing</Option>
                <Option value="reporting">Reporting & Analytics</Option>
              </Select>
            </Form.Item>
          </Form>
        </Card>
      )
    },
    {
      title: 'Complete',
      content: (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>
            ✅
          </div>
          <Title level={2}>Setup Complete!</Title>
          <Paragraph style={{ fontSize: '16px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Congratulations! Your ERP system is now configured and ready to use. 
            You can start managing your business operations immediately.
          </Paragraph>
          
          <Divider />
          
          <Title level={3}>What's Next?</Title>
          <Row gutter={[24, 24]} style={{ marginTop: '32px' }}>
            <Col xs={24} sm={8}>
              <Card bordered={false}>
                <Icon type="team" style={{ fontSize: '32px', color: '#1890ff', marginBottom: '16px' }} />
                <Title level={4}>Invite Your Team</Title>
                <Text>Add team members and assign roles</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false}>
                <Icon type="database" style={{ fontSize: '32px', color: '#52c41a', marginBottom: '16px' }} />
                <Title level={4}>Import Data</Title>
                <Text>Upload existing customer and product data</Text>
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card bordered={false}>
                <Icon type="bar-chart" style={{ fontSize: '32px', color: '#722ed1', marginBottom: '16px' }} />
                <Title level={4}>Explore Dashboard</Title>
                <Text>Start tracking your business metrics</Text>
              </Card>
            </Col>
          </Row>
        </div>
      )
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px 0'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <Card style={{ marginBottom: '24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '24px' }}>
            <Title level={3} style={{ margin: 0, textAlign: 'center' }}>
              ERP System Setup
            </Title>
            <Progress 
              percent={progress} 
              showInfo={false} 
              strokeColor={{
                '0%': '#108ee9',
                '100%': '#87d068',
              }}
              style={{ marginTop: '16px' }}
            />
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Text type="secondary">Step {currentStep + 1} of {steps.length}</Text>
            </div>
          </div>
          
          <Steps current={currentStep} style={{ marginBottom: '32px' }}>
            {steps.map((step, index) => (
              <Step key={index} title={step.title} />
            ))}
          </Steps>
        </Card>

        <Card style={{ borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minHeight: '500px' }}>
          <div style={{ minHeight: '400px' }}>
            {steps[currentStep].content}
          </div>
          
          <div style={{ marginTop: '32px', textAlign: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '24px' }}>
            {currentStep > 0 && (
              <Button 
                style={{ marginRight: '8px' }} 
                onClick={handlePrev}
                size="large"
              >
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button 
                type="primary" 
                onClick={handleNext} 
                loading={loading}
                size="large"
              >
                {currentStep === 0 ? 'Get Started' : 'Continue'}
              </Button>
            ) : (
              <Button 
                type="primary" 
                onClick={handleFinish} 
                loading={loading}
                size="large"
              >
                Launch My ERP System
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;