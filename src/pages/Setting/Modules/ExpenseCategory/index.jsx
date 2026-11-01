import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Input, Modal, Table, message } from 'antd';
import { ChevronRight, RefreshCw } from 'lucide-react';
import ExpenseCategoryService from '@services/ExpenseCategoryService';
import ExpenseCategoryForm from './ExpenseCategoryForm';
import { categoryEntity, errorText } from './model';
import '../Category/form/listing.css';
import '../../../Finance/Expense/expense.css';

export default class ExpenseCategoryPage extends React.Component {
  state = {
    records: [], total: 0, current: 1, pageSize: 20, search: '', loading: true, loadError: '',
    editor: null, detailId: null, detailLoading: false, detailError: '', saving: false, saveError: '',
    deleteRecord: null, deleting: false, deleteError: ''
  };
  listRequest = 0;
  detailRequest = 0;
  componentDidMount() { this.load(); }
  componentWillUnmount() { this.unmounted = true; this.listRequest++; this.detailRequest++; clearTimeout(this.searchTimer); }

  load = async (overrides = {}) => {
    const request = ++this.listRequest;
    const { current, pageSize, search } = { ...this.state, ...overrides };
    this.setState({ loading: true, loadError: '' });
    try {
      const { data: body } = await ExpenseCategoryService.get({ limit: pageSize, offset: (current - 1) * pageSize, search });
      if (!body || !Array.isArray(body.data) || body.data.some(row => !row || !row.id || typeof row.name !== 'string') ||
        !body.pagination || !Number.isSafeInteger(body.pagination.total) || body.pagination.total < 0) throw new Error('The expense category list could not be read.');
      if (!this.unmounted && request === this.listRequest) this.setState({ records: body.data, total: body.pagination.total, loading: false });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorText(error, 'Unable to load expense categories.') });
    }
  };

  search = event => {
    const search = event.target.value;
    clearTimeout(this.searchTimer);
    this.listRequest++;
    this.setState({ search, current: 1 });
    this.searchTimer = setTimeout(() => this.load({ search, current: 1 }), 300);
  };

  changePage = pagination => {
    clearTimeout(this.searchTimer);
    const next = { current: pagination.pageSize === this.state.pageSize ? pagination.current : 1, pageSize: pagination.pageSize };
    this.setState(next);
    this.load(next);
  };

  openEditor = async record => {
    if (this.state.saving || this.state.deleteRecord) return;
    const request = ++this.detailRequest;
    this.setState({ editor: null, detailId: record ? record.id : null, detailLoading: Boolean(record), detailError: '', saveError: '' });
    if (!record) { this.setState({ editor: {} }); return; }
    try {
      const category = categoryEntity(await ExpenseCategoryService.getById(record.id));
      if (!category || category.id !== record.id || typeof category.name !== 'string') throw new Error('The expense category could not be read.');
      if (!this.unmounted && request === this.detailRequest) this.setState({ editor: category, detailId: null, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorText(error, 'Unable to load the expense category.') });
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
      const category = categoryEntity(await (editor.id ? ExpenseCategoryService.update({ ...payload, id: editor.id }) : ExpenseCategoryService.add(payload)));
      if (!category || !category.id || typeof category.name !== 'string' || editor.id && category.id !== editor.id) throw new Error('Saving the expense category could not be confirmed.');
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id ? 'Expense category updated.' : 'Expense category created.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ saving: false, saveError: errorText(error, 'Unable to save the expense category.') });
    }
  };

  openDelete = record => {
    if (this.state.saving || this.state.editor || this.state.deleting) return;
    this.detailRequest++;
    this.setState({ deleteRecord: record, deleteError: '', detailId: null, detailLoading: false, detailError: '' });
  };

  closeDelete = () => {
    if (!this.state.deleting) this.setState({ deleteRecord: null, deleteError: '' });
  };

  remove = async () => {
    const { deleteRecord, deleting } = this.state;
    if (!deleteRecord || deleting) return;
    this.setState({ deleting: true, deleteError: '' });
    try {
      const response = await ExpenseCategoryService.archive(deleteRecord.id);
      if (!response.data || !(response.data.affected > 0)) throw new Error('The expense category was not deleted. Refresh and try again.');
      if (this.unmounted) return;
      this.setState({ deleting: false, deleteRecord: null, current: 1 });
      message.success('Expense category deleted.');
      clearTimeout(this.searchTimer);
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ deleting: false, deleteError: errorText(error, 'Unable to delete the expense category.') });
    }
  };

  render() {
    const s = this.state;
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', render: name => <strong>{name}</strong> },
      { title: 'Khmer Name', dataIndex: 'namekh', key: 'namekh', render: name => name || '—' },
      { title: 'Total Expense', key: 'totalExpense', align: 'right', render: (_, record) => {
        const total = Array.isArray(record.expenseTotals) ? record.expenseTotals[0] : null;
        if (!total || total.totalExpense == null || total.totalExpense === '') return '—';
        const amount = Number(total.totalExpense);
        if (!Number.isFinite(amount)) return '—';
        const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
        const currency = total.currency || {};
        const value = currency.symbol ? `${currency.symbol}${formatted}` : formatted;
        return currency.code ? `${value} ${currency.code}` : value;
      } },
      { title: 'Actions', key: 'actions', width: 190, render: (_, record) => <div className="expense-bill-actions">
        <Button size="small" disabled={s.saving || Boolean(s.deleteRecord) || Boolean(s.editor)} onClick={() => this.openEditor(record)}>Edit</Button>
        <Button size="small" type="danger" loading={s.deleting && s.deleteRecord && s.deleteRecord.id === record.id} disabled={s.saving || Boolean(s.editor) || s.deleting} onClick={() => this.openDelete(record)}>Delete</Button>
      </div> }
    ];
    return <main className="category-listing">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Expense Categories</strong></nav>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Expense Categories</h1></div><p>Manage expense categories and their Khmer names.</p></div>
        <Button type="primary" size="large" icon="plus" disabled={s.saving || Boolean(s.deleteRecord)} onClick={() => this.openEditor()}>New Expense Category</Button>
      </header>
      <div className="category-listing-toolbar">
        <Input.Search className="category-listing-search" aria-label="Search expense categories" placeholder="Search by name or Khmer name" value={s.search} allowClear onChange={this.search} />
        <Button className="category-listing-refresh-button" loading={s.loading} onClick={() => { clearTimeout(this.searchTimer); this.load(); }}><RefreshCw size={14} aria-hidden="true" /> Refresh</Button>
      </div>
      {s.loadError && <Alert type="error" showIcon role="alert" message={s.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
      <section className="category-listing-table-card" aria-label="Expense categories">
        <Table rowKey="id" bordered size="middle" columns={columns} dataSource={s.records} loading={s.loading} onChange={this.changePage} scroll={{ x: 820 }}
          pagination={{ current: s.current, pageSize: s.pageSize, total: s.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'], showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} categories` }}
          locale={{ emptyText: s.loadError ? 'Expense categories are unavailable' : 'No expense categories found' }} />
      </section>
      {s.detailId && <Alert type={s.detailLoading ? 'info' : 'error'} showIcon role={s.detailLoading ? 'status' : 'alert'} message={s.detailLoading ? 'Loading expense category…' : s.detailError}
        description={<><Button onClick={this.closeEditor}>Cancel</Button>{!s.detailLoading && <Button onClick={() => this.openEditor({ id: s.detailId })}>Retry</Button>}</>} />}
      {s.editor && <ExpenseCategoryForm record={s.editor} busy={s.saving} error={s.saveError} onSave={this.save} onCancel={this.closeEditor} />}
      {s.deleteRecord && <Modal visible title="Delete Expense Category?" okText="Delete" okType="danger" confirmLoading={s.deleting}
        onOk={this.remove} onCancel={this.closeDelete} maskClosable={false} closable={!s.deleting} keyboard={!s.deleting}
        cancelButtonProps={{ disabled: s.deleting }} okButtonProps={{ disabled: s.deleting }}>
        <p>Delete “{s.deleteRecord.name}”? This permanently removes the expense category and cannot be undone.</p>
        {s.deleteError && <Alert type="error" showIcon role="alert" message={s.deleteError} />}
      </Modal>}
    </main>;
  }
}
