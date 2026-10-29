import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Dropdown, Input, Menu, Modal, Table, Tag, message } from 'antd';
import { ChevronRight, MoreVertical, RefreshCw } from 'lucide-react';
import UnitService from '@services/SettingsUnitService';
import PrivilegeService from '../../../../app/modules/pos/services/settings/PrivilegeService';
import UnitForm from './UnitForm';
import '../Category/form/listing.css';
import './style.css';

function errorMessage(error, fallback) {
  const body = error && error.response && error.response.data;
  const value = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof value === 'string' && value ? value : fallback;
}

function unitRecord(response) {
  const record = response && response.data && response.data.data;
  return record && typeof record.id === 'string' && record.id ? record : null;
}

export default class UnitSettingsPage extends React.Component {
  state = {
    access: 'loading', records: [], total: 0, loading: false, loadError: '',
    search: '', current: 1, pageSize: 20, editor: null, saving: false,
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
    const { current, pageSize, search } = { ...this.state, ...overrides };
    this.setState({ loading: true, loadError: '' });
    try {
      const response = await UnitService.get({ limit: pageSize, offset: (current - 1) * pageSize, search });
      const body = response && response.data;
      if (!body || !Array.isArray(body.data) || !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0) {
        throw new Error('Invalid Unit of Measurement list response.');
      }
      if (!this.unmounted && request === this.listRequest) this.setState({ records: body.data, total: body.pagination.total, loading: false });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorMessage(error, 'Unable to load units.') });
    }
  };

  handleSearch = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.listRequest++;
    this.setState({ search, current: 1 });
    this.searchTimer = setTimeout(() => this.load({ search, current: 1 }), 300);
  };

  handleTableChange = pagination => {
    clearTimeout(this.searchTimer);
    const next = { current: pagination.pageSize !== this.state.pageSize ? 1 : pagination.current, pageSize: pagination.pageSize };
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
        const response = await UnitService.update({ ...values, id: editor.id });
        let saved = unitRecord(response);
        // UnitController's repository update returns no row when MySQL reports
        // zero changed fields; confirm persistence through the detail route.
        if (!saved) saved = unitRecord(await UnitService.getById(editor.id));
        if (!saved || saved.id !== editor.id) throw new Error('The unit was not returned. Refresh the list to check whether your changes were saved.');
      } else {
        const saved = unitRecord(await UnitService.add(values));
        if (!saved) throw new Error('The unit was not returned. Refresh the list to check whether it was saved.');
      }
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id ? 'Unit updated.' : 'Unit created.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ saving: false, saveError: errorMessage(error, 'Unable to save the unit.') });
    }
  };

  remove = async () => {
    const { deleteRecord, deleting, access } = this.state;
    if (!deleteRecord || deleting || access !== 'allowed') return;
    this.setState({ deleting: true, deleteError: '' });
    try {
      await UnitService.archive(deleteRecord.id);
      if (this.unmounted) return;
      this.setState({ deleting: false, deleteRecord: null, current: 1 });
      message.success('Unit deleted.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ deleting: false, deleteError: errorMessage(error, 'Unable to delete the unit.') });
    }
  };

  render() {
    const state = this.state;
    const columns = [
      { title: 'Unit', dataIndex: 'name', key: 'name', render: (name, record) => <div className="unit-setting-name"><strong>{name}</strong>{Number(record.isDefault) === 1 && <Tag color="blue">Default</Tag>}</div> },
      { title: 'Number in unit', dataIndex: 'multiple', key: 'multiple', render: (value, record) => `${value} ${record.label || ''}`.trim() },
      { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: value => value === 1 ? <Tag color="green">Active</Tag> : value === 0 ? <Tag>Inactive</Tag> : '—' },
      { title: 'Actions', key: 'actions', width: 90, render: (_, record) => {
        const system = Number(record.isSystem) === 1;
        return <div className="category-listing-actions"><Dropdown trigger={['click']} overlay={<Menu>
          <Menu.Item key="edit" disabled={system} onClick={() => this.openEditor(record)}>Edit unit</Menu.Item>
          <Menu.Item key="delete" onClick={() => this.setState({ deleteRecord: record, deleteError: '' })}>Delete unit</Menu.Item>
        </Menu>}><Button type="link" aria-label={`More actions for ${record.name || 'unit'}`}><MoreVertical size={17} aria-hidden="true" /></Button></Dropdown></div>;
      } }
    ];

    return <main className="category-listing unit-setting-page">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Units of Measurement</strong></nav>
      <header className="category-listing-heading"><div className="category-listing-title"><h1>Units of Measurement</h1><p>Manage how products are counted and converted for inventory.</p></div>
        {state.access === 'allowed' && <Button type="primary" size="large" icon="plus" onClick={() => this.openEditor()}>New Unit</Button>}
      </header>
      {state.access === 'loading' && <p role="status">Checking catalog access…</p>}
      {state.access === 'denied' && <Alert type="warning" showIcon message="You need catalog editing access to manage units." />}
      {state.access === 'error' && <Alert type="error" showIcon message="Unable to check catalog access." description={<Button onClick={this.checkAccess}>Retry</Button>} />}
      {state.access === 'allowed' && <>
        <div className="category-listing-toolbar unit-setting-toolbar">
          <Input.Search className="category-listing-search" aria-label="Search units" placeholder="Search units by name" value={state.search} allowClear onChange={this.handleSearch} />
          <Button className="category-listing-refresh-button" loading={state.loading} aria-label="Refresh units" onClick={() => { clearTimeout(this.searchTimer); this.load(); }}><RefreshCw size={14} aria-hidden="true" /><span>Refresh</span></Button>
        </div>
        {state.loadError && <Alert type="error" showIcon role="alert" message={state.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
        <section className="category-listing-table-card" aria-label="Units of Measurement">
          <Table rowKey="id" columns={columns} dataSource={state.records} loading={state.loading} onChange={this.handleTableChange} scroll={{ x: 650 }}
            pagination={{ current: state.current, pageSize: state.pageSize, total: state.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'] }}
            locale={{ emptyText: state.loadError ? 'Unable to load units' : 'No units found' }} />
        </section>
      </>}
      {state.editor && <UnitForm key={state.editor.id || 'new'} record={state.editor} busy={state.saving} error={state.saveError} onSave={this.save} onCancel={() => { if (!state.saving) this.setState({ editor: null, saveError: '' }); }} />}
      <Modal title="Delete unit?" visible={Boolean(state.deleteRecord)} okText="Delete" okType="danger" confirmLoading={state.deleting}
        onOk={this.remove} onCancel={() => { if (!state.deleting) this.setState({ deleteRecord: null, deleteError: '' }); }}
        maskClosable={!state.deleting} closable={!state.deleting} cancelButtonProps={{ disabled: state.deleting }}>
        <p>Delete “{state.deleteRecord && state.deleteRecord.name}”? Products using this unit must be updated first.</p>
        {state.deleteError && <Alert type="error" showIcon role="alert" message={state.deleteError} />}
      </Modal>
    </main>;
  }
}
