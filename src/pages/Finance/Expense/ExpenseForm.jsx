import React from 'react';
import moment from 'moment';
import { Alert, Button, DatePicker, Form, Input, InputNumber, Modal, Progress, Select, Spin, Upload } from 'antd';
import ExpenseService from '@services/ExpenseService';
import { errorText, frequencies, loadSnapshot, validAttachment } from './model';

const calendarDateRule = { validator: (_, value, callback) => callback(moment.isMoment(value) && value.isValid() ? undefined : 'Choose a valid calendar date.') };

export class ExpenseForm extends React.Component {
  state = { loading: true, error: '', locations: [], currencies: [], categories: [], uploading: false, progress: 0, attachment: this.props.record.attachment || '' };
  componentDidMount() { this.loadOptions(); }
  componentWillUnmount() { this.unmounted = true; }

  loadOptions = async () => {
    this.setState({ loading: true, error: '' });
    try {
      const [locations, currencies, response] = await Promise.all([
        loadSnapshot(options => ExpenseService.locations(options), () => !this.unmounted),
        loadSnapshot(options => ExpenseService.currencies(options), () => !this.unmounted),
        ExpenseService.categories()
      ]);
      const categories = Array.isArray(response.data) ? response.data : response.data && response.data.data;
      if (!Array.isArray(categories)) throw new Error('Expense categories could not be loaded.');
      if (!this.unmounted) this.setState({ locations, currencies, categories, loading: false });
    } catch (error) {
      if (!this.unmounted) this.setState({ loading: false, error: errorText(error, 'Unable to load expense choices.') });
    }
  };

  upload = async file => {
    if (this.state.uploading || this.props.busy) return false;
    const invalid = validAttachment(file);
    if (invalid) { this.setState({ error: invalid }); return false; }
    this.setState({ uploading: true, progress: 0, error: '' });
    try {
      const response = await ExpenseService.upload(file, event => {
        if (!this.unmounted && event.total) this.setState({ progress: Math.round(event.loaded / event.total * 100) });
      });
      const body = response.data;
      if (!body || body.status !== 'success' || typeof body.key !== 'string' || !body.key) throw new Error('The document upload could not be confirmed.');
      if (!this.unmounted) this.setState({ uploading: false, attachment: body.key, progress: 100 });
    } catch (error) {
      if (!this.unmounted) this.setState({ uploading: false, error: errorText(error, 'Unable to upload the document.') });
    }
    return false;
  };

