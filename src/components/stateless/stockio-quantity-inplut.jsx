import React from 'react';
import { InputNumber } from 'antd';
import 'antd/dist/antd.css';

export const QuantityInput = React.memo(({ value, onChange }) => (
  <InputNumber
    style={{ width: '100%' }}
    placeholder="0.00"
    value={value}
    onChange={onChange}
    formatter={val => (val ? `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
    parser={val => val.replace(/\$\s?|(,*)/g, '')}
    step={1}
    size="large"
    precision={2}
  />
));