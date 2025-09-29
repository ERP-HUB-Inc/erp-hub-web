import React from "react";
import moment from "moment";
import ReactGA from "react-ga4";
import {
  Tag,
  Col, 
  DatePicker, 
  Icon, 
  Input,
  Pagination, 
  Row,
  Tabs,
  Table,
  Avatar,
  MonetaryValue
} from "@components/index";
import Datatable from "@layout/datatable";
import Enum from "@enums/index";
import history from "@router/index";
import PurchaseService from "@services/PurchaseOrderService";
import "./index.css";
import { PageHeader } from "@components/PageHeader";

const { TabPane } = Tabs;

// SME / small business ERP: keep it simple (PO No., Date, Vendor, Status, Amount).
// Enterprise ERP: include more workflow info (Approver, Delivery Date, Payment Terms).

export default class PurchaseOrderPage extends Datatable {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      data: [],
      pagination: {},
      dataForSendMail: null,
      emailForPushToSupplier: null,
      selectedListIds: [],
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      loading: false,
      deleting: false,
      isHasAccessPermission: null
    };
    this.columns = [
      {
        title: "Batch No.",
        dataIndex: "number",
        key: "number"
      },
      {
        title: "Type",
        dataIndex: "number",
        key: "number"
      },
      // { move this column to display on hover
      //   title: <this.Translate id="text_notes"/>,
      //   dataIndex: "description",
      //   key: "description"
      // },
      {
        title: "Created By",
        dataIndex: "supplier",
        key: "supplierId",
        render: (supplier) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Avatar 
              size={40} 
              style={{ 
                backgroundColor: this.getVendorAvatarColor(supplier.name),
                fontSize: '14px',
                fontWeight: 500,
                color: '#fff'
              }}
            >
              {this.getVendorInitials(supplier.name)}
            </Avatar>
            <div>
              <div style={{ fontWeight: 500, fontSize: '14px', color: '#262626' }}>
                {supplier.name}
              </div>
              <div style={{ fontSize: '13px', color: '#8c8c8c', marginTop: '2px' }}>
                {supplier.email}
              </div>
              <div style={{ fontSize: '12px', color: '#8c8c8c', marginTop: '1px' }}>
                {supplier.phoneNumber}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: <this.Translate id="text_date_created" />,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: value => this.Util.formatDate(value, "D, MMM YYYY HH:mm")
      },
      {
        title: "Total Value",
        dataIndex: "requestTotal",
        key: "requestTotal",
        align: "right",
        render: (text, record) => {
          const requestTotal = record.requestTotal;
          const receiveTotal = record.receiveTotal;
          const returnTotal = record.returnTotal;

          let key = "requestTotal";
          if (record.step === Enum.PO_STEP.RECEIVED) {
            key = "receiveTotal";
          } else if (record.step === Enum.PO_STEP.RETURN) {
            key = "returnTotal";
          }

          return <MonetaryValue amount={requestTotal} />
        }
      },
      {
        title: "Total Qty",
        dataIndex: "receiver",
        key: "receiverId",
        render: receiver => receiver ? <span>{receiver.fullName}</span> : this.emptyText
      },
      {
        title: "Status",
        dataIndex: "step",
        key: "step",
        width: 100,
        render: step => step in this.PO_STEP_STR ? <Tag color={this.PO_STEP_STR[step].color} className="text-center" style={{ borderRadius: 50 }}>{this.PO_STEP_STR[step].name}</Tag> : ""
      }
    ].concat(this.renderActionColumn());
    this.fetchingProp = "purchaseOrder";
    this.service = PurchaseService;
    this.title = "Stock In/Out";
    this.fetchingProp = "list";
    this.pathname = "/inventories/stock-inout";
    this.pathCreate= "/purchase-orders/create";
    this.pathUpdate= "/purchase-orders/update";
    this.permissionModuleCode = "purchase_order";
    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="text_draft" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_returned" />, color:  this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color:  this.Enum.PO_STEP_COLOR.PAID}
    };
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    this.fetchList(true);

  }

  getVendorInitials = (vendorName) => {
    if (!vendorName) return 'XX';
    
    const words = vendorName.trim().split(' ');

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  };

  getVendorAvatarColor = (vendorName) => {
    const colors = [
      '#1890ff', '#52c41a', '#fa541c', '#eb2f96', '#722ed1',
      '#13c2c2', '#faad14', '#a0d911', '#096dd9', '#f5222d',
      '#fa8c16', '#eb2f96', '#722ed1', '#52c41a', '#1890ff',
      '#fadb14', '#a0d911', '#13c2c2', '#2f54eb', '#f5222d',
      '#fa541c', '#eb2f96', '#9254de', '#73d13d', '#40a9ff',
      '#ffa940', '#ff85c0', '#b37feb', '#5cdbd3', '#ffc53d'
    ];
    
    // Generate consistent index based on vendor name
    let hash = 0;
    for (let i = 0; i < vendorName.length; i++) {
      hash = vendorName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  fetchList(withPagination= false) {
    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }else{
      params.delete("search");
    }

    if (params.get("date")) {
      ranges = JSON.stringify({column: "invoiceDate", value: [params.get("date"), params.get("date")]});
    }else{
      params.delete("date");
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true});
    this.service.get(limit, offset, "", "", JSON.stringify(filter), searchKey, ranges)
        .then((response) => {
          if (response.data && response.data.data) {
            this.setState({
              data: response.data.data,
              pagination: response.data.pagination
            });
          }
        })
        .finally(() => this.setState({loading: false}));
  }

  checkIsAllowDeleteRecordOrNot() {
    if (
        this.state.selectedListIds &&
        this.state.selectedListIds.length > 0 &&
        this.props[this.fetchingProp]
    ) {
      let isHasSystemRecord = false;
      this.state.selectedListIds.forEach((selectedId) => {
        const result = this.props[this.fetchingProp].list.find(
            (record) => record.id === selectedId
        );

        if (result && result.isSystem === this.Enum.IS_SYSTEM) {
          isHasSystemRecord = true;
          this.Message.warning(
              this.CATranslate(
                  "text_warning_delete_system_record",
                  this.props.locale
              )
          );
        }
      });
      return isHasSystemRecord;
    }
  }

  handleSearch = (e) => {
    const queryParams = new URLSearchParams(document.location.search);
    const value = e.target.value;
    queryParams.set("search", value ? value.trim() : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 1000);
  }

  handleChangeDate = (date) => {
    const queryParams = new URLSearchParams(document.location.search);
    queryParams.set("date", date ? moment(date).format("YYYY-MM-DD") : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
    this.fetchList();
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys,
      selectedRows
    });
  }

  mapSelectedListIds(values) {
    return values.map(value => value.id);
  }

  handleDelete = () => {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.fetchList(true);
          this.setState({
            selectedRowKeys: []
          });
        })
        .catch(() => {
          this.Message.error(this.CATranslate("error_warning_delete_po", this.props.locale));
        })
        .finally(() => {
          this.setState({
            modalVisible: false,
            deleting: false
        });
      });

    }
  }

  showDeleteModal = () => {
    if (this.checkIsAllowDeleteRecordOrNot()) {
      return;
    }
    if (this.state.selectedRowKeys.length > 0) {
      this.setState({modalVisible: true, showDeleteModal: true});
    } else {
      this.Message.warning(this.CATranslate("text_warning_select_row_to_delete", this.props.locale));
    }
  }

  renderPagination(pagination) {
    pagination = {
      total: pagination.total,
      pageSize: pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return(
        pagination.total > 0 ?
            <div className="float-right">
              <Pagination
                  size="small"
                  showTotal={showTotal}
                  showSizeChanger
                  defaultCurrent={this.state.current}
                  defaultPageSize={this.pageSize}
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onChangePagination}
                  {...pagination} />
            </div>
            :
            ""
    );
  }

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
              title="Stock In/Out"
              subtitle="Track and manage your stock movements"
              breadcrumbs={[
                  { text: "Dashboard", href: "/dashboard" },
                  { text: "Stock In/Out" }
              ]}
              actions={[
                  {
                    text: "Import",
                    type: "default",
                    icon: "upload",
                    onClick: () => {}
                  },
                  {
                    text: "New Stock In",
                    type: 'primary',
                    icon: 'plus',
                    onClick: () => {
                        ReactGA.event({
                          category: "Action Button",
                          action: "Add New PO",
                          label: "ERP HUB Web",
                        });

                        history.push("/purchase-orders/create");
                    }
                  }
              ]}
            />

            <Tabs defaultActiveKey="item">
              <TabPane tab="Items" key="purchase-orders" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                  <Row  style={{ marginBottom: 10 }}>
                    <Col span={24}>
                      <Input
                          name="search"
                          placeholder="Enter PO number, vendor name, or receiver"
                          suffix={<Icon type="search" />}
                          defaultValue={params.get("search") ? params.get("search") : ""}
                          style={{height: 32, width: 350, marginRight: 10}}
                          allowClear={true}
                          onChange={this.handleSearch}
                      />
                      <DatePicker.RangePicker
                        name="date"
                        placeholder={[
                          this.CATranslate("text_start_date", this.props.locale),
                          this.CATranslate("text_end_date", this.props.locale),
                        ]}
                        defaultValue={
                          params.get("dateRange")
                            ? [
                                moment(params.get("dateRange").split(",")[0]),
                                moment(params.get("dateRange").split(",")[1]),
                              ]
                            : null
                        }
                        onChange={this.handleChangeDateRange}
                        style={{ maxWidth: 350, marginRight: 10 }}
                      />
                    </Col>
                  </Row>

                  <Table
                      rowKey="id"
                      bordered
                      pagination={{
                        total: this.state.pagination.total,
                        pageSize: this.state.pagination.limit,
                        current: this.state.current,
                        pageSizeOptions: this.pageSizeOptions,
                        showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
                        showSizeChanger: true,
                        defaultCurrent: this.state.current,
                        defaultPageSize: this.pageSize,
                        onShowSizeChange: this.onShowSizeChange,
                        onChange: this.onChangePagination
                      }}
                      rowSelection={rowSelection}
                      loading={this.state.loading}
                      columns={this.columns}
                      dataSource={this.state.data}
                      onRow={record =>({
                        onDoubleClick:() => history.push({pathname: this.pathUpdate+"/"+record.id})
                      })}
                      size="middle"
                  />
              </TabPane>
              <TabPane tab="Batch" key="stock" style={{ paddingLeft: "40px", paddingRight: "40px" }}>
                  <Row  style={{ marginBottom: 10 }}>
                    <Col span={24}>
                      <Input
                          name="search"
                          placeholder="Enter PO number, vendor name, or receiver"
                          suffix={<Icon type="search" />}
                          defaultValue={params.get("search") ? params.get("search") : ""}
                          style={{height: 32, width: 350, marginRight: 10}}
                          allowClear={true}
                          onChange={this.handleSearch}
                      />
                      <DatePicker.RangePicker
                        name="date"
                        placeholder={[
                          this.CATranslate("text_start_date", this.props.locale),
                          this.CATranslate("text_end_date", this.props.locale),
                        ]}
                        defaultValue={
                          params.get("dateRange")
                            ? [
                                moment(params.get("dateRange").split(",")[0]),
                                moment(params.get("dateRange").split(",")[1]),
                              ]
                            : null
                        }
                        onChange={this.handleChangeDateRange}
                        style={{ maxWidth: 350, marginRight: 10 }}
                      />
                    </Col>
                  </Row>

                  <Table
                      rowKey="id"
                      bordered
                      pagination={{
                        total: this.state.pagination.total,
                        pageSize: this.state.pagination.limit,
                        current: this.state.current,
                        pageSizeOptions: this.pageSizeOptions,
                        showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
                        showSizeChanger: true,
                        defaultCurrent: this.state.current,
                        defaultPageSize: this.pageSize,
                        onShowSizeChange: this.onShowSizeChange,
                        onChange: this.onChangePagination
                      }}
                      rowSelection={rowSelection}
                      loading={this.state.loading}
                      columns={this.columns}
                      dataSource={this.state.data}
                      onRow={record =>({
                        onDoubleClick:() => history.push({pathname: this.pathUpdate+"/"+record.id})
                      })}
                      size="middle"
                  />
              </TabPane>
            </Tabs>
          </div>
        </div>

        <this.Modal
            visible={this.state.modalVisible}
            wrapClassName="confirm-delete"
            footer={null}>
          <div>
            { this.state.showDeleteModal &&
            <React.Fragment>
              <span className="icon-help icon-padding-right"></span>
              <span className="title">COMPLETED</span><br/>
              <span><this.Translate id="text_confirm_delete" /></span>
            </React.Fragment>
            }
          </div>
          <div className="ant-modal-footer">
            <this.Button className="danger" onClick={()=>this.setState({modalVisible: false})}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel"/>
            </this.Button>
            <this.Button onClick={this.handleDelete} loading={this.state.deleting} className="info">
              <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes"/>
            </this.Button>
          </div>
        </this.Modal>
      </React.Fragment>
    );
  }

}