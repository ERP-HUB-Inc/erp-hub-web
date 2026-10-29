import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Dropdown, Input, Menu, Modal, Table, Tag, message } from 'antd';
import { ChevronRight, MoreVertical, RefreshCw } from 'lucide-react';
import ItemTypeService from '@services/ItemTypeService';
import PrivilegeService from '../../../../app/modules/pos/services/settings/PrivilegeService';
import ItemTypeForm from './ItemTypeForm';
import { errorMessage, isEnabled, savedItem } from './model';
import '../Category/form/listing.css';
import './style.css';

export default class ItemTypePage extends React.Component {
  state = {
    access: 'loading', records: [], total: 0, loading: false, loadError: '',
    search: '', current: 1, pageSize: 20, sortField: 'sortOrder', sortOrder: 'ASC',
    editor: null, detailId: null, detailLoading: false, detailError: '',
    saving: false, saveError: '', deleting: false, deleteRecord: null, deleteError: ''
  };

  componentDidMount() { this.checkAccess(); }
  componentWillUnmount() { this.unmounted = true; clearTimeout(this.searchTimer); this.listRequest++; this.detailRequest++; }
  listRequest = 0;
  detailRequest = 0;

  checkAccess = async () => {
    this.setState({ access: 'loading' });
    try {
      const response = await PrivilegeService.checkPermission('product', 'edit');
      if (this.unmounted) return;
      const allowed = response.data === true;
      this.setState({ access: allowed ? 'allowed' : 'denied' }, () => { if (allowed) this.load(); });
    } catch (error) {
      if (!this.unmounted) this.setState({ access: error && error.response && error.response.status === 403 ? 'denied' : 'error' });
    }
  };

