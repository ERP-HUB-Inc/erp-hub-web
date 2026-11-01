import React from 'react';
import moment from 'moment';
import { Alert, Button, Checkbox, DatePicker, Form, Input, InputNumber, Modal, Progress, Select, Spin, Upload } from 'antd';
import ExpenseService from '@services/ExpenseService';
import ExpenseCategoryService from '@services/ExpenseCategoryService';
import { businessToday, commitmentFrequencies, errorText, frequencies, loadSnapshot, validAttachment } from './model';

const calendarDateRule = { validator: (_, value, callback) => callback(moment.isMoment(value) && value.isValid() ? undefined : 'Choose a valid calendar date.') };

export class ExpenseForm extends React.Component {
  state = { loading: true, error: '', locations: [], currencies: [], categories: [], categoriesLoading: false, categoriesError: '', uploading: false, progress: 0, attachment: this.props.record.attachment || '' };
  componentDidMount() { this.loadOptions(); }
  componentDidUpdate(previousProps) {
    if (previousProps.locations === this.props.locations) return;
    const previousIds = (previousProps.locations || []).map(row => String(row.id)).join(',');
    const currentLocations = this.props.locations || [];
    const currentIds = currentLocations.map(row => String(row.id)).join(',');
    if (previousIds !== currentIds) this.setState({ locations: currentLocations });
  }
  componentWillUnmount() { this.unmounted = true; this.categoryRequest++; clearTimeout(this.categorySearchTimer); }

  categoryRequest = 0;

  loadCategories = async (search = '') => {
    const request = ++this.categoryRequest;
    this.setState({ categoriesLoading: true, categoriesError: '' });
    try {
      const response = await ExpenseCategoryService.get({ limit: 20, offset: 0, search });
      const body = response && response.data;
      if (!body || !Array.isArray(body.data) || body.data.some(category => !category || typeof category.name !== 'string' || !category.name)) {
        throw new Error('Expense categories could not be loaded.');
      }
      const currentName = this.props.record.categoryName || this.props.record.category && this.props.record.category.name;
      const currentCategory = currentName && this.props.record.categoryId
        ? { id: this.props.record.categoryId, name: currentName, namekh: this.props.record.category && this.props.record.category.namekh }
        : null;
      const categories = currentCategory && !body.data.some(category => String(category.id) === String(currentCategory.id))
        ? [...body.data, currentCategory]
        : body.data;
      if (!this.unmounted && request === this.categoryRequest) this.setState({ categories, categoriesLoading: false });
    } catch (error) {
      if (!this.unmounted && request === this.categoryRequest) this.setState({ categoriesLoading: false, categoriesError: errorText(error, 'Unable to load expense categories.') });
    }
  };

  searchCategories = search => {
    clearTimeout(this.categorySearchTimer);
    this.categorySearchTimer = setTimeout(() => this.loadCategories(search), 250);
  };

