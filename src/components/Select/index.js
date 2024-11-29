import React from "react";
import PropTypes from "prop-types";
import { Form, Select as AntdSelect, Tooltip, Icon } from "antd"
import "./index.css";

const { Option } = AntdSelect;

export class Select extends React.Component {
  getName = (value) => {
    if (this.props.nestedName &&
      this.props.nestedName in value &&
      value[this.props.nestedName]) {
      if (Array.isArray(value[this.props.nestedName]) && value[this.props.nestedName].length > 0) {
        value[this.props.nestedName] = value[this.props.nestedName][0];
      }
      return value[this.props.nestedName][this.props.nameKey];
    }
    
    if (this.props.concatNameKey) {
      return `${value[this.props.nameKey]} ${value[this.props.concatNameKey]}`;
    } else {
      return value[this.props.nameKey];
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    let dataSource = this.props.dataSource;
    if (!Array.isArray(dataSource)) {
      dataSource = [];
    }

    const options = {
      rules: [
        {
          required: this.props.required,
          message: this.props.errorRequired}
      ]
    };

    if (this.props.defaultValue !== null && this.props.defaultValue !== "") {
      options["initialValue"] = this.props.defaultValue;
    } else if (!this.props.placeholder) {
      options["initialValue"] = this.props.defaultValue;
    }

    return (
      <Form.Item
        label={<React.Fragment>
          {this.props.label}
          {
            this.props.tooltip && 
            <Tooltip placement="right" title={this.props.tooltip}>
              <Icon type="question-circle" style={{ marginLeft: 8, color: "#888" }} />
            </Tooltip>
          }
          </React.Fragment>
        }
        tooltip={this.props.tooltip}
        labelAlign="left"
        help={this.props.help}
        className={this.props.className}
        style={this.props.style}
        validateStatus={this.props.validateStatus}>
        {
          getFieldDecorator(this.props.name, options)(
            <AntdSelect
              showSearch={this.props.showSearch}
              allowClear={this.props.allowClear}
              placeholder={this.props.placeholder}
              filterOption={this.props.filterOption}
              optionFilterProp={this.props.optionFilterProp}
              onChange={this.props.onChange}
              mode={this.props.mode}
              onFocus={this.props.handleOnFocus}
              disabled={this.props.disabled}
              style={{ width: "100%" }}>
              {
                dataSource.map((value, index) =>
                  <Option key={index} value={value[this.props.valueKey]}>
                    {this.getName(value)}
                  </Option>
                )
              }
            </AntdSelect>
          )
        }
      </Form.Item>
    );
  }   
}

Select.defaultProps = {
  label: PropTypes.string.isRequired,
  required: false,
  errorRequired: "Please select",
  valueKey: "value",
  nameKey: "name",
  nestedName: null, 
  concatNameKey: null
};
