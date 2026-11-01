import React from 'react';
import { Alert, Form, InputNumber, Modal, Select } from 'antd';
import { MONTHS, TARGET_TYPES, targetPayload } from './model';

export class SalesTargetForm extends React.Component {
  submit = event => {
    if (event) event.preventDefault();
    if (this.props.busy || !this.props.locations.length) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) this.props.onSave(targetPayload(values));
    });
  };

  render() {
    const { record, locations, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const now = new Date();
    const type = form.getFieldValue('targetType') || record.targetType || 'MONTHLY';
    return <Modal visible title={record.id != null ? 'Edit Sales Target' : 'New Sales Target'} width={680}
      okText={record.id != null ? 'Save Changes' : 'Create Sales Target'} onOk={this.submit} onCancel={onCancel}
      confirmLoading={busy} maskClosable={false} closable={!busy} keyboard={!busy}
      cancelButtonProps={{ disabled: busy }} okButtonProps={{ disabled: busy || !locations.length }} destroyOnClose>
      <div className="expense-form sales-target-form">
        {error && <Alert type="error" showIcon role="alert" message={error} />}
        <Form layout="vertical" onSubmit={this.submit}>
          <Form.Item label="Branch" htmlFor="target-location">{getFieldDecorator('locationId', {
            initialValue: record.locationId != null ? String(record.locationId) : locations.length === 1 ? String(locations[0].id) : undefined,
            rules: [{ required: true, message: 'Choose a branch.' }, { validator: (_, value, callback) => callback(locations.some(row => String(row.id) === value) ? undefined : 'Choose an available branch.') }]
          })(<Select id="target-location" disabled={busy} placeholder="Choose branch" showSearch optionFilterProp="children">{locations.map(row => <Select.Option key={row.id} value={String(row.id)}>{row.name || row.id}</Select.Option>)}</Select>)}</Form.Item>
          <div className="expense-form-grid">
            <Form.Item label="Target period" htmlFor="target-type">{getFieldDecorator('targetType', {
              initialValue: record.targetType || 'MONTHLY', rules: [{ required: true, enum: Object.keys(TARGET_TYPES), type: 'enum', message: 'Choose a target period.' }]
            })(<Select id="target-type" disabled={busy}>{Object.keys(TARGET_TYPES).map(key => <Select.Option key={key} value={key}>{TARGET_TYPES[key]}</Select.Option>)}</Select>)}</Form.Item>
            <Form.Item label="Year" htmlFor="target-year">{getFieldDecorator('year', {
              initialValue: record.year == null ? now.getFullYear() : Number(record.year),
              rules: [{ required: true, type: 'integer', min: 1, max: 9999, message: 'Enter a whole year from 1 to 9999.' }]
            })(<InputNumber id="target-year" min={1} max={9999} disabled={busy} />)}</Form.Item>
            {type === 'MONTHLY' && <Form.Item label="Month" htmlFor="target-month" extra="The quarter is calculated from the selected month.">{getFieldDecorator('month', {
              initialValue: record.month == null ? now.getMonth() + 1 : Number(record.month), rules: [{ required: true, type: 'integer', min: 1, max: 12, message: 'Choose a month.' }]
            })(<Select id="target-month" disabled={busy}>{MONTHS.map((name, index) => <Select.Option key={index + 1} value={index + 1}>{name}</Select.Option>)}</Select>)}</Form.Item>}
            {type === 'QUARTERLY' && <Form.Item label="Quarter" htmlFor="target-quarter">{getFieldDecorator('quarter', {
              initialValue: record.quarter == null ? undefined : Number(record.quarter), rules: [{ required: true, type: 'integer', min: 1, max: 4, message: 'Choose a quarter.' }]
            })(<Select id="target-quarter" placeholder="Choose quarter" disabled={busy}>{[1, 2, 3, 4].map(value => <Select.Option key={value} value={value}>Q{value}</Select.Option>)}</Select>)}</Form.Item>}
            <Form.Item label="Target revenue" htmlFor="target-revenue">{getFieldDecorator('targetRevenue', {
              initialValue: record.targetRevenue == null ? undefined : Number(record.targetRevenue),
              rules: [{ validator: (_, value, callback) => callback(typeof value === 'number' && Number.isFinite(value) && value >= 0 ? undefined : 'Enter a finite revenue amount of zero or more.') }]
            })(<InputNumber id="target-revenue" disabled={busy} min={0} placeholder="e.g. 15000" />)}</Form.Item>
            <Form.Item label="Status" htmlFor="target-status">{getFieldDecorator('status', {
              initialValue: record.status || 'ACTIVE', rules: [{ required: true, type: 'enum', enum: ['ACTIVE', 'INACTIVE'], message: 'Choose a status.' }]
            })(<Select id="target-status" disabled={busy}><Select.Option value="ACTIVE">Active</Select.Option><Select.Option value="INACTIVE">Inactive</Select.Option></Select>)}</Form.Item>
          </div>
          <button type="submit" hidden disabled={busy}>Save sales target</button>
        </Form>
      </div>
    </Modal>;
  }
}

export default Form.create({ name: 'sales-target', fieldNameProp: null })(SalesTargetForm);
