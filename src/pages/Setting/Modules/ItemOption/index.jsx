import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Dropdown, Input, Menu, Modal, Table, Tag, message } from 'antd';
import { ChevronRight, MoreVertical, RefreshCw } from 'lucide-react';
import ItemOptionService from '@services/SettingsOptionService';
import PrivilegeService from '../../../../app/modules/pos/services/settings/PrivilegeService';
import ItemOptionForm from './ItemOptionForm';
import '../Category/form/listing.css';
import './style.css';

function errorMessage(error, fallback) {
  const body = error && error.response && error.response.data;
  const value = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof value === 'string' && value ? value : fallback;
}

function savedOption(response) {
  const option = response && response.data && response.data.data;
  return option && typeof option.id === 'string' && option.id ? option : null;
}

export default class ItemOptionPage extends React.Component {
  state = {
    access: 'loading', records: [], total: 0, loading: false, loadError: '',
    search: '', current: 1, pageSize: 20, sortField: 'name', sortOrder: 'ASC', editor: null, saving: false,
    saveError: '', deleteRecord: null, deleting: false, deleteError: ''
  };

  componentDidMount() { this.checkAccess(); }
  componentWillUnmount() { this.unmounted = true; clearTimeout(this.searchTimer); this.listRequest++; }
  listRequest = 0;

