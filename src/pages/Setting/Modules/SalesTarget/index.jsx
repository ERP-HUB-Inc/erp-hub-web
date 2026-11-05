import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, InputNumber, Modal, Select, Table, message } from 'antd';
import { ChevronRight, RefreshCw } from 'lucide-react';
import SalesTargetService from '@services/SalesTargetService';
import LocationService from '@services/LocationService';
import SalesTargetForm from './SalesTargetForm';
import { errorText, isTargetId, periodLabel, TARGET_TYPES, targetEntity } from './model';
import '../Category/form/listing.css';
import '../../../Finance/Expense/expense.css';
import './style.css';

export default class SalesTargetPage extends React.Component {
  state = {
    records: [], total: 0, current: 1, pageSize: 20, filters: {}, loading: true, loadError: '',
    locations: [], locationsLoading: true, locationsError: '',
    editor: null, detailId: null, detailLoading: false, detailError: '', saving: false, saveError: '',
    disableIds: [], disabling: false, disableError: ''
  };
  listRequest = 0;
  detailRequest = 0;
  locationsRequest = 0;
  componentDidMount() { this.load(); this.loadLocations(); }
  componentWillUnmount() { this.unmounted = true; this.listRequest++; this.detailRequest++; this.locationsRequest++; }

  loadLocations = async () => {
    const request = ++this.locationsRequest;
    this.setState({ locationsLoading: true, locationsError: '' });
    try {
      const locations = [], ids = new Set();
      let total;
      do {
        const { data: body } = await LocationService.get({ limit: 100, offset: locations.length });
        if (this.unmounted || request !== this.locationsRequest) return;
        if (!body || !Array.isArray(body.data) || !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0 ||
          total !== undefined && total !== body.pagination.total) throw new Error('The available branch list could not be read. Retry loading branches.');
        total = body.pagination.total;
        for (const row of body.data) {
          if (!row || row.id == null || ids.has(String(row.id))) throw new Error('The branch list changed. Retry loading branches.');
          ids.add(String(row.id)); locations.push(row);
        }
        if (locations.length > total || locations.length < total && !body.data.length) throw new Error('The branch list is incomplete. Retry loading branches.');
      } while (locations.length < total);
      this.setState({ locations, locationsLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.locationsRequest) {
        this.setState({ locations: [], locationsLoading: false, locationsError: errorText(error, 'Unable to load branches.') });
      }
    }
  };

  load = async (overrides = {}) => {
    const request = ++this.listRequest;
    const { current, pageSize, filters } = { ...this.state, ...overrides };
    this.setState({ loading: true, loadError: '' });
    try {
      const { data: body } = await SalesTargetService.list({ ...filters, limit: pageSize, offset: (current - 1) * pageSize });
      if (!body || !Array.isArray(body.data) || body.data.some(row => !row || !isTargetId(row.id)) ||
        !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0) throw new Error('The sales target list could not be read.');
      if (!this.unmounted && request === this.listRequest) this.setState({ records: body.data, total: body.pagination.total, loading: false });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorText(error, 'Unable to load sales targets.') });
    }
  };

  filter = (key, value) => {
    const normalized = value == null || value === '' ? undefined : value;
    const filters = { ...this.state.filters, [key]: normalized };
    if (key === 'year' && normalized !== undefined && (!Number.isInteger(normalized) || normalized < 1 || normalized > 9999)) return;
    this.setState({ filters, current: 1 });
    this.load({ filters, current: 1 });
  };

  changePage = pagination => {
    const next = { current: pagination.pageSize === this.state.pageSize ? pagination.current : 1, pageSize: pagination.pageSize };
    this.setState(next); this.load(next);
  };

  openEditor = async record => {
    const s = this.state;
    if (s.saving || s.disabling || s.disableIds.length || s.locationsLoading || s.locationsError || !s.locations.length) return;
    const request = ++this.detailRequest;
    this.setState({ editor: null, detailId: record ? record.id : null, detailLoading: Boolean(record), detailError: '', saveError: '' });
    if (!record) { this.setState({ editor: {} }); return; }
    try {
      const target = targetEntity(await SalesTargetService.getById(record.id));
      if (target.id !== record.id) throw new Error('The selected sales target could not be read.');
      if (!this.unmounted && request === this.detailRequest) this.setState({ editor: target, detailId: null, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorText(error, 'Unable to load the sales target.') });
    }
  };

  closeEditor = () => {
    if (this.state.saving) return;
    this.detailRequest++;
    this.setState({ editor: null, detailId: null, detailLoading: false, detailError: '', saveError: '' });
  };

  save = async payload => {
    const { editor, saving } = this.state;
    if (!editor || saving) return;
    this.setState({ saving: true, saveError: '' });
    try {
      const saved = targetEntity(await SalesTargetService.save(payload, editor.id));
      if (editor.id != null && saved.id !== editor.id) throw new Error('Saving the selected sales target could not be confirmed.');
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id != null ? 'Sales target updated.' : 'Sales target created.');
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ saving: false, saveError: errorText(error, 'Unable to save the sales target.') });
    }
  };

  openDisable = ids => {
    if (this.state.saving || this.state.editor || this.state.disabling || !ids.length) return;
    this.detailRequest++;
    this.setState({ disableIds: ids, disableError: '', detailId: null, detailLoading: false, detailError: '' });
  };

  disable = async () => {
    const { disableIds, disabling } = this.state;
    if (!disableIds.length || disabling) return;
    this.setState({ disabling: true, disableError: '' });
    try {
      const response = await SalesTargetService.disable(disableIds);
      if (!response.data || response.data.success !== true) throw new Error('Disabling the sales targets could not be confirmed. Refresh before retrying.');
      if (this.unmounted) return;
      this.setState({ disabling: false, disableIds: [], current: 1 });
      message.success(disableIds.length === 1 ? 'Sales target disabled.' : 'Sales targets disabled.');
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ disabling: false, disableError: errorText(error, 'Unable to disable sales targets.') });
    }
  };

  render() {
    const s = this.state;
    const busy = s.saving || s.disabling || s.disableIds.length > 0;
    const editBlocked = busy || s.locationsLoading || Boolean(s.locationsError) || !s.locations.length;
    const branches = new Map(s.locations.map(row => [String(row.id), row.name || String(row.id)]));
    const columns = [
      { title: 'Branch', dataIndex: 'locationId', key: 'locationId', render: id => <strong>{branches.get(String(id)) || id || '—'}</strong> },
      { title: 'Target Type', dataIndex: 'targetType', key: 'targetType', render: type => TARGET_TYPES[type] || type },
      { title: 'Period', key: 'period', render: (_, row) => periodLabel(row) },
      { title: 'Target Revenue', dataIndex: 'targetRevenue', key: 'targetRevenue', align: 'right', render: value => value != null && value !== '' && Number.isFinite(Number(value)) ? Number(value).toLocaleString(undefined, { maximumFractionDigits: 4 }) : '—' },
      { title: 'Actions', key: 'actions', width: 190, render: (_, record) => <div className="expense-bill-actions">
        <Button size="small" disabled={editBlocked} onClick={() => this.openEditor(record)}>Edit</Button>
        <Button size="small" type="danger" disabled={busy || Boolean(s.editor) || record.status !== 'ACTIVE'} onClick={() => this.openDisable([record.id])}>Delete</Button>
      </div> }
    ];
    return <main className="category-listing sales-target-page">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Sales Targets &amp; Revenue Goals</strong></nav>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Sales Targets &amp; Revenue Goals</h1></div><p>Set branch revenue goals by month, quarter, or year.</p></div>
        <Button type="primary" size="large" icon="plus" disabled={editBlocked} onClick={() => this.openEditor()}>New Sales Target</Button>
      </header>
      {s.locationsLoading && <p role="status">Loading available branches…</p>}
      {s.locationsError && <Alert type="error" showIcon role="alert" message={s.locationsError} description={<Button onClick={this.loadLocations}>Retry branches</Button>} />}
      {!s.locationsLoading && !s.locationsError && !s.locations.length && <Alert type="info" showIcon message="An available branch is required to create or edit sales targets." />}
      <div className="sales-target-toolbar">
        <div className="sales-target-filter"><Select id="targets-type-filter" aria-label="Filter by target type" value={s.filters.targetType} placeholder="All periods" allowClear onChange={value => this.filter('targetType', value)}>{Object.keys(TARGET_TYPES).map(type => <Select.Option key={type} value={type}>{TARGET_TYPES[type]}</Select.Option>)}</Select></div>
        <div className="sales-target-filter"><InputNumber id="targets-year-filter" aria-label="Filter by year" value={s.filters.year} placeholder="All years" min={1} max={9999} onChange={value => this.filter('year', value)} /></div>
        <div className="sales-target-filter"><Select id="targets-status-filter" aria-label="Filter by status" value={s.filters.status} placeholder="All statuses" allowClear onChange={value => this.filter('status', value)}><Select.Option value="ACTIVE">Active</Select.Option><Select.Option value="INACTIVE">Inactive</Select.Option></Select></div>
        <Button className="category-listing-refresh-button" loading={s.loading} onClick={() => this.load()}>{!s.loading && <RefreshCw size={14} aria-hidden="true" />}<span>Refresh</span></Button>
      </div>
      {s.loadError && <Alert type="error" showIcon role="alert" message={s.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
      <section className="category-listing-table-card" aria-label="Sales targets">
        <Table rowKey="id" columns={columns} dataSource={s.records} bordered size="middle" loading={s.loading} scroll={{ x: 900 }} onChange={this.changePage}
          pagination={{ current: s.current, pageSize: s.pageSize, total: s.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'], showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} targets` }}
          locale={{ emptyText: s.loadError ? 'Sales targets are unavailable' : 'No sales targets found' }} />
      </section>
      {s.detailId && <Alert type={s.detailLoading ? 'info' : 'error'} showIcon role={s.detailLoading ? 'status' : 'alert'} message={s.detailLoading ? 'Loading sales target…' : s.detailError}
        description={<><Button onClick={this.closeEditor}>Cancel</Button>{!s.detailLoading && <Button onClick={() => this.openEditor({ id: s.detailId })}>Retry</Button>}</>} />}
      {s.editor && <SalesTargetForm record={s.editor} locations={s.locations} busy={s.saving} error={s.saveError} onSave={this.save} onCancel={this.closeEditor} />}
      {s.disableIds.length > 0 && <Modal visible title="Delete Sales Targets?" okText="Delete" okType="danger" confirmLoading={s.disabling} onOk={this.disable}
        onCancel={() => { if (!s.disabling) this.setState({ disableIds: [], disableError: '' }); }} maskClosable={false} closable={!s.disabling} keyboard={!s.disabling}
        cancelButtonProps={{ disabled: s.disabling }} okButtonProps={{ disabled: s.disabling }}>
        <p>Delete {s.disableIds.length} selected {s.disableIds.length === 1 ? 'target' : 'targets'}? The API will mark the records inactive.</p>
        {s.disableError && <Alert type="error" showIcon role="alert" message={s.disableError} />}
      </Modal>}
    </main>;
  }
}
