import React from "react";
import moment from "moment";
import ReactGA from "react-ga4";
import swal from "sweetalert";
import {
  Col, 
  DatePicker, 
  Icon, 
  Input,
  Pagination, 
  Row,
  Tabs,
  Table,
  Avatar,
  Divider,
  Dropdown,
  Menu,
  MonetaryValue,
  Button,
  Tag
} from "@components/index";
import Datatable from "@layout/datatable";
import { Link } from "react-router-dom";
import { Translate } from "@redux/index";
import Enum from "@enums/index";
import history from "@router/index";
import PurchaseService from "@services/PurchaseOrderService";
import "./index.css";
import { PageHeader } from "@components/PageHeader";
import { QuantityValue } from "@components/stateless/quantity.value";

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
      isHasAccessPermission: null,
    };
    this.columns = [
      {
        title: "PO No.",
        dataIndex: "number",
        key: "number",
      },
      {
        title: <Translate id="text_vendor" />,
        dataIndex: "supplier",
        key: "supplierId",
        render: (supplier) => (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Avatar
              size={40}
              style={{
                backgroundColor: this.getVendorAvatarColor(supplier.name),
                fontSize: "14px",
                fontWeight: 500,
                color: "#fff",
              }}
            >
              {this.getVendorInitials(supplier.name)}
            </Avatar>
            <div>
              <div
                style={{ fontWeight: 500, fontSize: "14px", color: "#262626" }}
              >
                {supplier.name}
              </div>
              <div
                style={{ fontSize: "13px", color: "#8c8c8c", marginTop: "2px" }}
              >
                {supplier.email}
              </div>
              <div
                style={{ fontSize: "12px", color: "#8c8c8c", marginTop: "1px" }}
              >
                {supplier.phoneNumber}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Item Count",
        dataIndex: "itemCount",
        key: "itemCount",
        render: (itemCount) => (
          <QuantityValue quantity={itemCount} unit="items" decimals={0} />
        ),
      },
      {
        title: "Total Quantity",
        dataIndex: "totalQuantity",
        key: "totalQuantity",
        render: (totalQuantity) => (
          <QuantityValue quantity={totalQuantity} unit="units" decimals={0} />
        ),
      },
      {
        title: <Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount) => {
          return <MonetaryValue amount={discount} />;
        },
      },
      {
        title: <Translate id="text_shipping_fee" />,
        dataIndex: "shippingFee",
        key: "shippingFee",
        align: "right",
        render: (shippingFee) => {
          return <MonetaryValue amount={shippingFee} />;
        },
      },
      {
        title: <Translate id="text_total_amount" />,
        dataIndex: "totalAmount",
        key: "totalAmount",
        align: "right",
        render: (totalAmount) => {
          return <MonetaryValue amount={totalAmount} />;
        },
      },
      {
        title: <Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        align: "center",
        width: 100,
        render: (status) =>
          status in this.PO_STATUS_STR ? (
            <Tag
              color={this.PO_STATUS_STR[status].color}
              className="text-center"
              style={{
                borderRadius: 50,
                textTransform: "uppercase",
                fontWeight: "bold",
              }}
            >
              {this.PO_STATUS_STR[status].name}
            </Tag>
          ) : (
            ""
          ),
      },
      {
        title: <Translate id="text_created_by" />,
        dataIndex: "user",
        key: "userId",
        render: (user) =>
          user ? <span>{user.fullName}</span> : this.emptyText,
      },
      {
        title: <Translate id="text_approved_by" />,
        dataIndex: "receiver",
        key: "receiverId",
        render: (receiver) =>
          receiver ? <span>{receiver.fullName}</span> : this.emptyText,
      },
      {
        title: <Translate id="text_date_created" />,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: (value) => this.Util.formatDate(value, "D, MMM YYYY HH:mm"),
      },
    ].concat(this.renderActionColumn());
    this.fetchingProp = "purchaseOrder";
    this.service = PurchaseService;
    this.title = <Translate id="text_sales" />;
    this.fetchingProp = "list";
    this.pathname = "/purchase-orders";
    this.pathCreate = "/purchase-orders/create";
    this.pathUpdate = "/purchase-orders/update";
    this.permissionModuleCode = "purchase_order";
    this.PO_STATUS_STR = {
      [Enum.PO_STATUS.DRAFT]: {
        name: <Translate id="text_draft" />,
        color: this.Enum.PO_STEP_COLOR.DRAFT,
      },
      [Enum.PO_STATUS.ORDERED]: {
        name: <Translate id="text_ordered" />,
        color: this.Enum.PO_STEP_COLOR.PROCESS,
      },
      [Enum.PO_STATUS.FULL_RECEIVED]: {
        name: <Translate id="text_received" />,
        color: this.Enum.PO_STEP_COLOR.RECEIVE,
      },
      [Enum.PO_STATUS.PARTIAL_RECEIVED]: {
        name: <Translate id="text_received" />,
        color: this.Enum.PO_STEP_COLOR.RECEIVE,
      },
      [Enum.PO_STATUS.CLOSED]: {
        name: <Translate id="text_cancel" />,
        color: this.Enum.PO_STEP_COLOR.CANCEL,
      },
      [Enum.PO_STATUS.CANCELLED]: {
        name: <Translate id="text_returned" />,
        color: this.Enum.PO_STEP_COLOR.RETURN,
      },
    };
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

    this.fetchList(true);
  }

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

  fetchList(withPagination = false, urlSearchParams = null) {
    let search = "";
    let limit = this.pageSize;
    let ranges = "";
    let startDate = "";
    let endDate = "";
    let offset = this.state.current;
    const params =
      urlSearchParams ?? new URLSearchParams(window.location.search);

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

    if (!withPagination) {
      offset = 0;
      params.delete("offset");
      this.setState({ current: 1 });
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({ loading: true });
    this.service
      .get({ limit, offset, search, startDate, endDate, ranges })
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
    const value = e.target.value;

    const queryParams = new URLSearchParams(document.location.search);
    queryParams.set("search", value ? value.trim() : "");

    history.push({ pathname: this.pathname, search: queryParams.toString() });

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList(true, queryParams);
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
    this.fetchList(true, params);
  };

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({ current });
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  };

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({ current });
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
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

  showDeleteModal = () => {
    if (this.checkIsAllowDeleteRecordOrNot()) {
      return;
    }
    if (this.state.selectedRowKeys.length > 0) {
      this.setState({ modalVisible: true, showDeleteModal: true });
    } else {
      this.Message.warning(
        this.CATranslate("text_warning_select_row_to_delete", this.props.locale)
      );
    }
  };

  handleConfirm(record) {
    this.Util.sweetAlertConfirm(
      this.CATranslate("text_confirm_delete", this.props.locale),
      "This action will permanently remove this PO record."
    ).then((willDelete) => {
      if (willDelete) {
        PurchaseService.deletePurchaseOrder(record.id)
          .then(() => {
            // Show success message
            swal(
              "Deleted!",
              "The Purchase Order has been successfully removed.",
              "success"
            );

            this.fetchList(true);
          })
          .catch(() => {
            this.Message.error(
              this.CATranslate("error_warning_delete_po", this.props.locale)
            );
          });
      }
    });
  }

  renderActionColumn() {
    return {
      title: <Translate id="text_action" />,
      key: "action",
      dataIndex: "action",
      align: "center",
      width: 100,
      render: (_, record) => {
        const menu = (
          <Menu>
            <Menu.Item key={1}>
              <Link to={`/purchase-orders/update/${record.id}`}>
                <Icon type="eye" style={{ marginRight: 10 }} />{" "}
                <Translate id="text_view" />
              </Link>
            </Menu.Item>
            <Menu.Item key={2}>
              <Link to={`/purchase-orders/update/${record.id}`}>
                <Icon type="edit" style={{ marginRight: 10 }} />{" "}
                <Translate id="text_edit" />
              </Link>
            </Menu.Item>
            <Divider style={{ marginTop: 4, marginBottom: 4 }} />
            <Menu.Item key={4} onClick={() => this.handleConfirm(record)}>
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
              title={`Purchase Orders(${this.state?.pagination?.total || 0})`}
              subtitle="See and manage your purchase orders"
              breadcrumbs={[
                { text: "Dashboard", href: "/dashboard" },
                { text: "Purchase Orders" },
              ]}
              actions={[
                // {
                //   text: "Import Order",
                //   type: "default",
                //   icon: "upload",
                //   onClick: () => {},
                // },
                {
                  text: "New Purchase Order",
                  type: "primary",
                  icon: "plus",
                  onClick: () => {
                    ReactGA.event({
                      category: "Action Button",
                      action: "Add New PO",
                      label: "ERP HUB Web",
                    });

                    history.push("/purchase-orders/create");
                  },
                },
              ]}
            />

            <div style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 25 }}>
              <Row style={{ marginBottom: 10 }}>
                <Col md={24}>
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
                  {/* <Button shape="circle" icon="reload" />
                      <Button shape="circle" icon="setting" /> */}
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
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}