import React from 'react';
import { Alert, Form, Input, Modal, Select } from 'antd';

export class ItemOptionForm extends React.Component {
  handleSubmit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (error) return;
      this.props.onSave({
        name: values.name.trim(),
        description: (values.description || '').trim(),
        status: values.status
      });
    });
  };

  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    const editing = Boolean(record.id);

    return <Modal title={editing ? 'Edit Item Option' : 'New Item Option'} visible width={600}
      okText={editing ? 'Save Changes' : 'Create Item Option'} confirmLoading={busy}
      onOk={this.handleSubmit} onCancel={onCancel} maskClosable={false} closable={!busy}
      cancelButtonProps={{ disabled: busy }} destroyOnClose>
      {error && <Alert type="error" showIcon role="alert" message={error} />}
      <Form layout="vertical" onSubmit={this.handleSubmit} className="item-option-form">
        <fieldset disabled={busy}>
          <Form.Item label="Name" htmlFor="item-option-name">{getFieldDecorator('name', {
            initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter an option name.' }, { max: 100, message: 'Option name must be 100 characters or fewer.' }]
          })(<Input id="item-option-name" maxLength={100} autoFocus />)}</Form.Item>
          <Form.Item label="Description" htmlFor="item-option-description">{getFieldDecorator('description', {
            initialValue: record.description || '', rules: [{ max: 255, message: 'Description must be 255 characters or fewer.' }]
          })(<Input.TextArea id="item-option-description" rows={3} maxLength={255} />)}</Form.Item>
          <Form.Item label="Status" htmlFor="item-option-status">{getFieldDecorator('status', {
            initialValue: record.status === 0 ? 0 : 1
          })(<Select id="item-option-status"><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>)}</Form.Item>
          <button type="submit" tabIndex={-1} aria-hidden="true" className="item-option-submit" />
        </fieldset>
      </Form>
    </Modal>;
  }
}

// Keep the explicit input IDs so each Form.Item htmlFor label targets its control.
export default Form.create({ name: 'item-option-form', fieldNameProp: null })(ItemOptionForm);
