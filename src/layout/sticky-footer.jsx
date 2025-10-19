import React from 'react';
import { Layout, Button, Row, Col } from 'antd';

const { Header, Content, Footer } = Layout;

class StickyFooterPage extends React.Component {
  render() {
    return (
        <Footer style={{
          background: '#fff',
          padding: '16px 24px',
          borderTop: '1px solid #f0f0f0',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.05)',
          flexShrink: 0
        }}>
          <Row gutter={16} type="flex" justify="flex-end">
            <Col>
              <Button size="large">Cancel</Button>
            </Col>
            <Col>
              <Button type="primary" size="large">Save</Button>
            </Col>
          </Row>
        </Footer>
    );
  }
}

export default StickyFooterPage;