  load = async (overrides = {}) => {
    if (this.state.access !== 'allowed') return;
    const request = ++this.listRequest;
    const { current, pageSize, search, sortField, sortOrder } = { ...this.state, ...overrides };
    this.setState({ loading: true, loadError: '' });
    try {
      const response = await ItemTypeService.get({ limit: pageSize, offset: (current - 1) * pageSize, search, sortField, sortOrder });
      const body = response.data;
      if (!body || !Array.isArray(body.data) || !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0) throw new Error('Invalid item type list response.');
      if (!this.unmounted && request === this.listRequest) this.setState({ records: body.data, total: body.pagination.total, loading: false });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorMessage(error, 'Unable to load item types.') });
    }
  };

  handleSearch = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.listRequest++; // Ignore a previous query even during the debounce interval.
    this.setState({ search, current: 1 });
    this.searchTimer = setTimeout(() => this.load({ search, current: 1 }), 300);
  };

  handleTableChange = (pagination, filters, sorter) => {
    clearTimeout(this.searchTimer);
    const next = {
      current: pagination.pageSize !== this.state.pageSize ? 1 : pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.order ? sorter.field : 'sortOrder',
      sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
    };
    this.setState(next);
    this.load(next);
  };

  openEditor = async record => {
    if (this.state.access !== 'allowed' || this.state.saving) return;
    const request = ++this.detailRequest;
    if (!record) { this.setState({ editor: {}, saveError: '', detailId: null, detailLoading: false, detailError: '' }); return; }
    this.setState({ detailId: record.id, detailLoading: true, detailError: '', editor: null, saveError: '' });
    try {
      const item = savedItem(await ItemTypeService.getById(record.id));
      if (item.id !== record.id) throw new Error('Unable to load the selected item type.');
      if (!this.unmounted && request === this.detailRequest) this.setState({ editor: item, detailId: null, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorMessage(error, 'Unable to load this item type.') });
    }
  };

  closeEditor = () => {
    if (this.state.saving) return;
    this.detailRequest++;
    this.setState({ editor: null, detailId: null, detailLoading: false, detailError: '', saveError: '' });
  };

  save = async data => {
    const { editor, saving, access } = this.state;
    if (!editor || saving || access !== 'allowed') return;
    this.setState({ saving: true, saveError: '' });
    try {
      savedItem(await (editor.id ? ItemTypeService.update({ ...data, id: editor.id }) : ItemTypeService.add(data)));
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id ? 'Item type updated.' : 'Item type created.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ saving: false, saveError: errorMessage(error, 'Unable to save the item type.') });
    }
  };

  remove = async () => {
    const { deleteRecord, deleting, access } = this.state;
    if (!deleteRecord || deleting || access !== 'allowed') return;
    this.setState({ deleting: true, deleteError: '' });
    try {
      const response = await ItemTypeService.archive(deleteRecord.id);
      if (!response.data || !(response.data.affected > 0)) throw new Error('No item type was deleted. Refresh the list and try again.');
      if (this.unmounted) return;
      this.setState({ deleting: false, deleteRecord: null, current: 1 });
      message.success('Item type permanently deleted.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ deleting: false, deleteError: errorMessage(error, 'Unable to delete the item type.') });
    }
  };

  render() {
    const s = this.state;
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 300, sorter: true, render: (name, record) => <div className="item-type-name-cell">
        <div className="item-type-name-heading"><strong title={name}>{name || 'Unnamed item type'}</strong></div>
        {record.description && <div className="item-type-description" title={record.description}>{record.description}</div>}
      </div> },
      { title: 'Inventory', dataIndex: 'enableInventoryTracking', render: value => isEnabled(value) ? 'Tracked' : 'Not tracked' },
      { title: 'Sales', dataIndex: 'isSellable', render: value => isEnabled(value) ? 'Sellable' : 'Not for sale' },
      { title: 'Sort order', dataIndex: 'sortOrder', sorter: true },
      { title: 'Status', dataIndex: 'status', render: value => value === 1 ? <Tag color="green">Active</Tag> : value === 0 ? <Tag>Inactive</Tag> : <Tag>Unavailable</Tag> },
      { title: 'Actions', key: 'actions', width: 90, render: (_, record) => <div className="category-listing-actions">
        <Dropdown trigger={['click']} overlay={<Menu>
          <Menu.Item key="edit" onClick={() => this.openEditor(record)} aria-label={`Edit ${record.name}`}>Edit item type</Menu.Item>
          <Menu.Item key="delete" disabled={s.deleting} aria-label={`Delete ${record.name}`}
            onClick={() => this.setState({ deleteRecord: record, deleteError: '' })}>Delete item type</Menu.Item>
        </Menu>}>
          <Button type="link" aria-label={`More actions for ${record.name}`} onClick={event => event.stopPropagation()}><MoreVertical size={17} aria-hidden="true" /></Button>
        </Dropdown>
      </div> }
    ];
    return <main className="category-listing item-type-page">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Item Types</strong></nav>
      <header className="category-listing-heading"><div className="category-listing-title"><h1>Item Types</h1><p>Manage how items are stocked, sold, and organized in your catalog.</p></div>
        {s.access === 'allowed' && <Button type="primary" icon="plus" onClick={() => this.openEditor()}>New Item Type</Button>}
      </header>
      {s.access === 'loading' && <p role="status">Checking catalog access…</p>}
      {s.access === 'denied' && <Alert type="warning" showIcon message="You need catalog editing access to manage item types." />}
      {s.access === 'error' && <Alert type="error" showIcon message="Unable to check catalog access." description={<Button onClick={this.checkAccess}>Retry</Button>} />}
      {s.access === 'allowed' && <>
        <div className="category-listing-toolbar item-type-toolbar">
          <Input.Search aria-label="Search item types" placeholder="Search by name or code" value={s.search} allowClear onChange={this.handleSearch} />
          <Button className="category-listing-refresh-button" loading={s.loading} aria-label="Refresh item types" onClick={() => { clearTimeout(this.searchTimer); this.load(); }}><RefreshCw size={14} aria-hidden="true" /> <span>Refresh</span></Button>
        </div>
        {s.loadError && <Alert type="error" showIcon role="alert" message={s.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
        <section className="category-listing-table-card" aria-label="Item types">
          <Table rowKey="id" columns={columns} dataSource={s.records} loading={s.loading} onChange={this.handleTableChange} scroll={{ x: 1000 }}
            pagination={{ current: s.current, pageSize: s.pageSize, total: s.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            locale={{ emptyText: s.loadError ? 'Item types are unavailable' : 'No item types found' }} />
        </section>
      </>}
      {s.editor && <ItemTypeForm record={s.editor} busy={s.saving} error={s.saveError} onSave={this.save} onCancel={this.closeEditor} />}
      <Modal title="Load Item Type" visible={Boolean(s.detailId)} footer={<Button onClick={this.closeEditor}>Close</Button>} onCancel={this.closeEditor}>
        {s.detailLoading ? <p role="status">Loading item type…</p> : <Alert type="error" showIcon message={s.detailError} description={<Button onClick={() => this.openEditor({ id: s.detailId })}>Retry</Button>} />}
      </Modal>
      <Modal title="Permanently delete item type?" visible={Boolean(s.deleteRecord)} okText="Delete Permanently" okType="danger" confirmLoading={s.deleting}
        onOk={this.remove} onCancel={() => { if (!s.deleting) this.setState({ deleteRecord: null, deleteError: '' }); }}
        maskClosable={!s.deleting} closable={!s.deleting} cancelButtonProps={{ disabled: s.deleting }}>
        <p>Delete “{s.deleteRecord && s.deleteRecord.name}”? This permanently removes the item type and cannot be undone.</p>
        {s.deleteError && <Alert type="error" showIcon role="alert" message={s.deleteError} />}
      </Modal>
    </main>;
  }
}
