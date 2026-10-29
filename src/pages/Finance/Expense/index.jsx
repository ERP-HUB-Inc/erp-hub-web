import React from 'react';
import moment from 'moment';
import { Alert, Button, DatePicker, Input, Modal, Pagination, Radio, Select, Skeleton, Table, Tag, Tooltip, message } from 'antd';
import { Bell, CalendarDays, ChevronRight, Download, FileText, Plus, Receipt, RefreshCw, Repeat, Search, ShieldCheck, SlidersHorizontal, UploadCloud, Wallet } from 'lucide-react';
import ExpenseService from '@services/ExpenseService';
import ExpenseForm from './ExpenseForm';
import { duplicateDetails, entity, errorText, expenseLocation, expenseLocations, expenseMoney, frequencies, loadSnapshot, periodRows } from './model';
import './expense.css';

const unavailable = 'This information is not available yet.';
const tabs = [
  { key: 'all', label: 'All Expenses', icon: Receipt },
  { key: 'drawers', label: 'Cash Drawers', icon: Wallet },
  { key: 'approval', label: 'Needs Approval', icon: ShieldCheck },
  { key: 'recurring', label: 'Monthly Bills & Rent', icon: Repeat },
  { key: 'audit', label: 'Petty Cash Audit', icon: FileText }
];

function PendingButton({ children, reason, ...props }) {
  return <Tooltip title={reason}><span className="expense-disabled-action"><Button disabled {...props}>{children}</Button></span></Tooltip>;
}

export default class ExpensePage extends React.Component {
  state = {
    records: [], loading: false, loadError: '',
    month: moment().startOf('month'), tab: 'recurring', search: '', query: '', locationId: '', current: 1,
    editor: null, saving: false, saveError: '', duplicate: null, duplicateId: '',
    detail: null, detailLoading: false, detailError: '', calendar: false
  };
  request = 0;
  detailRequest = 0;
  componentDidMount() { this.load(); }
  componentWillUnmount() { this.unmounted = true; this.request++; this.detailRequest++; clearTimeout(this.searchTimer); }

  load = async () => {
    const request = ++this.request;
    this.setState({ loading: true, loadError: '', records: [] });
    try {
      const records = await loadSnapshot(options => ExpenseService.get(options), () => !this.unmounted && request === this.request);
      if (records && !this.unmounted && request === this.request) this.setState(state => ({
        records, loading: false, current: 1,
        locationId: expenseLocations(records).some(location => location.id === state.locationId) ? state.locationId : ''
      }));
    } catch (error) {
      if (!this.unmounted && request === this.request) this.setState({ records: [], loading: false, loadError: errorText(error, 'Unable to load expenses.') });
    }
  };

