import React from 'react';
import { Alert, Form, Input, InputNumber, Modal, Select, Switch } from 'antd';
import { isEnabled, itemTypePayload, PRODUCT_OPTIONS } from './model';

export class ItemTypeForm extends React.Component {
  handleSubmit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) this.props.onSave(itemTypePayload(values));
    });
  };

  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return <Modal title={record.id ? 'Edit Item Type' : 'New Item Type'} visible width={680}
      okText={record.id ? 'Save Changes' : 'Create Item Type'} confirmLoading={busy}
      onOk={this.handleSubmit} onCancel={onCancel} maskClosable={false} closable={!busy}
      cancelButtonProps={{ disabled: busy }} destroyOnClose>
      {error && <Alert type="error" showIcon message={error} role="alert" />}
      <Form layout="vertical" onSubmit={this.handleSubmit} className="item-type-form">
        <fieldset disabled={busy}>
          <div className="item-type-form-grid">
            <Form.Item label="Name" htmlFor="item-type-name">{getFieldDecorator('name', {
              initialValue: record.name || '', rules: [{ required: true, whitespace: true, message: 'Enter an item type name.' }]
            })(<Input id="item-type-name" autoFocus />)}</Form.Item>
            <Form.Item label="Status" htmlFor="item-type-status">{getFieldDecorator('status', { initialValue: record.status === 0 ? 0 : 1 })(
              <Select id="item-type-status" disabled={busy}><Select.Option value={1}>Active</Select.Option><Select.Option value={0}>Inactive</Select.Option></Select>
            )}</Form.Item>
            <Form.Item label="Sort order" htmlFor="item-type-sort-order">{getFieldDecorator('sortOrder', {
              initialValue: record.sortOrder == null ? 0 : record.sortOrder,
              rules: [{ required: true, type: 'integer', message: 'Enter a whole number for sort order.' }]
            })(<InputNumber id="item-type-sort-order" precision={0} disabled={busy} />)}</Form.Item>
            <Form.Item label="Product option" htmlFor="item-type-product-option">{getFieldDecorator('productOption', { initialValue: record.productOption == null ? 0 : record.productOption })(
              <Select id="item-type-product-option" disabled={busy}>{PRODUCT_OPTIONS.map(([id, label]) => <Select.Option value={id} key={id}>{label}</Select.Option>)}</Select>
            )}</Form.Item>
            <Form.Item label="Track inventory" htmlFor="item-type-track-inventory">{getFieldDecorator('enableInventoryTracking', { valuePropName: 'checked', initialValue: record.id ? isEnabled(record.enableInventoryTracking) : true })(<Switch id="item-type-track-inventory" disabled={busy} />)}</Form.Item>
            <Form.Item label="Available for sale" htmlFor="item-type-sellable">{getFieldDecorator('isSellable', { valuePropName: 'checked', initialValue: record.id ? isEnabled(record.isSellable) : true })(<Switch id="item-type-sellable" disabled={busy} />)}</Form.Item>
          </div>
          <Form.Item label="Description" htmlFor="item-type-description">{getFieldDecorator('description', { initialValue: record.description || '' })(<Input.TextArea id="item-type-description" rows={3} />)}</Form.Item>
          <button type="submit" className="item-type-submit" disabled={busy} tabIndex={-1} aria-hidden="true" />
        </fieldset>
      </Form>
    </Modal>;
  }
}

// Preserve the explicit control IDs so Form.Item labels target their inputs.
export default Form.create({ name: 'item-type', fieldNameProp: null })(ItemTypeForm);
