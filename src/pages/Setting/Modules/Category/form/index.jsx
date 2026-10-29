import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Dropdown, Icon, Input, Menu, Modal, Table, Tooltip, message } from "antd";
import { Archive, CheckCircle2, ChevronRight, CirclePause, MoreVertical, RefreshCw, Shapes } from "lucide-react";
import Enum from "@enums/index";
import Datatable from "@layout/datatable";
import CategoryService from "@services/CategoryService";
import { Translate } from "@redux/index";
import Constant from "../redux/constant";
import CategoryAction from "../redux/action";
import { getCategoryStatus, getCategoryColor, normalizeCategorySummary } from "./listing-model";
import "./listing.css";

const unavailable = <span className="category-listing-muted">Not set</span>;

export default class CategoryPage extends Datatable {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      categorySearch: "",
      categoryDeleteName: "",
      categoryDeleteError: "",
      categorySummary: null,
      categorySummaryLoading: true,
      categorySummaryError: false
    };
    this.summaryRequestId = 0;
    this.isUnmounted = false;
    this.module = "products";
    this.title = <Translate id="text_categories" />;
    this.placeholder = "Quick search category name…";
    this.pageSize = 20;
    this.columns = [
      { title: "Category Code", dataIndex: "code", key: "code", width: 145, render: (_, record) => <span className="category-listing-code">{record.code || record.categoryCode || unavailable}</span> },
      { title: "Category Name", dataIndex: "name", key: "name", width: 250, render: (name, record) => <div className="category-listing-name"><strong>{name || "Unnamed category"}</strong>{(record.namekm || record.nameKhmer || record.khmerName || record.name_km) && <span lang="km">{record.namekm || record.nameKhmer || record.khmerName || record.name_km}</span>}{record.parent && record.parent.name && <small>Under {record.parent.name}</small>}</div> },
      { title: "POS Color", key: "posColor", width: 190, render: (_, record) => { const color = getCategoryColor(record); return color ? <div className="category-listing-color" style={{ "--category-color": color.hex, "--category-tint": `${color.hex}14` }}><span className="category-listing-swatch" aria-hidden="true" /><span><strong>{color.name}</strong><small>{color.hex.toUpperCase()}</small></span></div> : unavailable; } },
      { title: "POS Quick Access", key: "quickAccess", width: 150, render: (_, record) => { const enabled = record.posQuickAccessEnabled; return typeof enabled === "boolean" ? <span className={`category-listing-pill ${enabled ? "is-positive" : "is-neutral"}`}><i />{enabled ? "Enabled" : "Disabled"}</span> : unavailable; } },
      { title: "Mapped SKUs", key: "skuCount", width: 135, render: (_, record) => { const count = [record.linkedSkuCount, record.skuCount, record.productCount].find(value => Number.isSafeInteger(value) && value >= 0); return count === undefined ? unavailable : <span className="category-listing-count"><strong>{count.toLocaleString()}</strong> SKUs</span>; } },
      { title: "Default Margin", key: "margin", width: 145, render: (_, record) => record.defaultMarginRule && record.defaultMarginRule.label ? <Tooltip title={record.defaultMarginRule.description || "Configured category margin rule"}><span className="category-listing-margin">{record.defaultMarginRule.label}</span></Tooltip> : unavailable },
      { title: "STATUS", key: "status", width: 125, render: (_, record) => { const status = getCategoryStatus(record); return <span className={`category-listing-pill ${status && status.active ? "is-positive" : "is-neutral"}`}><i />{status ? status.label : "Unavailable"}</span>; } },
      { title: "Actions", key: "actions", width: 80, render: (_, record) => <div className="category-listing-actions"><Dropdown overlay={<Menu><Menu.Item key="edit" onClick={() => this.handleShowFormEdit(record)}>Edit category</Menu.Item><Menu.Item key="delete" onClick={() => this.handleConfirm(record)}>Delete category</Menu.Item></Menu>} trigger={["click"]}><Button type="link" aria-label={`More actions for ${record.name || "category"}`} onClick={event => event.stopPropagation()}><MoreVertical size={17} aria-hidden="true" /></Button></Dropdown></div> }
    ];
    this.callBackOnShowEditForm = this.showFormEdit;
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = CategoryService;
    this.action = CategoryAction;
    this.RESET_CONSTANT = Constant.RESET_CATEGORY;
    this.handleShowFormEdit = this.showFormEdit.bind(this);
    this.columnFilterWithKey = ["name"];
    this.searchTimer = null;
  }

  showFormEdit(rowData) { this.props.history.push(`/settings/categories/${rowData.id}/edit`); }

  componentDidMount() {
    super.componentDidMount();
    this.isUnmounted = false;
    this.fetchCategorySummary();
  }

  fetchCategorySummary = () => {
    const requestId = ++this.summaryRequestId;
    this.setState({ categorySummaryLoading: true, categorySummaryError: false });
    return CategoryService.getSummaryCards()
      .then(response => {
        if (this.isUnmounted || requestId !== this.summaryRequestId) return;
        const summary = normalizeCategorySummary(response);
        if (!summary) throw new Error("Invalid category summary response");
        this.setState({ categorySummary: summary, categorySummaryLoading: false, categorySummaryError: false });
      })
      .catch(() => {
        if (this.isUnmounted || requestId !== this.summaryRequestId) return;
        this.setState({ categorySummaryLoading: false, categorySummaryError: true });
      });
  }

  handleConfirm(rowData) {
    if (this.state.deleting) return;
    if (rowData && rowData.id) {
      this.setState({ selectedListIds: [rowData.id], selectedRowKeys: [rowData.id], categoryDeleteName: rowData.name || "", categoryDeleteError: "", modalVisible: true });
      return;
    }
    this.setState({ categoryDeleteName: "", categoryDeleteError: "" });
    super.handleConfirm();
  }

  handleCancel() {
    if (!this.state.deleting) this.setState({ modalVisible: false, categoryDeleteError: "" });
  }

  onSearch = event => {
    const value = event.target.value;
    this.setState({ categorySearch: value });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.props.dispatch(this.action.fetch(this.pageSize, 0, "", "", "", value));
      this.setState({ current: 1 });
    }, 300);
  }

  handleRefresh = () => {
    clearTimeout(this.searchTimer);
    const list = this.props[this.fetchingProp];
    const limit = list.pagination && list.pagination.limit || this.pageSize;
    const offset = (this.state.current - 1) * limit;
    const request = this.props.dispatch(this.action.fetch(limit, offset, "", "", "", this.state.categorySearch));
    const summaryRequest = this.fetchCategorySummary();
    return Promise.all([
      Promise.resolve(request).catch(() => {
        // The rejected list action displays the refresh error in the listing.
      }),
      summaryRequest
    ]);
  }

  componentWillUnmount() {
    this.isUnmounted = true;
    this.summaryRequestId += 1;
    clearTimeout(this.searchTimer);
  }

  componentDidUpdate(prevProps) {
    const categoryWasSaved = (this.props.add.added && !prevProps.add.added)
      || (this.props.update.updated && !prevProps.update.updated);
    if (categoryWasSaved) {
      this.props.dispatch(CategoryAction.reset());
      this.props.dispatch(CategoryAction.reset(Constant.RESET_DETAIL_CATEGORY));
      this.props.dispatch(this.action.fetch(this.pageSize));
      this.fetchCategorySummary();
    }
  }

  async handleDelete() {
    const ids = this.state.selectedListIds || [];
    if (!this.service || this.state.deleting || !ids.length) return;
    this.setState({ deleting: true, categoryDeleteError: "" });
    try {
      await this.service.archive(ids);
    } catch (error) {
      if (this.isUnmounted) return;
      const body = error && error.response && error.response.data;
      this.setState({ deleting: false, categoryDeleteError: body && (body.error && body.error.message || body.message) || "Unable to delete this category. Please try again." });
      return;
    }
    if (this.isUnmounted) return;
    this.setState({ selectedListIds: [], selectedRowKeys: [], selectedRows: [], modalVisible: false, deleting: false });
    message.success("Category archived.");
    await this.handleRefresh();
  }

  renderModalConfirmDelete() {
    return <Modal
      visible={this.state.modalVisible}
      title="Delete category?"
      okText="Delete category"
      cancelText="Cancel"
      okType="danger"
      confirmLoading={this.state.deleting}
      cancelButtonProps={{ disabled: this.state.deleting }}
      closable={!this.state.deleting}
      maskClosable={!this.state.deleting}
      onOk={this.handleDelete}
      onCancel={this.handleCancel}
    >
      <p>{this.state.categoryDeleteName ? `Delete "${this.state.categoryDeleteName}"?` : "Delete the selected categories?"}</p>
      <p>Deleted categories are archived and remain visible in the list with Archived status.</p>
      {this.state.categoryDeleteError && <div className="category-delete-error" role="alert"><Alert type="error" showIcon message={this.state.categoryDeleteError} /></div>}
    </Modal>;
  }

  render() {
    const fetchingProps = this.props[this.fetchingProp];
    const rows = fetchingProps.list || [];
    const summary = this.state.categorySummary || {};
    const total = summary.totalCategories;
    const summaryNumber = value => Number.isSafeInteger(value) && value >= 0 ? value.toLocaleString() : "—";
    const supportingText = this.state.categorySummaryLoading
      ? "Loading full-catalog summary…"
      : this.state.categorySummaryError ? "Summary unavailable" : "Full-catalog total";
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange, getCheckboxProps: record => ({ name: record.name }) };

    return <main className="category-listing">
      <div className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={15} aria-hidden="true" /><strong>Categories</strong><span className="category-listing-total">{summaryNumber(total) === "—" ? "Unavailable" : `${summaryNumber(total)} Categories`}</span></div>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Categories</h1></div><p>Manage categories, POS visibility, and margin rules.</p></div><Button type="primary" size="large" icon="plus" onClick={() => this.props.history.push("/settings/categories/create")}>New Category</Button></header>
      {this.state.categorySummaryError && <div className="category-listing-summary-error" role="alert"><span>Unable to load category summary.</span><Button type="link" onClick={this.fetchCategorySummary}><RefreshCw size={14} aria-hidden="true" /> Retry</Button></div>}
      <section className="category-listing-metrics" aria-label="Category summary">
        <MetricCard title="Total Categories" value={summary.totalCategories} detail={supportingText} icon={<Shapes size={21} />} tone="mint" />
        <MetricCard title="Active Categories" value={summary.activeCategories} detail={supportingText} icon={<CheckCircle2 size={21} />} tone="green" />
        <MetricCard title="Inactive" value={summary.inactiveCategories} detail={`Drafts ${summaryNumber(summary.draftCategories)} · Archived ${summaryNumber(summary.archivedCategories)}`} icon={<CirclePause size={21} />} tone="slate" />
        <MetricCard title="Total Linked SKUs" value={summary.linkedSkus} detail="Distinct active variant IDs" icon={<Archive size={21} />} tone="blue" />
      </section>
      <div className="category-listing-toolbar">
        <Input className="category-listing-search" name="search" aria-label="Search categories" placeholder={this.placeholder} suffix={<Icon type="search" />} style={{ height: 32, width: 350, maxWidth: "100%" }} allowClear onChange={this.onSearch} />
        <Button className="category-listing-refresh-button" onClick={this.handleRefresh} loading={fetchingProps.fetching || this.state.categorySummaryLoading}>
          {!fetchingProps.fetching && !this.state.categorySummaryLoading && <RefreshCw size={14} aria-hidden="true" />}
          Refresh
        </Button>
      </div>
      <section className="category-listing-table-card" aria-label="Categories">
        {fetchingProps.error && <div className="category-listing-error" role="alert"><span>Unable to load categories.</span><Button type="link" onClick={() => this.props.dispatch(this.action.fetch(this.pageSize))}><RefreshCw size={14} aria-hidden="true" /> Retry</Button></div>}
        <Table rowKey="id" bordered rowSelection={rowSelection} loading={fetchingProps.fetching} columns={this.columns} dataSource={rows} onChange={this.onChange} onRow={record => ({ onDoubleClick: () => this.handleShowFormEdit(record), onClick: event => this.handleOnTapHandler(event, record) })} pagination={{ total: fetchingProps.pagination.total, pageSize: fetchingProps.pagination.limit || this.pageSize, current: this.state.current, pageSizeOptions: this.pageSizeOptions, showTotal: (count, range) => `Showing ${range[0]} to ${range[1]} of ${count} categories`, showSizeChanger: true, onShowSizeChange: this.onShowSizeChange, onChange: this.onChangePagination }} scroll={{ x: 1240 }} locale={{ emptyText: <this.Translate id="table_empty_data" /> }} size="middle" />
      </section>
      {this.renderModalConfirmDelete()}
    </main>;
  }
}

function MetricCard({ title, value, detail, icon, tone }) {
  return <article className="category-listing-metric"><div className="category-listing-metric-top"><span>{title}</span><span className={`category-listing-metric-icon is-${tone}`} aria-hidden="true">{icon}</span></div><strong className={`category-listing-metric-value is-${tone}`}>{value === null || value === undefined ? "—" : value.toLocaleString()}</strong><small>{detail}</small></article>;
}
