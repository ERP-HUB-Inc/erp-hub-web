import React from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Form, Input, InputNumber, Modal, Table, message } from 'antd';
import { ChevronRight, RefreshCw } from 'lucide-react';
import ExchangeRateService from '@services/ExchangeRateService';
import './Modules/Category/form/listing.css';

const emptyRecord = { currency: '', foreignCurrency: '', sellRate: null, buyRate: null };
const bodyOf = response => response && response.data && response.data.data !== undefined ? response.data.data : response && response.data;
const formatRate = value => value === null || value === undefined || value === '' ? '—' : Number(value).toLocaleString();
const errorText = (error, fallback) => {
  const body = error && error.response && error.response.data;
  const text = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof text === 'string' ? text : fallback;
};
const rateEntity = response => {
  const record = bodyOf(response);
  if (!record || typeof record !== 'object' || !record.id || typeof record.currency !== 'string' || typeof record.foreignCurrency !== 'string') throw new Error('The exchange rate response could not be read.');
  return {
    ...record,
    sellRate: record.sellRate === null || record.sellRate === undefined ? record.sellRate : Number(record.sellRate),
    buyRate: record.buyRate === null || record.buyRate === undefined ? record.buyRate : Number(record.buyRate)
  };
};
const listEntity = response => {
  const body = response && response.data;
  const data = body && body.data !== undefined ? body.data : body;
  const records = Array.isArray(data) ? data : data && (data.items || data.content);
  if (!Array.isArray(records)) throw new Error('The exchange rate list could not be read.');
  return { records, total: body && body.pagination && Number.isSafeInteger(body.pagination.total) ? body.pagination.total : records.length };
};

class ExchangeRateForm extends React.Component {
  submit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        const { record } = this.props;
        const rates = { sellRate: Number(values.sellRate), buyRate: Number(values.buyRate) };
        const payload = record.id
          ? rates
          : { currency: values.currency.trim().toUpperCase(), foreignCurrency: values.foreignCurrency.trim().toUpperCase(), ...rates };
        this.props.onSave(payload);
      }
    });
  };
  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const editing = Boolean(record.id);
    return <Modal visible title={editing ? 'Edit Exchange Rate' : 'New Exchange Rate'} width={680} okText={editing ? 'Save Changes' : 'Create Exchange Rate'} onOk={this.submit} onCancel={onCancel} confirmLoading={busy} closable={!busy} maskClosable={false} keyboard={!busy} cancelButtonProps={{ disabled: busy }} okButtonProps={{ disabled: busy }} destroyOnClose>
      {error && <Alert type="error" showIcon role="alert" message={error} />}
      <Form layout="vertical" onSubmit={this.submit}>
        <Form.Item label="Currency" htmlFor="exchange-rate-currency">{getFieldDecorator('currency', { initialValue: record.currency || '', rules: [{ required: true, whitespace: true, message: 'Enter a currency.' }, { max: 10, message: 'Use 10 characters or fewer.' }] })(<Input id="exchange-rate-currency" placeholder="KHR" disabled={busy || editing} autoFocus />)}</Form.Item>
        <Form.Item label="Foreign currency" htmlFor="exchange-rate-foreign-currency">{getFieldDecorator('foreignCurrency', { initialValue: record.foreignCurrency || '', rules: [{ required: true, whitespace: true, message: 'Enter a foreign currency.' }, { max: 10, message: 'Use 10 characters or fewer.' }] })(<Input id="exchange-rate-foreign-currency" placeholder="USD" disabled={busy || editing} />)}</Form.Item>
        <Form.Item label="Sell rate" htmlFor="exchange-rate-sell-rate">{getFieldDecorator('sellRate', { initialValue: record.sellRate, rules: [{ required: true, type: 'number', min: 0, message: 'Enter a valid sell rate.' }] })(<InputNumber id="exchange-rate-sell-rate" min={0} parser={value => value && value.replace(/[^\d.]/g, '')} style={{ width: '100%' }} disabled={busy} />)}</Form.Item>
        <Form.Item label="Buy rate" htmlFor="exchange-rate-buy-rate">{getFieldDecorator('buyRate', { initialValue: record.buyRate, rules: [{ required: true, type: 'number', min: 0, message: 'Enter a valid buy rate.' }] })(<InputNumber id="exchange-rate-buy-rate" min={0} parser={value => value && value.replace(/[^\d.]/g, '')} style={{ width: '100%' }} disabled={busy} />)}</Form.Item>
        <button type="submit" hidden disabled={busy}>Save exchange rate</button>
      </Form>
    </Modal>;
  }
}
const ExchangeRateFormModal = Form.create({ name: 'exchange-rate', fieldNameProp: null })(ExchangeRateForm);

