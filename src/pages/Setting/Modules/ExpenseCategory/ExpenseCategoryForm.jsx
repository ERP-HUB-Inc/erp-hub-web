import React from 'react';
import { Alert, Form, Input, Modal } from 'antd';

export class ExpenseCategoryForm extends React.Component {
  submit = event => {
    if (event) event.preventDefault();
    if (this.props.busy) return;
    this.props.form.validateFieldsAndScroll((error, values) => {
      if (!error) this.props.onSave({ name: values.name.trim(), namekh: values.namekh.trim() });
    });
  };

  render() {
    const { record, busy, error, onCancel, form } = this.props;
    const { getFieldDecorator } = form;
    return <Modal visible title={record.id ? 'Edit Expense Category' : 'New Expense Category'} width={680}
      okText={record.id ? 'Save Changes' : 'Create Expense Category'} onOk={this.submit} onCancel={onCancel}
      confirmLoading={busy} closable={!busy} maskClosable={false} keyboard={!busy}
      cancelButtonProps={{ disabled: busy }} okButtonProps={{ disabled: busy }} destroyOnClose>
      <div className="expense-form">
        {error && <Alert type="error" showIcon role="alert" message={error} />}
        <Form layout="vertical" onSubmit={this.submit}>
          <Form.Item label="Name" htmlFor="expense-category-name">{getFieldDecorator('name', {
            initialValue: record.name || '',
            rules: [{ required: true, whitespace: true, message: 'Enter an expense category name.' }, { max: 255, message: 'Use 255 characters or fewer.' }]
          })(<Input id="expense-category-name" placeholder="e.g. Admin Fee" disabled={busy} autoFocus />)}</Form.Item>
          <Form.Item label="Khmer name (optional)" htmlFor="expense-category-namekh">{getFieldDecorator('namekh', {
            initialValue: record.namekh || '', rules: [{ max: 255, message: 'Use 255 characters or fewer.' }]
          })(<Input id="expense-category-namekh" placeholder="ឧ. ថ្លៃរដ្ឋបាល" disabled={busy} />)}</Form.Item>
          <button type="submit" hidden disabled={busy}>Save expense category</button>
        </Form>
      </div>
    </Modal>;
  }
}

export default Form.create({ name: 'expense-category', fieldNameProp: null })(ExpenseCategoryForm);
