import React from "react";
import { Link } from "react-router-dom";
import { Alert, Button, Dropdown, Input, Menu, Modal, Table, Tag, message } from "antd";
import { ChevronRight, MoreVertical, RefreshCw } from "lucide-react";
import BaseComponent from "@components/BaseComponent";
import BrandService from "@services/BrandService";
import BrandAction from "../redux/action";
import { resolveCategoryUploadUrl } from "../../Category/image-url";
import "../../Category/form/listing.css";
import "../brand.css";

export default class BrandPage extends BaseComponent {
  state = { search: "", current: 1, pageSize: 20, sortField: "", sortOrder: "", selectedRowKeys: [], deleteIds: [], deleteName: "", deleting: false, deleteError: "" };

  componentDidMount() { this.loadBrands(); }
  componentWillUnmount() { clearTimeout(this.searchTimer); }

  loadBrands = (overrides = {}) => {
    const { pageSize, current, sortField, sortOrder, search } = { ...this.state, ...overrides };
    // Redux retains rejected requests so the listing can show its retry state.
    return Promise.resolve(this.props.dispatch(BrandAction.fetch(pageSize, (current - 1) * pageSize, sortField, sortOrder, "", search))).catch(() => {});
  };

  handleSearch = event => {
    const search = event.target.value;
    this.setState({ search, current: 1 });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadBrands({ search, current: 1 }), 300);
  };

  handleTableChange = (pagination, filters, sorter) => {
    clearTimeout(this.searchTimer);
    const next = {
      current: pagination.pageSize !== this.state.pageSize ? 1 : pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.order ? sorter.field : "",
      sortOrder: sorter.order === "ascend" ? "ASC" : sorter.order === "descend" ? "DESC" : ""
    };
    this.setState(next);
    this.loadBrands(next);
  };

  openDelete = record => this.setState({ deleteIds: record ? [record.id] : this.state.selectedRowKeys, deleteName: record ? record.name : "", deleteError: "" });

  handleDelete = async () => {
    if (this.state.deleting || !this.state.deleteIds.length) return;
    this.setState({ deleting: true, deleteError: "" });
    try {
      await BrandService.archive(this.state.deleteIds);
      this.setState({ deleting: false, deleteIds: [], selectedRowKeys: [], current: 1 });
      message.success("Brand deleted successfully.");
      this.loadBrands({ current: 1 });
    } catch (error) {
      const body = error && error.response && error.response.data;
      this.setState({ deleting: false, deleteError: body && (body.message || body.error && body.error.message) || "Unable to delete the brand. Please try again." });
    }
  };

  editBrand = record => this.props.history.push(`/settings/brands/${record.id}/edit`);

  render() {
    const list = this.props.list;
    const pagination = list.pagination || {};
    const columns = [
      { title: "Brand", dataIndex: "name", key: "name", sorter: true, render: (name, record) => {
        const image = record.image && (resolveCategoryUploadUrl(record.image) || this.Util.getProductImage(record.image, this.Enum.IMAGE_SPACE.BRAND).url);
        return <div className="brand-listing-name">{image && <img src={image} alt="" />}<strong>{name}</strong></div>;
      } },
      { title: "Description", dataIndex: "description", key: "description", render: value => value || "" },
      { title: "Status", dataIndex: "status", key: "status", width: 120, render: value => value === 1 || value === true ? <Tag color="green">Active</Tag> : value === 0 || value === false ? <Tag>Inactive</Tag> : <span className="category-listing-muted">Not set</span> },
      { title: "Actions", key: "actions", width: 80, render: (_, record) => <div className="category-listing-actions"><Dropdown trigger={["click"]} overlay={<Menu><Menu.Item key="edit" onClick={() => this.editBrand(record)}>Edit brand</Menu.Item><Menu.Item key="delete" onClick={() => this.openDelete(record)}>Delete brand</Menu.Item></Menu>}><Button type="link" aria-label={`More actions for ${record.name || "brand"}`}><MoreVertical size={17} aria-hidden="true" /></Button></Dropdown></div> }
    ];
    return <main className="category-listing brand-listing">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Brands</strong></nav>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Brands</h1></div><p>Manage brands and makers for your product catalog.</p></div><Button type="primary" size="large" icon="plus" onClick={() => this.props.history.push("/settings/brands/create")}>New Brand</Button></header>
      <div className="category-listing-toolbar">
        <Input className="category-listing-search" aria-label="Search brands" placeholder="Search brands…" value={this.state.search} allowClear onChange={this.handleSearch} style={{ width: 350 }} />
        <Button className="category-listing-refresh-button" aria-label="Refresh brands" loading={list.fetching} onClick={() => { clearTimeout(this.searchTimer); this.loadBrands(); }}><RefreshCw size={14} aria-hidden="true" />Refresh</Button>
      </div>
      <section className="category-listing-table-card" aria-label="Brands">
        {list.error && <Alert type="error" showIcon message="Unable to load brands." description={<Button type="link" onClick={() => this.loadBrands()}>Retry</Button>} />}
        <Table rowKey="id" bordered size="middle" columns={columns} dataSource={list.list || []} loading={list.fetching} rowSelection={{ selectedRowKeys: this.state.selectedRowKeys, onChange: selectedRowKeys => this.setState({ selectedRowKeys }) }} onChange={this.handleTableChange} pagination={{ current: this.state.current, pageSize: this.state.pageSize, total: pagination.total || 0, showSizeChanger: true, pageSizeOptions: ["20", "50", "100"] }} locale={{ emptyText: "No brands found" }} scroll={{ x: 650 }} />
      </section>
      <Modal title="Delete brand?" visible={this.state.deleteIds.length > 0} okText="Delete" okType="danger" confirmLoading={this.state.deleting} maskClosable={!this.state.deleting} closable={!this.state.deleting} cancelButtonProps={{ disabled: this.state.deleting }} onCancel={() => { if (!this.state.deleting) this.setState({ deleteIds: [], deleteError: "" }); }} onOk={this.handleDelete}>
        <p>{this.state.deleteName ? `Delete "${this.state.deleteName}"?` : "Delete the selected brands?"}</p>
        {this.state.deleteError && <Alert type="error" showIcon message={this.state.deleteError} />}
      </Modal>
    </main>;
  }
}
