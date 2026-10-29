import React from 'react';
import { Alert, Form, Input, Modal, Select } from 'antd';

export class LocationForm extends React.Component {
  handleSubmit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      const data = {
        name: values.name.trim(),
        code: values.code.trim(),
        address: values.address.trim(),
        isDefault: values.isDefault,
        isSystem: 0
      };
      if (this.props.record.id) data.status = values.status;
      this.props.onSave(data);
    });
  };

  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const editing = Boolean(record.id);

    return <Modal title={editing ? 'Edit Warehouse / Location' : 'New Warehouse / Location'} visible width={620}
      okText={editing ? 'Save Changes' : 'Create Location'} confirmLoading={busy}
      onOk={this.handleSubmit} onCancel={onCancel} maskClosable={false} closable={!busy}
      cancelButtonProps={{ disabled: busy }} destroyOnClose>
      {error && <Alert type="error" showIcon role="alert" message={error} />}
      <Form layout="vertical" onSubmit={this.handleSubmit} className="location-setting-form">
        <fieldset disabled={busy}>
          <Form.Item label="Location name" htmlFor="location-name">{getFieldDecorator('name', {
            initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter a location name.' }, { max: 100, message: 'Location name must be 100 characters or fewer.' }]
          })(<Input id="location-name" maxLength={100} autoFocus />)}</Form.Item>
          <div className="location-setting-form-grid">
            <Form.Item label="Code" extra="Up to 10 characters." htmlFor="location-code">{getFieldDecorator('code', {
              initialValue: record.code || '', rules: [{ required: true, whitespace: true, message: 'Enter a location code.' }, { max: 10, message: 'Location code must be 10 characters or fewer.' }]
            })(<Input id="location-code" maxLength={10} />)}</Form.Item>
            <Form.Item label="Default location" htmlFor="location-default">{getFieldDecorator('isDefault', {
              initialValue: Number(record.isDefault) === 1 ? 1 : 0
            })(<Select id="location-default"><Select.Option value={1}>Yes</Select.Option><Select.Option value={0}>No</Select.Option></Select>)}</Form.Item>
          </div>
          <Form.Item label="Address" htmlFor="location-address">{getFieldDecorator('address', {
            initialValue: record.address || '', rules: [{ max: 255, message: 'Address must be 255 characters or fewer.' }]
          })(<Input.TextArea id="location-address" rows={3} maxLength={255} />)}</Form.Item>
          {editing && <Form.Item label="Status" htmlFor="location-status">{getFieldDecorator('status', {
            initialValue: Number(record.status) === 0 ? 0 : 1
          })(<Select id="location-status"><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>)}</Form.Item>}
          <button type="submit" tabIndex={-1} aria-hidden="true" className="location-setting-submit" />
        </fieldset>
      </Form>
    </Modal>;
  }
}

export default Form.create({ name: 'location-setting-form', fieldNameProp: null })(LocationForm);