  submit = event => {
    if (event) event.preventDefault();
    if (this.props.busy || this.state.loading || this.state.uploading || !this.state.locations.length || !this.state.currencies.length) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      const payload = {
        name: values.name.trim(), amount: values.amount,
        locationId: values.locationId, currencyId: values.currencyId,
        categoryName: values.categoryName, registerDate: values.registerDate.format('YYYY-MM-DD'),
        isRecurring: this.props.recurring ? 1 : 0,
        attachment: this.state.attachment
      };
      if (this.props.recurring) {
        payload.recurringType = values.recurringType;
        payload.recurringDate = values.recurringDate.format('YYYY-MM-DD');
      }
      // Keep an existing category relation; static category choices have no IDs.
      if (this.props.record.categoryId) payload.categoryId = this.props.record.categoryId;
      this.props.onSave(payload);
    });
  };

  render() {
    const { record, recurring, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const state = this.state;
    const locked = busy || state.uploading;
    const date = value => value && moment(value).isValid() ? moment(value) : undefined;
    return <Modal visible title={record.id ? 'Edit expense record' : recurring ? 'Add Recurring Bill' : 'Record Expense'} width={680}
      okText={record.id ? 'Save Changes' : 'Save Expense'} onOk={this.submit} onCancel={onCancel}
      confirmLoading={busy} closable={!locked} maskClosable={false}
      cancelButtonProps={{ disabled: locked }} okButtonProps={{ disabled: state.loading || locked || !state.locations.length || !state.currencies.length }}>
      <div className="expense-form">
        {recurring && <Alert type="info" showIcon message="Save a recurring expense record" description="Frequency and recurrence date are stored. Automatic drafts, reminders, contract terms and payments are not available yet." />}
        {(error || state.error) && <Alert type="error" showIcon role="alert" message={error || state.error} />}
        {state.loading ? <Spin tip="Loading expense choices…" /> : state.error && (!state.locations.length || !state.currencies.length) ? <Button onClick={this.loadOptions}>Retry choices</Button> : <Form layout="vertical" onSubmit={this.submit}>
          {(!state.locations.length || !state.currencies.length) && <Alert type="warning" message="An authorized branch and configured currency are required before saving." />}
          <Form.Item label="Bill purpose" htmlFor="expense-name">{getFieldDecorator('name', { initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter the expense purpose.' }] })(<Input id="expense-name" disabled={locked} autoFocus />)}</Form.Item>
          <div className="expense-form-grid">
            <Form.Item label="Expense category" htmlFor="expense-category" extra={record.categoryId ? 'The linked category is preserved when editing this record.' : undefined}>{getFieldDecorator('categoryName', { initialValue: record.categoryName || record.category && record.category.name || undefined, rules: [{ required: true, message: 'Choose an expense category.' }] })(<Select id="expense-category" disabled={locked || Boolean(record.categoryId)} placeholder="Choose category">{state.categories.map(category => <Select.Option key={category.name} value={category.name}>{category.name}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label="Authorized branch" htmlFor="expense-location">{getFieldDecorator('locationId', { initialValue: record.locationId, rules: [{ required: true, message: 'Choose an authorized branch.' }, { validator: (_, value, callback) => callback(state.locations.some(row => row.id === value) ? undefined : 'Choose an authorized branch.') }] })(<Select id="expense-location" disabled={locked} placeholder="Choose branch">{state.locations.map(row => <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label="Amount" htmlFor="expense-amount">{getFieldDecorator('amount', { initialValue: record.amount == null ? undefined : Number(record.amount), rules: [{ required: true, type: 'number', min: 0.01, message: 'Enter an amount greater than zero.' }, { validator: (_, value, callback) => callback(Number.isFinite(value) ? undefined : 'Enter a finite amount.') }] })(<InputNumber id="expense-amount" min={0.01} precision={2} disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="Currency" htmlFor="expense-currency">{getFieldDecorator('currencyId', { initialValue: record.currencyId, rules: [{ required: true, message: 'Choose a currency.' }, { validator: (_, value, callback) => callback(state.currencies.some(row => row.id === value) ? undefined : 'Choose a configured currency.') }] })(<Select id="expense-currency" disabled={locked} placeholder="Choose currency">{state.currencies.map(row => <Select.Option key={row.id} value={row.id}>{row.code || row.name}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label="Entry date" htmlFor="expense-date">{getFieldDecorator('registerDate', { initialValue: date(record.registerDate) || moment(), rules: [{ required: true, message: 'Choose the entry date.' }, calendarDateRule] })(<DatePicker id="expense-date" disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            {recurring && <>
              <Form.Item label="Frequency" htmlFor="expense-frequency">{getFieldDecorator('recurringType', { initialValue: record.recurringType == null ? 3 : Number(record.recurringType), rules: [{ required: true, message: 'Choose a frequency.' }] })(<Select id="expense-frequency" disabled={locked}>{Object.keys(frequencies).map(key => <Select.Option key={key} value={Number(key)}>{frequencies[key]}</Select.Option>)}</Select>)}</Form.Item>
              <Form.Item label="Recurrence date" htmlFor="expense-recurrence" extra="This date does not confirm a scheduled or unpaid obligation.">{getFieldDecorator('recurringDate', { initialValue: date(record.recurringDate), rules: [{ required: true, message: 'Choose a recurrence date.' }, calendarDateRule] })(<DatePicker id="expense-recurrence" disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            </>}
          </div>
          <Form.Item label="Invoice or supporting document" extra="PDF, JPG, PNG, GIF or WebP, up to 10 MB. Review this expense association before saving. Uploading never records a payment.">
            <Upload.Dragger accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" multiple={false} showUploadList={false} beforeUpload={file => { this.upload(file); return false; }} disabled={locked}>
              <p>Drop a document here or click to choose</p>
              {state.attachment && <p>Document uploaded and ready to link</p>}
            </Upload.Dragger>
            {state.uploading && <Progress percent={state.progress} />}
          </Form.Item>
          <button type="submit" className="expense-hidden-submit" tabIndex={-1} aria-hidden="true" />
        </Form>}
      </div>
    </Modal>;
  }
}

export default Form.create({ name: 'finance-expense' })(ExpenseForm);
