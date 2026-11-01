import React from "react";
import { Alert, Modal } from "antd";

export default function ItemDeleteConfirm({ target, deleting, error, onConfirm, onCancel }) {
  const label = target?.kind === "variant" ? "variant" : "item";
  return <Modal
    visible={Boolean(target)}
    title={`Delete ${label}?`}
    okText={`Delete ${label}`}
    cancelText="Cancel"
    okType="danger"
    confirmLoading={deleting}
    cancelButtonProps={{ disabled: deleting }}
    closable={!deleting}
    maskClosable={!deleting}
    onOk={onConfirm}
    onCancel={onCancel}
  >
    <p>{target?.name ? `Delete "${target.name}"?` : `Delete the selected ${label}s?`}</p>
    <p>{target?.kind === "variant" ? "This will archive the selected variant." : "This will archive the selected item and its variants."}</p>
    {error && <div role="alert"><Alert type="error" showIcon message={error} /></div>}
  </Modal>;
}