  checkAccess = async () => {
    this.setState({ access: 'loading' });
    try {
      const response = await PrivilegeService.checkPermission('product', 'edit');
      if (!this.unmounted) this.setState({ access: response.data === true ? 'allowed' : 'denied' }, () => {
        if (this.state.access === 'allowed') this.load();
      });
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
      const response = await ItemOptionService.get({ limit: pageSize, offset: (current - 1) * pageSize, sortField, sortOrder, search });
      const body = response && response.data;
      if (!body || !Array.isArray(body.data) || !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0) {
        throw new Error('Invalid Item Option list response.');
      }
      if (!this.unmounted && request === this.listRequest) this.setState({ records: body.data, total: body.pagination.total, loading: false });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorMessage(error, 'Unable to load Item Options.') });
    }
  };

  handleSearch = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.listRequest++;
    this.setState({ search, current: 1 });
    this.searchTimer = setTimeout(() => this.load({ search, current: 1 }), 300);
  };

  handleTableChange = (pagination, filters, sorter) => {
    clearTimeout(this.searchTimer);
    const next = {
      current: pagination.pageSize !== this.state.pageSize ? 1 : pagination.current,
      pageSize: pagination.pageSize,
      sortField: sorter.order ? sorter.field : 'name',
      sortOrder: sorter.order === 'descend' ? 'DESC' : 'ASC'
    };
    this.setState(next);
    this.load(next);
  };

  openEditor = record => this.setState({ editor: record ? { ...record } : {}, saveError: '' });

  save = async values => {
    const { editor, saving, access } = this.state;
    if (!editor || saving || access !== 'allowed') return;
    this.setState({ saving: true, saveError: '' });
    try {
      if (editor.id) {
        const response = await ItemOptionService.update({ ...values, id: editor.id });
        let saved = savedOption(response);
        if (!saved) saved = savedOption(await ItemOptionService.getById(editor.id));
        if (!saved || saved.id !== editor.id) throw new Error('The Item Option was not returned. Refresh the list to check whether your changes were saved.');
      } else {
        if (!savedOption(await ItemOptionService.add(values))) throw new Error('The Item Option was not returned. Refresh the list to check whether it was saved.');
      }
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id ? 'Item Option updated.' : 'Item Option created.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ saving: false, saveError: errorMessage(error, 'Unable to save the Item Option.') });
    }
  };

  remove = async () => {
    const { deleteRecord, deleting, access } = this.state;
    if (!deleteRecord || deleting || access !== 'allowed') return;
    this.setState({ deleting: true, deleteError: '' });
    try {
      const response = await ItemOptionService.archive(deleteRecord.id);
      const result = response && response.data && (response.data.data || response.data);
      if (result && result.affected === 0) throw new Error('This Item Option was not deleted. Refresh the list and try again.');
      if (this.unmounted) return;
      this.setState({ deleting: false, deleteRecord: null, current: 1 });
      message.success('Item Option deleted.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ deleting: false, deleteError: errorMessage(error, 'Unable to delete this Item Option.') });
    }
  };

  render() {
    const state = this.state;
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: true, render: value => <strong className="item-option-name">{value}</strong> },
      { title: 'Description', dataIndex: 'description', key: 'description', render: value => value || '' },
      { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: value => value === 1 ? <Tag color="green">Active</Tag> : value === 0 ? <Tag>Inactive</Tag> : '—' },
      { title: 'Actions', key: 'actions', width: 90, render: (_, record) => <div className="category-listing-actions"><Dropdown trigger={['click']} overlay={<Menu>
        <Menu.Item key="edit" onClick={() => this.openEditor(record)}>Edit Item Option</Menu.Item>
        <Menu.Item key="delete" onClick={() => this.setState({ deleteRecord: record, deleteError: '' })}>Delete Item Option</Menu.Item>
      </Menu>}><Button type="link" aria-label={`More actions for ${record.name || 'Item Option'}`}><MoreVertical size={17} aria-hidden="true" /></Button></Dropdown></div> }
    ];

    return <main className="category-listing item-option-page">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Item Option</strong></nav>
      <header className="category-listing-heading"><div className="category-listing-title"><h1>Item Option</h1><p>Manage the attributes used to define product variants.</p></div>
        {state.access === 'allowed' && <Button type="primary" size="large" icon="plus" onClick={() => this.openEditor()}>New Item Option</Button>}
      </header>
      {state.access === 'loading' && <p role="status">Checking catalog access…</p>}
      {state.access === 'denied' && <Alert type="warning" showIcon message="You need catalog editing access to manage Item Options." />}
      {state.access === 'error' && <Alert type="error" showIcon message="Unable to check catalog access." description={<Button onClick={this.checkAccess}>Retry</Button>} />}
      {state.access === 'allowed' && <>
        <div className="category-listing-toolbar item-option-toolbar">
          <Input.Search className="category-listing-search" aria-label="Search Item Options" placeholder="Search by name or description" value={state.search} allowClear onChange={this.handleSearch} />
          <Button className="category-listing-refresh-button" loading={state.loading} aria-label="Refresh Item Options" onClick={() => { clearTimeout(this.searchTimer); this.load(); }}><RefreshCw size={14} aria-hidden="true" /><span>Refresh</span></Button>
        </div>
        {state.loadError && <Alert type="error" showIcon role="alert" message={state.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
        <section className="category-listing-table-card" aria-label="Item Options">
          <Table rowKey="id" columns={columns} dataSource={state.records} loading={state.loading} onChange={this.handleTableChange} scroll={{ x: 700 }}
            pagination={{ current: state.current, pageSize: state.pageSize, total: state.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            locale={{ emptyText: state.loadError ? 'Unable to load Item Options' : 'No Item Options found' }} />
        </section>
      </>}
      {state.editor && <ItemOptionForm key={state.editor.id || 'new'} record={state.editor} busy={state.saving} error={state.saveError} onSave={this.save} onCancel={() => { if (!state.saving) this.setState({ editor: null, saveError: '' }); }} />}
      <Modal title="Delete Item Option?" visible={Boolean(state.deleteRecord)} okText="Delete" okType="danger" confirmLoading={state.deleting}
        onOk={this.remove} onCancel={() => { if (!state.deleting) this.setState({ deleteRecord: null, deleteError: '' }); }}
        maskClosable={!state.deleting} closable={!state.deleting} cancelButtonProps={{ disabled: state.deleting }}>
        <p>Delete “{state.deleteRecord && state.deleteRecord.name}”? Options used by product variants may not be deletable.</p>
        {state.deleteError && <Alert type="error" showIcon role="alert" message={state.deleteError} />}
      </Modal>
    </main>;
  }
}