export default class ExchangeRates extends React.Component {
  state = { records: [], total: 0, current: 1, pageSize: 20, loading: true, loadError: '', currentRate: null, editor: null, detailId: null, detailLoading: false, detailError: '', saving: false, saveError: '', deleteRecord: null, deleting: false, deleteError: '' };
  listRequest = 0;
  detailRequest = 0;
  componentDidMount() { this.load(); }
  componentWillUnmount() { this.unmounted = true; this.listRequest++; this.detailRequest++; }
  load = async (overrides = {}) => {
    const request = ++this.listRequest;
    const { current, pageSize } = { ...this.state, ...overrides };
    this.setState({ loading: true, loadError: '' });
    try {
      const [listResponse, currentResponse] = await Promise.all([ExchangeRateService.getExchangeRates(), ExchangeRateService.getCurrentExchangeRate()]);
      const list = listEntity(listResponse);
      if (!this.unmounted && request === this.listRequest) this.setState({ records: list.records, total: list.total, currentRate: bodyOf(currentResponse), loading: false, current, pageSize });
    } catch (error) {
      if (!this.unmounted && request === this.listRequest) this.setState({ records: [], total: 0, loading: false, loadError: errorText(error, 'Unable to load exchange rates.') });
    }
  };
  changePage = pagination => { const next = { current: pagination.pageSize === this.state.pageSize ? pagination.current : 1, pageSize: pagination.pageSize }; this.setState(next); this.load(next); };
  openEditor = async record => {
    if (this.state.saving || this.state.deleteRecord) return;
    const request = ++this.detailRequest;
    this.setState({ editor: null, detailId: record ? record.id : null, detailLoading: Boolean(record), detailError: '', saveError: '' });
    if (!record) { this.setState({ editor: emptyRecord }); return; }
    try {
      const rate = rateEntity(await ExchangeRateService.getExchangeRateById(record.id));
      if (!this.unmounted && request === this.detailRequest) this.setState({ editor: rate, detailId: null, detailLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.detailRequest) this.setState({ detailLoading: false, detailError: errorText(error, 'Unable to load the exchange rate.') });
    }
  };
  closeEditor = () => { if (!this.state.saving) { this.detailRequest++; this.setState({ editor: null, detailId: null, detailLoading: false, detailError: '', saveError: '' }); } };
  save = async payload => {
    const { editor, saving } = this.state;
    if (!editor || saving) return;
    this.setState({ saving: true, saveError: '' });
    try {
      const response = editor.id ? await ExchangeRateService.updateExchangeRate(editor.id, payload) : await ExchangeRateService.createExchangeRate(payload);
      if (response && response.data && response.data.data && !response.data.data.id) throw new Error('Saving the exchange rate could not be confirmed.');
      if (this.unmounted) return;
      this.setState({ saving: false, editor: null, current: 1 });
      message.success(editor.id ? 'Exchange rate updated.' : 'Exchange rate created.');
      await this.load({ current: 1 });
    } catch (error) { if (!this.unmounted) this.setState({ saving: false, saveError: errorText(error, 'Unable to save the exchange rate.') }); }
  };
  openDelete = record => {
    if (this.state.saving || this.state.editor || this.state.deleting) return;
    this.detailRequest++;
    this.setState({ deleteRecord: record, deleteError: '', detailId: null, detailLoading: false, detailError: '' });
  };
  closeDelete = () => { if (!this.state.deleting) this.setState({ deleteRecord: null, deleteError: '' }); };
  remove = async () => {
    const { deleteRecord, deleting } = this.state;
    if (!deleteRecord || deleting) return;
    this.setState({ deleting: true, deleteError: '' });
    try {
      const response = await ExchangeRateService.deleteExchangeRate(deleteRecord.id);
      const affected = response && response.data && response.data.affected;
      if (typeof affected === 'number' && affected < 1) throw new Error('The exchange rate was not deleted. Refresh and try again.');
      if (this.unmounted) return;
      this.setState({ deleting: false, deleteRecord: null, current: 1 });
      message.success('Exchange rate deleted.');
      await this.load({ current: 1 });
    } catch (error) {
      if (!this.unmounted) this.setState({ deleting: false, deleteError: errorText(error, 'Unable to delete the exchange rate.') });
    }
  };
  render() {
    const s = this.state;
    const current = s.currentRate || {};
    const columns = [
      { title: 'Foreign Currency', dataIndex: 'foreignCurrency', key: 'foreignCurrency' },
      { title: 'Currency', dataIndex: 'currency', key: 'currency', render: value => <strong>{value}</strong> },
      { title: 'Sell Rate', dataIndex: 'sellRate', key: 'sellRate', align: 'right', render: formatRate },
      { title: 'Buy Rate', dataIndex: 'buyRate', key: 'buyRate', align: 'right', render: formatRate },
      { title: 'Actions', key: 'actions', width: 180, render: (_, record) => <div className="expense-bill-actions"><Button size="small" disabled={s.saving || s.deleting || Boolean(s.editor) || Boolean(s.deleteRecord)} onClick={() => this.openEditor(record)}>Edit</Button><Button size="small" type="danger" loading={s.deleting && s.deleteRecord && s.deleteRecord.id === record.id} disabled={s.saving || Boolean(s.editor) || s.deleting} onClick={() => this.openDelete(record)}>Delete</Button></div> }
    ];
    return <main className="category-listing">
      <nav className="category-listing-breadcrumbs" aria-label="Breadcrumb"><Link to="/settings?tab=modules">System Settings</Link><ChevronRight size={14} aria-hidden="true" /><strong>Exchange Rates</strong></nav>
      <header className="category-listing-heading"><div><div className="category-listing-title"><h1>Exchange Rates</h1></div><p>Manage the buy and sell rates used when converting between currencies.</p></div><Button type="primary" size="large" icon="plus" disabled={s.saving || Boolean(s.deleteRecord)} onClick={() => this.openEditor()}>New Exchange Rate</Button></header>
      {current.id && <div className="category-listing-total">Current: {current.currency} / {current.foreignCurrency} · Sell {formatRate(current.sellRate)} · Buy {formatRate(current.buyRate)}</div>}
      {s.loadError && <Alert type="error" showIcon role="alert" message={s.loadError} description={<Button onClick={() => this.load()}>Retry</Button>} />}
      <div className="category-listing-toolbar"><span className="category-listing-muted">Rates are used by sales and invoice currency conversions.</span><Button className="category-listing-refresh-button" loading={s.loading} onClick={() => this.load()}><RefreshCw size={14} aria-hidden="true" /> Refresh</Button></div>
      <section className="category-listing-table-card" aria-label="Exchange rates"><Table rowKey="id" bordered size="middle" columns={columns} dataSource={s.records} loading={s.loading} onChange={this.changePage} scroll={{ x: 760 }} pagination={{ current: s.current, pageSize: s.pageSize, total: s.total, showSizeChanger: true, pageSizeOptions: ['20', '50', '100'], showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} exchange rates` }} locale={{ emptyText: s.loadError ? 'Exchange rates are unavailable' : 'No exchange rates found' }} /></section>
      {s.detailId && <Alert type={s.detailLoading ? 'info' : 'error'} showIcon role={s.detailLoading ? 'status' : 'alert'} message={s.detailLoading ? 'Loading exchange rate…' : s.detailError} description={<><Button onClick={this.closeEditor}>Cancel</Button>{!s.detailLoading && <Button onClick={() => this.openEditor({ id: s.detailId })}>Retry</Button>}</>} />}
      {s.editor && <ExchangeRateFormModal record={s.editor} busy={s.saving} error={s.saveError} onSave={this.save} onCancel={this.closeEditor} />}
      {s.deleteRecord && <Modal visible title="Delete Exchange Rate?" okText="Delete" okType="danger" confirmLoading={s.deleting} onOk={this.remove} onCancel={this.closeDelete} maskClosable={false} closable={!s.deleting} keyboard={!s.deleting} cancelButtonProps={{ disabled: s.deleting }} okButtonProps={{ disabled: s.deleting }}><p>Delete the rate from {s.deleteRecord.currency} to {s.deleteRecord.foreignCurrency}? This permanently removes the exchange rate.</p>{s.deleteError && <Alert type="error" showIcon role="alert" message={s.deleteError} />}</Modal>}
    </main>;
  }
}
