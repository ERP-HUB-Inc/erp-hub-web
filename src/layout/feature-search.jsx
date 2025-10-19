import React from 'react';
import { AutoComplete, Icon, Layout } from 'antd';

const { Header } = Layout;

export class ERPHeaderSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      searchValue: ''
    };
  }

  // Mock data - replace with your actual data
  mockSearchData = [
    // Features/Modules
    { title: 'Item Management', category: 'Features', path: '/item-management' },
    { title: 'Purchase Order', category: 'Features', path: '/purchase-order' },
    { title: 'Sales Order', category: 'Features', path: '/sales-order' },
    { title: 'Inventory', category: 'Features', path: '/inventory' },
    { title: 'Accounting', category: 'Features', path: '/accounting' },
    { title: 'Customer Management', category: 'Features', path: '/customer' },
    { title: 'Supplier Management', category: 'Features', path: '/supplier' },
    
    // Sample Records
    { title: 'Item SKU-001', category: 'Items', path: '/item-management/SKU-001' },
    { title: 'PO-2025-001', category: 'Purchase Orders', path: '/purchase-order/1' },
    { title: 'SO-2025-005', category: 'Sales Orders', path: '/sales-order/5' },
    { title: 'Customer ABC Corp', category: 'Customers', path: '/customer/1' },
    { title: 'Supplier XYZ Ltd', category: 'Suppliers', path: '/supplier/1' },
  ];

  handleSearch = (value) => {
    this.setState({ searchValue: value });

    if (!value) {
      this.setState({ dataSource: [] });
      return;
    }

    const filtered = this.mockSearchData.filter(item =>
      item.title.toLowerCase().includes(value.toLowerCase())
    );

    // Group by category
    const grouped = {};
    filtered.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });

    // Convert to AutoComplete format
    const dataSource = Object.keys(grouped).map(category => ({
      label: <span style={{ fontSize: '12px', color: '#999', fontWeight: 'bold' }}>{category}</span>,
      options: grouped[category].map(item => ({
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{item.title}</span>
            <span style={{ fontSize: '12px', color: '#999' }}>{item.category}</span>
          </div>
        ),
        value: item.title,
        path: item.path
      }))
    }));

    this.setState({ dataSource });
  };

  handleSelect = (value, option) => {
    console.log('Selected:', value, option);
    // Navigate to the path
    // window.location.href = option.path;
    message.info(`Navigating to ${option.path}`);
    this.setState({ searchValue: '' });
  };

  render() {
    const { dataSource, searchValue } = this.state;

    return (
      <Header style={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
          ERP System
        </div>

        <AutoComplete
          value={searchValue}
          dataSource={dataSource}
          onSearch={this.handleSearch}
          onSelect={this.handleSelect}
          placeholder="Search features, records..."
          style={{ width: '300px' }}
          optionLabelProp="label"
          filterOption={false}
          notFoundContent={
            searchValue ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#999' }}>
                No results found for "{searchValue}"
              </div>
            ) : null
          }
        >
          <input
            placeholder="🔍 Search..."
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #d9d9d9',
              fontSize: '14px',
              width: '100%'
            }}
            onFocus={(e) => e.target.style.borderColor = '#1890ff'}
            onBlur={(e) => e.target.style.borderColor = '#d9d9d9'}
          />
        </AutoComplete>

        <div style={{ fontSize: '14px', color: '#999' }}>
          User: Admin
        </div>
      </Header>
    );
  }
}