  search = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.setState({ search });
    this.searchTimer = setTimeout(() => this.setState({ query: search, current: 1 }), 300);
  };

  changeLocation = locationId => this.setState({ locationId, current: 1 });

  openDetail = async row => {
    const request = ++this.detailRequest;
    this.setState({ detail: row, detailLoading: true, detailError: '' });
    try {
      const detail = entity(await ExpenseService.getById(row.id));
      if (detail.id !== row.id) throw new Error('This expense could not be confirmed.');
      if (!this.unmounted && request === this.detailRequest) this.setState({ detail, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorText(error, 'Unable to load this expense.') });
    }
  };

  save = async (payload, confirmation = {}) => {
    const { editor, saving } = this.state;
    if (!editor || Number(editor.isSystem) === 1 || saving || this.saving) return;
    this.saving = true;
    this.setState({ saving: true, saveError: '' });
    try {
      const response = editor.id ? await ExpenseService.update({ ...payload, id: editor.id }) : await ExpenseService.add({ ...payload, type: 0, ...confirmation });
      const saved = entity(response);
      if (editor.id && saved.id !== editor.id) throw new Error('The updated expense could not be confirmed.');
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, duplicate: null, duplicateId: '' });
      message.success('Expense saved.');
      this.load();
    } catch (error) {
      if (this.unmounted) return;
      const duplicate = !editor.id && duplicateDetails(error);
      this.setState({ saving: false, saveError: errorText(error, 'Unable to save this expense.'),
        duplicate: duplicate ? { ...duplicate, payload } : null, duplicateId: '' });
    } finally {
      this.saving = false;
    }
  };

  exportRows = rows => {
    // Keep raw amounts and their currency identity in separate CSV columns.
    const cell = value => `"${String(value == null ? '' : value).replace(/^[=+@\-\t\r]/, "'$&").replace(/"/g, '""')}"`;
    const csv = [['Purpose', 'Category', 'Branch name', 'Branch code', 'Location ID', 'Amount', 'Currency code', 'Currency name', 'Currency symbol', 'Currency ID', 'Entry date', 'Recurring record'], ...rows.map(row => {
      const currency = expenseMoney(row);
      const location = expenseLocation(row);
      return [row.name, row.category, location.name, location.code, location.id, row.amount, currency.code, currency.name, currency.symbol, row.currencyId || row.currency && row.currency.id, row.date, Number(row.isRecurring) === 1 ? 'Yes' : 'No'];
    })].map(row => row.map(cell).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `expenses-${this.state.month.format('YYYY-MM')}.csv`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  render() {
    const state = this.state;
    const locations = expenseLocations(state.records);
    const allRows = periodRows(state.records, state.month, 'all', '', state.locationId);
    const recurringRows = allRows.filter(row => Number(row.isRecurring) === 1);
    const rows = periodRows(state.records, state.month, state.tab, state.query, state.locationId);
    const ready = !state.loading && !state.loadError;
    const supportedTab = ['all', 'recurring'].includes(state.tab);
    const columns = [
      { title: 'BILL PURPOSE & CONTRACT', key: 'purpose', width: 265, render: (_, row) => <div className="expense-purpose"><span className="expense-icon-tile"><Receipt size={19} /></span><div><button className="expense-record-link" onClick={() => this.openDetail(row)}>{row.name || 'Untitled expense'}</button><small>{row.category || 'No category supplied'}</small></div></div> },
      { title: 'LANDLORD / VENDOR PAYEE', key: 'payee', width: 190, render: () => <span className="expense-muted">Not linked</span> },
      { title: 'BRANCH SHOP', key: 'branch', width: 145, render: (_, row) => {
        const location = expenseLocation(row);
        return location.name ? <Tag color="blue">{location.name}</Tag> : <span className="expense-muted">Location unavailable</span>;
      } },
      { title: 'AMOUNT / CYCLE', key: 'amount', width: 170, align: 'right', render: (_, row) => {
        const money = expenseMoney(row);
        return <div><strong>{money.amount}</strong><small>{money.label}</small></div>;
      } },
      { title: 'NEXT DUE DATE', key: 'due', width: 165, render: (_, row) => <div><span>Schedule unavailable</span><small>Entry: {moment(row.date).format('DD MMM YYYY')}</small></div> },
      { title: 'METHOD', key: 'method', width: 135, render: () => <span className="expense-muted">Not supplied</span> },
      { title: 'STATUS', key: 'status', width: 165, render: (_, row) => <Tag color={Number(row.isRecurring) === 1 ? 'green' : 'blue'}>{Number(row.isRecurring) === 1 ? 'Recurring record' : 'Recorded expense'}</Tag> }
    ];

    return <main className="expense-page">
      <nav aria-label="Breadcrumb" className="expense-breadcrumb"><span>Finance</span><ChevronRight size={13} /><span>Expenses & Money Out</span><ChevronRight size={13} /><strong>Fixed & Recurring Overhead</strong></nav>
      <header className="expense-header">
        <div><h1>Expenses & Money Out</h1><p>Track daily store spending and recurring monthly bills across your shops.</p></div>
        <div className="expense-header-controls">
          <div className="expense-control-line expense-header-actions">
            <Button style={{ display: 'none' }} onClick={() => this.setState({ calendar: true })}><CalendarDays size={15} />Payment Calendar</Button>
            <Button onClick={() => this.setState({ editor: {}, saveError: '' })}><Receipt size={15} />Record Expense</Button>
            <Button className="expense-primary" onClick={() => this.setState({ editor: { isRecurring: 1 }, saveError: '' })}><Plus size={16} />Add Recurring Bill</Button>
          </div>
        </div>
      </header>
        <nav className="expense-tabs" aria-label="Expense views">{tabs.map(tab => { const Icon = tab.icon; return <button key={tab.key} aria-current={state.tab === tab.key ? 'page' : undefined} className={state.tab === tab.key ? 'selected' : ''} onClick={() => this.setState({ tab: tab.key, current: 1 })}><Icon size={16} />{tab.label}{ready && tab.key === 'all' && <span>{allRows.length}</span>}{ready && tab.key === 'recurring' && <span>{recurringRows.length} records</span>}</button>; })}</nav>
        <section className="expense-metrics" aria-label="Expense summary">
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Total Monthly Fixed Bills<Repeat size={17} /></div><h2>Not available</h2><p>{ready ? `${recurringRows.length} recurring records entered in ${state.month.format('MMM YYYY')}` : 'Loading recorded expenses…'}</p><div className="expense-metric-bottom">Commitment schedules are required to calculate monthly totals.</div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Upcoming Rent Due Soon<CalendarDays size={17} /></div><h2>Not available</h2><p>Unpaid rent due within the next 7 days</p><div className="expense-metric-bottom expense-callout"><Bell size={18} /><span>Due schedules are not connected</span><PendingButton reason="Payment allocations and due obligations are not available.">Pay Now</PendingButton></div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Paid This Month ({state.month.format('MMM')})<Wallet size={17} /></div><h2>Not available</h2><p>Payment reconciliation is not connected.</p><div className="expense-metric-bottom">Settlement Progress<span className="expense-neutral-track" />Reconciled bill count unavailable</div></article>
          <article className="expense-card expense-metric"><div className="expense-metric-heading">Auto-Generate Status<SlidersHorizontal size={17} /></div><span className="expense-neutral-badge">Not connected</span><h2 className="expense-engine-title">Manual records available</h2><p>Automatic payment drafts and reminders are not configured.</p><div className="expense-metric-bottom">Next batch unavailable<PendingButton reason="A recurring generation settings API is required.">Settings</PendingButton></div></article>
        </section>
        {supportedTab ? <section className="expense-card expense-table-card" aria-label="Expense records">
          <div className="expense-toolbar"><Input prefix={<Search size={16} />} aria-label="Search expense purpose or category" placeholder="Search bill name or category…" value={state.search} onChange={this.search} allowClear />
            <DatePicker.MonthPicker className="expense-reporting-month" aria-label="Reporting month" allowClear={false} value={state.month} format="MMMM YYYY" onChange={month => month && this.setState({ month: month.clone().startOf('month'), current: 1 })} />
            <Select value={locations.some(location => location.id === state.locationId) ? state.locationId : ''} disabled={!ready || !locations.length} aria-label="Branch filter" onChange={this.changeLocation}>
              <Select.Option value="">All returned branches ({locations.length})</Select.Option>
              {locations.map(location => <Select.Option key={location.id} value={location.id}>{location.name || 'Location unavailable'}</Select.Option>)}
            </Select>
            <Select value={state.tab} aria-label="Expense recurrence filter" onChange={tab => this.setState({ tab, current: 1 })}><Select.Option value="recurring">Recurring records</Select.Option><Select.Option value="all">All expense records</Select.Option></Select>
            <Tooltip title="Payment and active/paused states are not supplied."><span><Select value="unknown" disabled aria-label="Status filter"><Select.Option value="unknown">Status: Not supplied</Select.Option></Select></span></Tooltip>
            <Button aria-label="Refresh expenses" loading={state.loading} onClick={this.load}><RefreshCw size={16} /></Button>
            <Button aria-label="Export filtered expense records as CSV" disabled={!ready || !rows.length} onClick={() => this.exportRows(rows)}><Download size={16} /></Button>
          </div>
          <p className="expense-table-note">Records entered in {state.month.format('MMMM YYYY')}. Recurring records are not confirmed commitments or unpaid bills.</p>
          {state.loadError && <Alert type="error" showIcon role="alert" message={state.loadError} description={<Button onClick={this.load}>Retry</Button>} />}
          <Table columns={columns} dataSource={rows.slice((state.current - 1) * 10, state.current * 10)} rowKey="id" loading={state.loading} pagination={false} scroll={{ x: 1235 }} locale={{ emptyText: state.loadError ? 'Expenses could not be loaded.' : 'No expense records match this period and search.' }} />
          <footer className="expense-table-footer"><span>{ready ? `Showing ${rows.length ? (state.current - 1) * 10 + 1 : 0}–${Math.min(state.current * 10, rows.length)} of ${rows.length} ${state.tab === 'recurring' ? 'recurring ' : ''}expense records` : 'Expense records unavailable'}</span>
            <div className="expense-cycle"><Button onClick={() => this.setState({ month: state.month.clone().subtract(1, 'month'), current: 1 })}>Previous Cycle</Button><Button onClick={() => this.setState({ month: state.month.clone().add(1, 'month'), current: 1 })}>Next Cycle ({state.month.clone().add(1, 'month').format('MMM YYYY')})</Button></div>
            {rows.length > 10 && <Pagination current={state.current} pageSize={10} total={rows.length} onChange={current => this.setState({ current })} />}
          </footer>
        </section> : <section className="expense-card expense-unavailable"><h2>{tabs.find(tab => tab.key === state.tab).label}</h2><p>{state.tab === 'approval' ? 'Expense approval records are not available yet.' : state.tab === 'drawers' ? 'Cash drawer balances and shop register records are not connected to this view yet.' : 'Petty cash audit records are not available yet.'}</p><Button onClick={() => this.setState({ tab: 'recurring' })}>Back to Monthly Bills & Rent</Button></section>}
        <div className="expense-lower-grid">
          <section className="expense-card expense-timeline"><div className="expense-section-heading"><h2><CalendarDays size={20} />Upcoming Rent & Lease Timeline</h2><span>Next 30 Days</span></div><p>Scheduled unpaid obligations will appear here when bill and payment tracking are connected.</p>
            <div className="expense-timeline-empty"><span className="expense-icon-tile"><CalendarDays size={26} /></span><strong>Payment schedule unavailable</strong><p>Saved recurrence dates do not establish outstanding amounts or payment approval.</p></div>
            <footer><PendingButton reason="Actual unpaid obligations and a PDF reporting API are required.">Export 30-Day Cash Flow Outflow (PDF) →</PendingButton><strong>Total Next 30D: Unavailable</strong></footer>
          </section>
          <div className="expense-right-column"><section className="expense-wht"><h2><ShieldCheck size={21} />SME Tip: Lease Withholding Tax (WHT)</h2><p>Applicable lease payments may require withholding according to your business’s configured tax treatment.</p>
            <div className="expense-wht-calculation"><div><span>Gross Agreed Lease</span><strong>Not configured</strong></div><div><span>WHT payable</span><strong>Rate unavailable</strong></div><div><span>Net Paid to Landlord</span><strong>Not calculated</strong></div></div>
            <p>Gross-agreed and net-agreed leases require separate calculations. Lease tax rules, payment deductions and WHT slips are not connected to expense records yet.</p>
            <div className="expense-wht-actions"><PendingButton reason="Lease contracts and WHT slips are not available."><FileText size={15} />View Lease Contracts & WHT Slips</PendingButton><PendingButton reason="No expense WHT configuration contract is available."><SlidersHorizontal size={15} />Configure WHT %</PendingButton></div>
          </section>
          <section className="expense-card expense-upload"><span className="expense-icon-tile"><UploadCloud size={24} /></span><div><h3>Import Landlord Invoices</h3><p>Attach PDFs or scans after reviewing an expense.</p></div><Button onClick={() => this.setState({ editor: {}, saveError: '' })}>Upload</Button></section></div>
        </div>
      {state.editor && <ExpenseForm key={state.editor.id || `new-${state.editor.isRecurring || 0}`} record={state.editor} recurring={Number(state.editor.isRecurring) === 1} busy={state.saving} error={state.saveError} onSave={this.save} onCancel={() => { if (!state.saving) this.setState({ editor: null, duplicate: null }); }} />}
      <Modal visible={Boolean(state.duplicate)} title="Matching expense found" footer={null} closable={!state.saving} maskClosable={false} onCancel={() => { if (!state.saving) this.setState({ duplicate: null }); }}>
        {state.duplicate && <><p>Choose whether to create another expense or override a matching record. Cancel makes no further changes.</p><Radio.Group value={state.duplicateId} disabled={state.saving} onChange={event => this.setState({ duplicateId: event.target.value })}>{state.duplicate.duplicates.map(row => <Radio key={row.id} value={row.id} style={{ display: 'block', marginBottom: 10 }}>{row.name} · {row.amount} · {row.registerDate && String(row.registerDate).slice(0, 10)}</Radio>)}</Radio.Group><div className="expense-duplicate-actions"><Button disabled={state.saving} onClick={() => this.setState({ duplicate: null })}>Cancel</Button>{state.duplicate.allowedActions.includes('create') && <Button loading={state.saving} onClick={() => this.save(state.duplicate.payload, { duplicateAction: 'create' })}>Create New</Button>}{state.duplicate.allowedActions.includes('override') && <Button type="primary" loading={state.saving} disabled={!state.duplicateId} onClick={() => this.save(state.duplicate.payload, { duplicateAction: 'override', duplicateExpenseId: state.duplicateId })}>Override Selected</Button>}</div></>}
      </Modal>
      <Modal visible={Boolean(state.detail)} title="Expense record details" footer={null} onCancel={() => { this.detailRequest++; this.setState({ detail: null }); }}>
        {state.detailLoading ? <Skeleton active /> : state.detailError ? <Alert type="error" message={state.detailError} description={<Button onClick={() => this.openDetail(state.detail)}>Retry</Button>} /> : state.detail && <div className="expense-detail"><h2>{state.detail.name}</h2><dl>{[
          ['Category', state.detail.categoryName || state.detail.category && state.detail.category.name], ['Amount', state.detail.amount],
          ['Currency reference', state.detail.currencyId], ['Branch', state.detail.location && state.detail.location.name || state.detail.locationId],
          ['Entry date', state.detail.registerDate && moment(state.detail.registerDate).format('DD MMM YYYY')],
          ['Frequency', Number(state.detail.isRecurring) === 1 ? frequencies[state.detail.recurringType] || 'Not supplied' : 'One-off'],
          ['Recurrence date', state.detail.recurringDate && moment(state.detail.recurringDate).isValid() ? moment(state.detail.recurringDate).format('DD MMM YYYY') : 'Not supplied'],
          ['Supporting document', state.detail.attachment ? 'Document linked to this record' : 'No document linked']
        ].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value == null || value === '' ? unavailable : String(value)}</dd></div>)}</dl><Alert type="info" message="This record does not confirm a payment, reconciliation or unpaid obligation." />{Number(state.detail.isSystem) !== 1 && <Button onClick={() => this.setState({ editor: state.detail, detail: null, saveError: '' })}>Edit record / attach document</Button>}</div>}
      </Modal>
      <Modal visible={state.calendar} title="Payment Calendar" footer={<Button onClick={() => this.setState({ calendar: false })}>Close</Button>} onCancel={() => this.setState({ calendar: false })}><Alert type="info" showIcon message="Payment schedule unavailable" description="Saved recurrence dates do not confirm due bills or payment allocations. A payment calendar will be available when those records are connected." /></Modal>
    </main>;
  }
}
