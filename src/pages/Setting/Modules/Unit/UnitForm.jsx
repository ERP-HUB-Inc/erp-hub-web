import React from 'react';
import { Alert, Form, Input, InputNumber, Modal, Select } from 'antd';

export class UnitForm extends React.Component {
  handleSubmit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      this.props.onSave({
        name: values.name.trim(),
        multiple: values.multiple,
        label: values.label.trim(),
        isDefault: values.isDefault,
        status: values.status
      });
    });
  };

  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const editing = Boolean(record.id);

    return <Modal title={editing ? 'Edit Unit of Measurement' : 'New Unit of Measurement'} visible width={600}
      okText={editing ? 'Save Changes' : 'Create Unit'} confirmLoading={busy}
      onOk={this.handleSubmit} onCancel={onCancel} maskClosable={false} closable={!busy}
      cancelButtonProps={{ disabled: busy }} destroyOnClose>
      {error && <Alert type="error" showIcon role="alert" message={error} />}
      <Form layout="vertical" onSubmit={this.handleSubmit} className="unit-setting-form">
        <fieldset disabled={busy}>
          <Form.Item label="Unit name" htmlFor="unit-name">{getFieldDecorator('name', {
            initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter a unit name.' }, { max: 100, message: 'Unit name must be 100 characters or fewer.' }]
          })(<Input id="unit-name" maxLength={100} autoFocus />)}</Form.Item>
          <div className="unit-setting-form-grid">
            <Form.Item label="Number in unit" htmlFor="unit-multiple">{getFieldDecorator('multiple', {
              initialValue: record.multiple == null ? 1 : Number(record.multiple),
              rules: [{ required: true, type: 'number', min: 1, message: 'Enter a whole number greater than zero.' }]
            })(<InputNumber id="unit-multiple" min={1} precision={0} style={{ width: '100%' }} />)}</Form.Item>
            <Form.Item label="Quantity label" extra="For example: pieces, cans, or bottles." htmlFor="unit-label">{getFieldDecorator('label', {
              initialValue: record.label || '', rules: [{ required: true, whitespace: true, message: 'Enter the quantity label.' }, { max: 50, message: 'Quantity label must be 50 characters or fewer.' }]
            })(<Input id="unit-label" maxLength={50} placeholder="e.g. pieces" />)}</Form.Item>
            <Form.Item label="Default unit" htmlFor="unit-default">{getFieldDecorator('isDefault', {
              initialValue: Number(record.isDefault) === 1 ? 1 : 0
            })(<Select id="unit-default"><Select.Option value={1}>Yes</Select.Option><Select.Option value={0}>No</Select.Option></Select>)}</Form.Item>
            <Form.Item label="Status" htmlFor="unit-status">{getFieldDecorator('status', {
              initialValue: record.status === 0 ? 0 : 1
            })(<Select id="unit-status"><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>)}</Form.Item>
          </div>
          <button type="submit" tabIndex={-1} aria-hidden="true" className="unit-setting-submit" />
        </fieldset>
      </Form>
    </Modal>;
  }
}

export default Form.create({ name: 'unit-setting-form' })(UnitForm);