  loadOptions = async () => {
    this.setState({ loading: true, error: '' });
    try {
      const [locations, currencies] = await Promise.all([
        Promise.resolve(this.props.locations || []),
        loadSnapshot(options => ExpenseService.currencies(options), () => !this.unmounted)
      ]);
      if (!this.unmounted) this.setState({ locations: this.props.locations || locations, currencies, loading: false }, this.loadCategories);
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
    if (this.props.busy || this.state.loading || this.state.uploading || !this.state.currencies.length || !this.props.commitment && !this.state.locations.length) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      if (this.props.commitment) {
        const payload = {
          name: values.name.trim(), amount: values.amount,
          locationId: values.locationId || null, currencyId: values.currencyId,
          categoryName: values.categoryName, startsOn: values.registerDate.format('YYYY-MM-DD'),
          frequency: values.frequency, intervalCount: values.intervalCount || 1,
          dueDay: values.dueDay || null, endsOn: values.endsOn ? values.endsOn.format('YYYY-MM-DD') : null,
          payeeName: values.payeeName || null, autoGenerate: Boolean(values.autoGenerate), status: values.status || 'active',
          draftLeadDays: values.draftLeadDays || 0
        };
        const selectedCategory = this.state.categories.find(category => category.name === values.categoryName);
        if (this.props.record.categoryId || selectedCategory && selectedCategory.id) payload.categoryId = this.props.record.categoryId || selectedCategory.id;
        this.props.onSave(payload);
        return;
      }
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
      const selectedCategory = this.state.categories.find(category => category.name === values.categoryName);
      if (this.props.record.categoryId || selectedCategory && selectedCategory.id) payload.categoryId = this.props.record.categoryId || selectedCategory.id;
      this.props.onSave(payload);
    });
  };

  render() {
    const { record, recurring, commitment, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const state = this.state;
    const locked = busy || state.uploading;
    const defaultLocationId = state.locations.length === 1 && !(commitment && record.id) ? state.locations[0].id : undefined;
    const date = value => value && moment(value).isValid() ? moment(value) : undefined;
    return <Modal visible title={commitment ? record.id ? 'Edit Recurring Bill' : 'Add Recurring Bill' : record.id ? 'Edit expense record' : recurring ? 'Add Recurring Expense Record' : 'Record Expense'} width={680}
      okText={record.id ? 'Save Changes' : commitment ? 'Save Commitment' : 'Save Expense'} onOk={this.submit} onCancel={onCancel}
      confirmLoading={busy} closable={!locked} maskClosable={false}
      cancelButtonProps={{ disabled: locked }} okButtonProps={{ disabled: state.loading || locked || !state.currencies.length || !commitment && !state.locations.length }}>
      <div className="expense-form">
        {commitment && <Alert type="info" showIcon message="Save a recurring obligation" description="This creates a commitment. It does not record a payment. Bills are generated separately from commitments." />}
        {recurring && !commitment && <Alert type="info" showIcon message="Save a recurring expense record" description="This is a recorded expense entry. Use Add Recurring Bill to create an obligation and scheduled bills." />}
        {(error || state.error) && <Alert type="error" showIcon role="alert" message={error || state.error} />}
        {state.loading ? <Spin tip="Loading expense choices…" /> : state.error && (!state.locations.length || !state.currencies.length) ? <Button onClick={this.loadOptions}>Retry choices</Button> : <Form layout="vertical" onSubmit={this.submit}>
          {(!state.currencies.length || !commitment && !state.locations.length) && <Alert type="warning" message={commitment ? 'A configured currency is required before saving.' : 'A branch and configured currency are required before saving.'} />}
          <Form.Item label="Bill purpose" htmlFor="expense-name">{getFieldDecorator('name', { initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter the expense purpose.' }] })(<Input id="expense-name" placeholder="e.g. Shop rent or electricity bill" disabled={locked} autoFocus />)}</Form.Item>
          <div className="expense-form-grid">
            <Form.Item label="Expense category" htmlFor="expense-category" extra={record.categoryId ? 'The linked category is preserved when editing this record.' : state.categoriesError || undefined}>{getFieldDecorator('categoryName', { initialValue: record.categoryName || record.category && record.category.name || undefined, rules: [{ required: true, message: 'Choose an expense category.' }] })(<Select id="expense-category" disabled={locked || Boolean(record.categoryId)} placeholder="Search expense categories" showSearch filterOption={false} onSearch={this.searchCategories} onFocus={() => { if (!state.categories.length) this.loadCategories(); }} notFoundContent={state.categoriesLoading ? 'Loading categories…' : state.categoriesError || 'No expense categories found'}>{state.categories.map(category => <Select.Option key={category.id || category.name} value={category.name}>{category.name}{category.namekh ? ` · ${category.namekh}` : ''}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label={commitment ? 'Branch (optional)' : 'Branch'} htmlFor="expense-location">{getFieldDecorator('locationId', { initialValue: record.locationId == null ? defaultLocationId : record.locationId, rules: [{ required: !commitment, message: 'Choose a branch.' }, { validator: (_, value, callback) => callback(value == null && commitment || state.locations.some(row => String(row.id) === String(value)) ? undefined : 'Choose a branch.') }] })(<Select id="expense-location" disabled={locked} placeholder={commitment ? 'All branches' : 'Choose branch'} allowClear={commitment}>{state.locations.map(row => <Select.Option key={row.id} value={row.id}>{row.name}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label="Amount" htmlFor="expense-amount">{getFieldDecorator('amount', { initialValue: record.amount == null ? undefined : Number(record.amount), rules: [{ required: true, type: 'number', min: 0.01, message: 'Enter an amount greater than zero.' }, { validator: (_, value, callback) => callback(Number.isFinite(value) ? undefined : 'Enter a finite amount.') }] })(<InputNumber id="expense-amount" placeholder="e.g. 150.00" min={0.01} precision={commitment ? 4 : 2} disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="Currency" htmlFor="expense-currency">{getFieldDecorator('currencyId', { initialValue: record.currencyId, rules: [{ required: true, message: 'Choose a currency.' }, { validator: (_, value, callback) => callback(state.currencies.some(row => row.id === value) ? undefined : 'Choose a configured currency.') }] })(<Select id="expense-currency" disabled={locked} placeholder="Choose currency">{state.currencies.map(row => <Select.Option key={row.id} value={row.id}>{row.code || row.name}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label={commitment ? 'Starts on' : 'Entry date'} htmlFor="expense-date">{getFieldDecorator('registerDate', { initialValue: date(commitment ? record.startsOn : record.registerDate) || businessToday(), rules: [{ required: true, message: commitment ? 'Choose a start date.' : 'Choose the entry date.' }, calendarDateRule] })(<DatePicker id="expense-date" disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            {commitment && <>
              <Form.Item label="Payee name" htmlFor="expense-payee">{getFieldDecorator('payeeName', { initialValue: record.payeeName || '' })(<Input id="expense-payee" disabled={locked} />)}</Form.Item>
              <Form.Item label="Frequency" htmlFor="expense-frequency">{getFieldDecorator('frequency', { initialValue: record.frequency || 'monthly', rules: [{ required: true, message: 'Choose a frequency.' }] })(<Select id="expense-frequency" disabled={locked}>{Object.keys(commitmentFrequencies).map(key => <Select.Option key={key} value={key}>{commitmentFrequencies[key]}</Select.Option>)}</Select>)}</Form.Item>
              <Form.Item label="Every" htmlFor="expense-interval">{getFieldDecorator('intervalCount', { initialValue: record.intervalCount || 1, rules: [{ required: true, type: 'number', min: 1, max: 365, message: 'Enter an interval from 1 to 365.' }] })(<InputNumber id="expense-interval" min={1} max={365} precision={0} disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
              <Form.Item label="Due day of month" htmlFor="expense-due-day">{getFieldDecorator('dueDay', { initialValue: record.dueDay || undefined, rules: [{ type: 'number', min: 1, max: 31, message: 'Enter a day from 1 to 31.' }] })(<InputNumber id="expense-due-day" min={1} max={31} precision={0} disabled={locked} style={{ width: '100%' }} placeholder="Use start day" />)}</Form.Item>
              <Form.Item label="Ends on (optional)" htmlFor="expense-ends-on">{getFieldDecorator('endsOn', { initialValue: date(record.endsOn), rules: [{ validator: (_, value, callback) => callback(value == null || moment.isMoment(value) && value.isValid() ? undefined : 'Choose a valid end date.') }] })(<DatePicker id="expense-ends-on" disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
              <Form.Item label="Draft lead time (days)" htmlFor="expense-draft-lead">{getFieldDecorator('draftLeadDays', { initialValue: Number(record.draftLeadDays) || 0, rules: [{ type: 'number', min: 0, max: 365, message: 'Enter a lead time from 0 to 365 days.' }] })(<InputNumber id="expense-draft-lead" min={0} max={365} precision={0} disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
              <Form.Item label="Automatic draft setting" extra="The scheduler worker is not connected yet; this saves the preference only.">{getFieldDecorator('autoGenerate', { valuePropName: 'checked', initialValue: Boolean(record.autoGenerate) })(<Checkbox disabled={locked}>Mark eligible for automatic bill drafts</Checkbox>)}</Form.Item>
              <Form.Item label="Commitment status">{getFieldDecorator('status', { initialValue: record.status || 'active' })(<Select disabled={locked}><Select.Option value="active">Active</Select.Option><Select.Option value="paused">Paused</Select.Option><Select.Option value="ended">Ended</Select.Option></Select>)}</Form.Item>
            </>}
            {recurring && !commitment && <>
              <Form.Item label="Frequency" htmlFor="expense-frequency">{getFieldDecorator('recurringType', { initialValue: record.recurringType == null ? 3 : Number(record.recurringType), rules: [{ required: true, message: 'Choose a frequency.' }] })(<Select id="expense-frequency" disabled={locked}>{Object.keys(frequencies).map(key => <Select.Option key={key} value={Number(key)}>{frequencies[key]}</Select.Option>)}</Select>)}</Form.Item>
              <Form.Item label="Recurrence date" htmlFor="expense-recurrence" extra="This date does not confirm a scheduled or unpaid obligation.">{getFieldDecorator('recurringDate', { initialValue: date(record.recurringDate), rules: [{ required: true, message: 'Choose a recurrence date.' }, calendarDateRule] })(<DatePicker id="expense-recurrence" disabled={locked} style={{ width: '100%' }} />)}</Form.Item>
            </>}
          </div>
          {!commitment && <Form.Item label="Invoice or supporting document" extra="PDF, JPG, PNG, GIF or WebP, up to 10 MB. Review this expense association before saving. Uploading never records a payment.">
            <Upload.Dragger accept=".pdf,.jpg,.jpeg,.png,.gif,.webp" multiple={false} showUploadList={false} beforeUpload={file => { this.upload(file); return false; }} disabled={locked}>
              <p>Drop a document here or click to choose</p>
              {state.attachment && <p>Document uploaded and ready to link</p>}
            </Upload.Dragger>
            {state.uploading && <Progress percent={state.progress} />}
          </Form.Item>}
          <button type="submit" className="expense-hidden-submit" tabIndex={-1} aria-hidden="true" />
        </Form>}
      </div>
    </Modal>;
  }
}

export default Form.create({ name: 'finance-expense' })(ExpenseForm);
