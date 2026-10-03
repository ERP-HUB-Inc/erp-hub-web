import React from "react";
import moment from "moment";
import ReactGA from "react-ga4";
import {
  Badge,
  Tag,
  Col, 
  DatePicker, 
  Icon,
  Button,
  Menu,
  Divider,
  Dropdown,
  Input,
  Pagination,
  Row,
  Tabs,
  Table,
  MonetaryValue
} from "@components/index";
import Datatable from "@layout/datatable";
import { Translate } from "@redux/index";
import history from "@router/index";
import StockIOService from "@services/StockIOService";
import "./index.css";
import { PageHeader } from "@components/PageHeader";
import { QuantityValue } from "@components/stateless/quantity.value";

const { TabPane } = Tabs;

// SME / small business ERP: keep it simple (PO No., Date, Vendor, Status, Amount).
// Enterprise ERP: include more workflow info (Approver, Delivery Date, Payment Terms).

export default class StockIOPage extends Datatable {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: "ALL",
      current: 1,
      data: [],
      pagination: {},
      selectedListIds: [],
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      deleting: false,
    };
    this.columns = [
      {
        title: "Batch No.",
        dataIndex: "number",
        key: "number",
        width: 180,
      },
      {
        title: <this.Translate id="text_date_created" />,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (value) => this.Util.formatDate(value, "D, MMM YYYY HH:mm"),
      },
      {
        title: "Total Quantity",
        dataIndex: "quantity",
        key: "quantity",
        align: "right",
        width: 120,
        render: (quantity, record) => (
          <QuantityValue
            quantity={quantity}
            showSign={true}
            sign={
              record.status === 3
                ? "~"
                : record.status === 0
                ? ""
                : record.type === "IN"
                ? "+"
                : "-"
            }
            type={record.type}
            status={record.status}
            unit="pcs"
            decimals={0}
          />
        ),
      },
      {
        title: "Total Amount",
        dataIndex: "amount",
        key: "amount",
        align: "right",
        width: 150,
        render: (amount, record) => (
          <MonetaryValue
            amount={parseFloat(amount)}
            showSign={true}
            sign={
              record.status === 3
                ? "~"
                : record.status === 0
                ? ""
                : record.type === "IN"
                ? "+"
                : "-"
            }
            type={record.type}
            status={record.status}
            currency=""
          />
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
        align: "center",
        filters: [
          { text: "Drafted", value: 0 },
          { text: "Pending", value: 1 },
          { text: "Applied (IN, OUT)", value: 2 },
          { text: "Deleted", value: 3 },
        ],
        width: 120,
        render: (status, record) => {
          const statusConfig = {
            0: { color: "#999", text: "Drafted" },
            1: { color: "orange", text: "Pending" },
            2: {
              color: record.type === "IN" ? "green" : "red",
              text: record.type === "IN" ? "Applied" : "Applied",
            },
            3: { color: "#fa8c16", text: "Deleted" },
          };
          const config = statusConfig[status] || {
            color: "default",
            text: "Unknown",
          };
          return (
            <Tag
              color={config.color}
              className="text-center"
              style={{
                borderRadius: 50,
                minWidth: 80,
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              {config.text}
            </Tag>
          );
        },
      },
      {
        title: "Stock Location",
        dataIndex: "location",
        key: "locationId",
        width: 220,
        render: (location) =>
          location ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "8px",
                  backgroundColor: "#f0f5ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  position: "relative",
                }}
              >
                <span style={{ fontSize: "20px" }}>📦</span>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor:
                      location.status === 1 ? "#52c41a" : "#d9d9d9",
                    border: "2px solid #fff",
                  }}
                />
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: "14px",
                    color: "#262626",
                    fontWeight: 500,
                    lineHeight: "20px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {location.name}
                </div>
                {location.address && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8c8c8c",
                      lineHeight: "16px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginTop: "2px",
                    }}
                  >
                    📍 {location.address}
                  </div>
                )}
                {!location.address && location.code && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#8c8c8c",
                      lineHeight: "16px",
                      marginTop: "2px",
                    }}
                  >
                    ID: {location.code}
                  </div>
                )}
              </div>
            </div>
          ) : (
            this.emptyText
          ),
      },
      {
        title: "Created By",
        dataIndex: "user",
        key: "userId",
        width: 150,
        render: (user) =>
          user ? (
            <div style={{ fontSize: "14px", color: "#262626" }}>
              {user.fullName}
            </div>
          ) : (
            this.emptyText
          ),
      },
      {
        title: "Received By",
        dataIndex: "receiver",
        key: "receiverId",
        width: 150,
        render: (receiver) =>
          receiver ? (
            <div style={{ fontSize: "14px", color: "#262626" }}>
              {receiver.fullName}
            </div>
          ) : (
            this.emptyText
          ),
      },
    ].concat(this.renderActionColumn());
    this.fetchingProp = "purchaseOrder";

    this.title = "Stock Movement";
    this.fetchingProp = "list";
    this.pathname = "/inventories/stock-io";
    this.pathCreate = "/inventories/create";
    this.pathUpdate = "/inventories/update";
    this.columnFilterWithKey = [
      "name",
      "number",
      "invoiceNo",
      "shippingFee",
      "requestTotal",
      "returnTotal",
      "receiveTotal",
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({ current: parseInt(params.get("offset")) });
    }

    this.fetchStockIO({ withPagination: true });
  }

  fetchStockIO({ type, withPagination, urlSearchParams }) {
    let search = "";
    let filter = {};
    let startDate = "";
    let endDate = "";
    let limit = this.pageSize;
    let offset = this.state.current;
    const params = urlSearchParams ?? new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;

    if (params.get("search")) {
      search = params.get("search");
    } else {
      params.delete("search");
    }

    if (params.get("from") && params.get("to")) {
      startDate = params.get("from");
      endDate = params.get("to");
    } else {
      params.delete("from");
      params.delete("to");
    }

    if (params.get("status")) {
      filter.status = params
        .get("status")
        .split(",")
        .map((status) => Number(status));
    }

    if (!withPagination) {
      offset = 0;
      params.delete("offset");
      this.setState({ current: 1 });
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({ loading: true });

    StockIOService.get({
      type,
      limit,
      offset,
      filter: JSON.stringify(filter),
      startDate,
      endDate,
      search,
    })
      .then((response) => {
        if (response.data && response.data.data) {
          this.setState({
            data: response.data.data,
            pagination: response.data.pagination,
          });
        }
      })
      .finally(() => this.setState({ loading: false }));
  }

  renderActionColumn() {
    return {
      title: <Translate id="text_action" />,
      key: "action",
      dataIndex: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        let disabledModified = record.status === 2 || record.status === 3;
        const menu = (
          <Menu>
            <Menu.Item key={1}>
              <Icon type="eye" style={{ marginRight: 10 }} />{" "}
              <Translate id="text_view" />
            </Menu.Item>
            <Menu.Item
              key={2}
              disabled={disabledModified}
              onClick={() => this.handleShowFormEdit(record)}
            >
              <Icon type="edit" style={{ marginRight: 10 }} />{" "}
              <Translate id="text_edit" />
            </Menu.Item>
            <Divider style={{ marginTop: 4, marginBottom: 4 }} />
            <Menu.Item
              key={4}
              disabled={disabledModified}
              onClick={() => this.handleConfirm(record)}
            >
              <Icon type="delete" style={{ marginRight: 10 }} />{" "}
              <Translate id="text_delete" />
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} placement="bottomLeft">
            <Button icon="more" />
          </Dropdown>
        );
      },
    };
  }

  handleShowFormEdit = (record) => {
    history.push({ pathname: "/inventories/stock-io/update/" + record.id });
  };

  getVendorInitials = (vendorName) => {
    if (!vendorName) return "XX";

    const words = vendorName.trim().split(" ");

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    } else {
      return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
    }
  };

  getVendorAvatarColor = (vendorName) => {
    const colors = [
      "#1890ff",
      "#52c41a",
      "#fa541c",
      "#eb2f96",
      "#722ed1",
      "#13c2c2",
      "#faad14",
      "#a0d911",
      "#096dd9",
      "#f5222d",
      "#fa8c16",
      "#eb2f96",
      "#722ed1",
      "#52c41a",
      "#1890ff",
      "#fadb14",
      "#a0d911",
      "#13c2c2",
      "#2f54eb",
      "#f5222d",
      "#fa541c",
      "#eb2f96",
      "#9254de",
      "#73d13d",
      "#40a9ff",
      "#ffa940",
      "#ff85c0",
      "#b37feb",
      "#5cdbd3",
      "#ffc53d",
    ];

    // Generate consistent index based on vendor name
    let hash = 0;
    for (let i = 0; i < vendorName.length; i++) {
      hash = vendorName.charCodeAt(i) + ((hash << 5) - hash);
    }

    return colors[Math.abs(hash) % colors.length];
  };

  onTabChange = (key) => {
    this.setState({ activeTab: key });

    const option = { withPagination: true };

    if (key !== "ALL") {
      option["type"] = key;
    }

    const params = new URLSearchParams(document.location.type);
    params.set("type", key);
    history.push({ pathname: this.pathname, search: params.toString() });

    this.fetchStockIO(option);
  };

  handleSearch = (e) => {
    const value = e.target.value;

    const params = new URLSearchParams(document.location.search);
    params.set("search", value ? value.trim() : "");
    history.push({ pathname: this.pathname, search: params.toString() });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchStockIO({ type: params.get("type"), withPagination: true, urlSearchParams: params });
    }, 1000);
  };

  handleChangeDateRange = (dates) => {
    const params = new URLSearchParams(document.location.search);
    params.set(
      "from",
      dates[0] && moment(dates[0]).isValid()
        ? moment(dates[0]).format("YYYY-MM-DD")
        : ""
    );
    params.set(
      "to",
      dates[1] && moment(dates[1]).isValid()
        ? moment(dates[1]).format("YYYY-MM-DD")
        : ""
    );

    history.push({ pathname: this.pathname, search: params.toString() });
    this.fetchStockIO({ withPagination: true, urlSearchParams: params });
  };

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({ current });
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchStockIO();
  };

  onChangePagination = (current, pageSize) => {
    if (current !== this.state.current) {
      const params = new URLSearchParams(document.location.search);
      params.set("limit", pageSize);
      params.set("offset", current);

      this.setState({ current });
      this.Util.pushParamsToURL(this.pathname, params.toString());
      this.fetchStockIO({ withPagination: true });
    }
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys,
      selectedRows,
    });
  };

  mapSelectedListIds(values) {
    return values.map((value) => value.id);
  }

  handleConfirm(record) {
    this.Util.sweetAlertConfirm(
      this.CATranslate("text_confirm_delete", this.props.locale),
      "This action will permanently remove this stock IO record."
    ).then((willDelete) => {
      if (willDelete) {
        StockIOService.archive(record.id)
          .then(() => {
            this.fetchStockIO({
              withPagination: true,
            });
          })
          .catch(() => {
            this.Message.error(
              this.CATranslate("error_warning_delete_po", this.props.locale)
            );
          })
          .finally(() => {});
      }
    });
  }

  renderPagination(pagination) {
    pagination = {
      total: pagination.total,
      pageSize: pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions,
    };

    const showTotal = (total) => {
      return `${this.CATranslate(
        "text_total",
        this.props.locale
      )} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return pagination.total > 0 ? (
      <div className="float-right">
        <Pagination
          size="small"
          showTotal={showTotal}
          showSizeChanger
          defaultCurrent={this.state.current}
          defaultPageSize={this.pageSize}
          onShowSizeChange={this.onShowSizeChange}
          onChange={this.onChangePagination}
          {...pagination}
        />
      </div>
    ) : (
      ""
    );
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (record) => ({
        name: record.name,
      }),
    };
    const params = new URLSearchParams(window.location.search);

    return (
      <React.Fragment>
        <div className="content-list">
          <div className="table-wrapper">
            <PageHeader
              title="Stock Movement"
              subtitle="Track and manage your stock movements"
              breadcrumbs={[
                { text: "Dashboard", href: "/dashboard" },
                { text: "Stock Movement" },
              ]}
              actions={[
                {
                  text: "Bulk Import Stock",
                  type: "default",
                  icon: "upload",
                  onClick: () => history.push("/inventories/stock-io/import"),
                },
                {
                  text: "New Stock In",
                  type: "primary",
                  icon: "plus",
                  onClick: () => {
                    ReactGA.event({
                      category: "Action Button",
                      action: "Add New PO",
                      label: "ERP HUB Web",
                    });

                    history.push("/inventories/stock-io/create");
                  },
                },
              ]}
            />

            <Tabs
              defaultActiveKey={this.state.activeTab}
              onChange={this.onTabChange}
            >
              <TabPane
                tab={
                  <span>
                    All
                    {/* <Badge count={57} style={{ marginLeft: 6 }} /> */}
                  </span>
                }
                key="ALL"
                style={{ paddingLeft: "40px", paddingRight: "40px" }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={24}>
                    <Input
                      name="search"
                      placeholder="Enter PO number, vendor name, or receiver"
                      suffix={<Icon type="search" />}
                      defaultValue={
                        params.get("search") ? params.get("search") : ""
                      }
                      style={{ height: 32, width: 350, marginRight: 10 }}
                      allowClear={true}
                      onChange={this.handleSearch}
                    />
                    <DatePicker.RangePicker
                      name="date"
                      placeholder={[
                        "From (e.g., 2025-11-01)",
                        "To (e.g., 2025-11-08)",
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
                    showTotal: (total) =>
                      `${this.CATranslate(
                        "text_total",
                        this.props.locale
                      )} ${total} ${this.CATranslate(
                        "text_records",
                        this.props.locale
                      )}`,
                    showSizeChanger: true,
                    defaultCurrent: this.state.current,
                    defaultPageSize: this.pageSize,
                    onShowSizeChange: this.onShowSizeChange,
                    onChange: this.onChangePagination,
                  }}
                  rowSelection={rowSelection}
                  loading={this.state.loading}
                  columns={this.columns}
                  dataSource={this.state.data}
                  onChange={(_, filterParams) => {
                    const params = new URLSearchParams(
                      document.location.search
                    );
                    params.set("status", filterParams.status.join(","));
                    this.fetchStockIO({
                      withPagination: true,
                      urlSearchParams: params,
                    });
                  }}
                  size="middle"
                />
              </TabPane>
              <TabPane
                tab={"IN"}
                key="IN"
                style={{ paddingLeft: "40px", paddingRight: "40px" }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={24}>
                    <Input
                      name="search"
                      placeholder="Enter PO number, vendor name, or receiver"
                      suffix={<Icon type="search" />}
                      defaultValue={
                        params.get("search") ? params.get("search") : ""
                      }
                      style={{ height: 32, width: 350, marginRight: 10 }}
                      allowClear={true}
                      onChange={this.handleSearch}
                    />
                    <DatePicker.RangePicker
                      name="date"
                      placeholder={[
                        "From (e.g., 2025-11-01)",
                        "To (e.g., 2025-11-08)",
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
                    showTotal: (total) =>
                      `${this.CATranslate(
                        "text_total",
                        this.props.locale
                      )} ${total} ${this.CATranslate(
                        "text_records",
                        this.props.locale
                      )}`,
                    showSizeChanger: true,
                    defaultCurrent: this.state.current,
                    defaultPageSize: this.pageSize,
                    onShowSizeChange: this.onShowSizeChange,
                    onChange: this.onChangePagination,
                  }}
                  rowSelection={rowSelection}
                  loading={this.state.loading}
                  columns={this.columns}
                  dataSource={this.state.data}
                  onRow={(record) => ({
                    onDoubleClick: () =>
                      history.push({
                        pathname: this.pathUpdate + "/" + record.id,
                      }),
                  })}
                  size="middle"
                />
              </TabPane>
              <TabPane
                tab={
                  <span>
                    Out
                    {/* <Badge count={57} style={{ marginLeft: 6 }} /> */}
                  </span>
                }
                key="OUT"
                style={{ paddingLeft: "40px", paddingRight: "40px" }}
              >
                <Row style={{ marginBottom: 10 }}>
                  <Col span={24}>
                    <Input
                      name="search"
                      placeholder="Enter PO number, vendor name, or receiver"
                      suffix={<Icon type="search" />}
                      defaultValue={
                        params.get("search") ? params.get("search") : ""
                      }
                      style={{ height: 32, width: 350, marginRight: 10 }}
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
                    showTotal: (total) =>
                      `${this.CATranslate(
                        "text_total",
                        this.props.locale
                      )} ${total} ${this.CATranslate(
                        "text_records",
                        this.props.locale
                      )}`,
                    showSizeChanger: true,
                    defaultCurrent: this.state.current,
                    defaultPageSize: this.pageSize,
                    onShowSizeChange: this.onShowSizeChange,
                    onChange: this.onChangePagination,
                  }}
                  rowSelection={rowSelection}
                  loading={this.state.loading}
                  columns={this.columns}
                  dataSource={this.state.data}
                  onRow={(record) => ({
                    onDoubleClick: () =>
                      history.push({
                        pathname: this.pathUpdate + "/" + record.id,
                      }),
                  })}
                  size="middle"
                />
              </TabPane>
            </Tabs>
          </div>
        </div>
      </React.Fragment>
    );
  }
}