import React from "react";
import { Divider, Row, Col, Input, Icon, Button, Table, Tag, Avatar, Rate } from "@components/index";
import VendorService from "@services/VendorService";
import Datatable from "@layout/datatable";
import { PageHeader } from "@components/PageHeader";
import Constant from "../redux/constant";
import VendorAction from "../redux/action";
import FormCreatePage from "../form.create";
import FormUpdatePage from "../form.update";

export default class VendorPage extends Datatable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      expandedRowKeys: []
    };
    this.columns = [
      {
        title: "Vendor ID",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Vendor Name",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Contact Person",
        dataIndex: "description",
        key: "description"
      },
      {
        title: "Address",
        dataIndex: "description",
        key: "description"
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        title: <this.Translate id="text_email" />,
        dataIndex: "email",
        key: "email"
      }
    ].concat(this.renderActionColumn());

    this.defaultColumns = [
      {
        title: 'Code',
        dataIndex: 'code',
        key: 'code',
        width: 120,
      },
      {
        title: 'Vendor Information',
        dataIndex: 'name',
        key: 'name',
        width: 360,
        render: (text, record) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              size={48} 
              style={{ 
                backgroundColor: this.getAvatarColor(record.name),
                fontSize: '18px',
                fontWeight: 'bold',
                flexShrink: 0
              }}
            >
              {record.name.substring(0, 2).toUpperCase()}
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ marginBottom: '2px' }}>
                <strong style={{ fontSize: '14px', color: '#262626' }}>
                  {record.name}
                </strong>
              </div>
              <div style={{ fontSize: '12px', color: '#595959', marginBottom: '2px' }}>
                <Icon type="user" style={{ marginRight: '4px' }} />
                {record.contactPerson}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
                <Icon type="phone" style={{ marginRight: '4px' }} />
                {record.phoneNumber}
                <Divider type="vertical" />
                <Icon type="mail" style={{ marginRight: '4px' }} />
                <a href={`mailto:${record.email}`} style={{ color: '#1890ff' }}>
                  {record.email}
                </a>
              </div>
            </div>
          </div>
        ),
      },
      {
        title: 'Vendor Type',
        dataIndex: 'vendorType',
        key: 'vendorType',
        width: 150,
        filters: [
          { text: 'Manufacturer', value: 'Manufacturer' },
          { text: 'Distributor', value: 'Distributor' },
          { text: 'Service Provider', value: 'Service Provider' },
        ],
        onFilter: (value, record) => record.vendorType === value,
      },
      {
        title: 'Vendor Category',
        dataIndex: 'vendorCategory',
        key: 'vendorCategory',
        width: 150,
      },
      {
        title: 'Lead Time',
        dataIndex: 'leadTimeDays',
        key: 'leadTimeDays',
        width: 120,
        render: (days) => `${days} days`,
        sorter: (a, b) => a.leadTimeDays - b.leadTimeDays,
      },
      {
        title: 'Payment Terms',
        dataIndex: 'paymentTerms',
        key: 'paymentTerms',
        width: 140,
      },
      {
        title: 'Rating',
        dataIndex: 'rating',
        key: 'rating',
        width: 150,
        render: (rating) => (
          <div>
            <Rate disabled defaultValue={rating} allowHalf style={{ fontSize: 14 }} />
            <span style={{ marginLeft: 8, color: '#999' }}>{rating}</span>
          </div>
        ),
        sorter: (a, b) => a.rating - b.rating,
      },
      {
        title: 'Notes',
        dataIndex: 'notes',
        key: 'notes'
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 120,
        filters: [
          { text: 'Active', value: 'Active' },
          { text: 'Inactive', value: 'Inactive' },
          { text: 'Blacklisted', value: 'Blacklisted' },
        ],
        onFilter: (value, record) => record.status === value,
        render: (status) => (
          <Tag color={this.getStatusColor(status)}>{'Active'.toUpperCase()}</Tag>
        )
      }
    ].concat(this.renderActionColumn());

    this.title = "Vendors";
    this.placeholder = "Search vendors...";
    this.formCreate = <FormCreatePage />;
    this.formUpdate = <FormUpdatePage />;
    this.service = VendorService;
    this.action = VendorAction;
    this.placeHolderForGeneralSearch = "general_search";
    this.columnFilterWithKey = ["name", "phoneNumber", "email", "description"];
    this.RESET_CONSTANT = Constant.RESET_SUPPLIER;
  }

  getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'green';
      case 'Inactive':
        return 'orange';
      case 'Blacklisted':
        return 'red';
      default:
        return 'default';
    }
  };

  getAvatarColor = (vendorName) => {
    const colors = [
      '#f56a00', // Orange
      '#7265e6', // Purple
      '#ffbf00', // Gold
      '#00a2ae', // Cyan
      '#1890ff', // Blue
      '#52c41a', // Green
      '#eb2f96', // Magenta
      '#722ed1', // Purple-Violet
      '#13c2c2', // Cyan-Blue
      '#fa8c16', // Orange-Yellow
      '#2f54eb', // Blue-Purple
      '#fa541c', // Red-Orange
    ];
    
    // Generate a hash from the vendor name for consistent color
    let hash = 0;
    for (let i = 0; i < vendorName.length; i++) {
      hash = vendorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Expandable row render - shows hidden details
  expandedRowRender = (record) => {
    return (
      <div style={{ 
        padding: '16px 24px',
        backgroundColor: '#fafafa',
        border: '1px solid #f0f0f0',
        borderRadius: '4px',
        margin: '8px 0'
      }}>
        <h4 style={{ marginTop: 0, marginBottom: '12px', color: '#262626' }}>
          Transaction Details
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
              Payment Terms
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
              {record.paymentTerms}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
              Lead Time
            </div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#262626' }}>
              {record.leadTime} days
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
              Currency
            </div>
            <div>
              <Tag color="blue" style={{ margin: 0 }}>{record.currency}</Tag>
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
              Rating
            </div>
            <div>
              <Rate disabled defaultValue={record.rating} allowHalf style={{ fontSize: 14 }} />
              <span style={{ marginLeft: 8, color: '#595959', fontSize: '14px', fontWeight: '500' }}>
                {record.rating}
              </span>
            </div>
          </div>
        </div>
        
        <Divider style={{ margin: '12px 0' }} />
        
        <div>
          <div style={{ fontSize: '12px', color: '#8c8c8c', marginBottom: '4px' }}>
            Notes / Remarks
          </div>
          <div style={{ 
            fontSize: '14px', 
            color: '#595959',
            backgroundColor: 'white',
            padding: '8px 12px',
            borderRadius: '4px',
            border: '1px solid #d9d9d9'
          }}>
            {record.notes || 'No notes available'}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
      })
    };
    const params = new URLSearchParams(window.location.search);

    return (<React.Fragment>
        <div className="content-list">
          <div className="table-wrapper">
            <PageHeader
              title="Vendors"
              subtitle="Manage your suppliers and vendor details"
              breadcrumbs={[
                  { text: 'Dashboard', href: '/dashboard' },
                  { text: 'Vendors' }
              ]}
              actions={[
                  {
                    text: "New Vendor",
                    type: 'primary',
                    icon: 'plus',
                    onClick: () => {
                        ReactGA.event({
                          category: "Action Button",
                          action: "Add New Vendor",
                          label: "ERP HUB Web",
                        });

                        history.push("/vendors/create");
                    }
                  }
              ]}
            />

            <div style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 25 }}>
              <Row style={{ marginBottom: 10 }}>
                <Col md={24}>
                  <Input
                      name="search"
                      placeholder="Search by vendor name, phone, email, or code..."
                      suffix={<Icon type="search" />}
                      defaultValue={params.get("search") ? params.get("search") : ""}
                      style={{width: 380, marginRight: 10}}
                      allowClear={true}
                      onChange={this.handleSearch}
                  />
                </Col>
              </Row>

              <Table
                  rowKey="key"
                  bordered
                  pagination={{
                    total: this.props.list.pagination.total,
                    pageSize: this.props.list.pagination.limit,
                    current: this.state.current,
                    pageSizeOptions: this.pageSizeOptions,
                    showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
                    showSizeChanger: true,
                    defaultCurrent: this.state.current,
                    defaultPageSize: this.pageSize,
                    onShowSizeChange: this.onShowSizeChange,
                    onChange: this.onChangePagination
                  }}
                  // expandedRowRender={this.expandedRowRender}
                  // expandedRowKeys={this.expandedRowKeys}
                  // onExpandedRowsChange={(keys) => this.setState({ expandedRowKeys: keys })}
                  // expandIcon={({ expanded, onExpand, record }) => (
                  //   <Button
                  //     type="link"
                  //     size="small"
                  //     onClick={e => onExpand(record, e)}
                  //     style={{ padding: 0, height: 'auto' }}
                  //   >
                  //     {expanded ? 'Close Details' : 'View Details'}
                  //     <Icon type={expanded ? 'up' : 'down'} style={{ marginLeft: 4 }} />
                  //   </Button>
                  // )}
                  rowSelection={rowSelection}
                  loading={this.props.list.fetching}
                  columns={this.defaultColumns}
                  dataSource={this.props.list.list}
                  onRow={record =>({
                    onDoubleClick:() => history.push({pathname: this.pathUpdate+"/"+record.id})
                  })}
                  size="middle"
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}