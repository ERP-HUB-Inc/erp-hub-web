import React from "react"
import {Form, Select} from "antd"
import {Translate} from "@redux/index"
import "./index.css";

export class SelectSearch extends React.Component {
  constructor(props) {
    super(props);
    this.rules = {rules: [{ required: this.props.required, message: this.props.errorRequired }]};

    if (this.props.defaultValue) {
      this.rules["initialValue"] = this.props.defaultValue;
    }
  }

  getName = (value) => {
    if (this.props.nestedName && this.props.nestedName in value && value[this.props.nestedName]) {
      if (Array.isArray(value[this.props.nestedName]) && value[this.props.nestedName].length > 0) {
        value[this.props.nestedName] = value[this.props.nestedName][0];
      }
      return value[this.props.nestedName][this.props.nameKey];
    }
    return value[this.props.nameKey];
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <Form.Item
        label={this.props.label}
        className={this.props.className}
        help={this.props.help}>
        {
          getFieldDecorator(this.props.name, this.rules)(
            <Select
              size="large"
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              notFoundContent={this.props.notFoundContent}
              style={{ width: "100%" }}
              optionFilterProp="children"
              dropdownClassName="wrap-select-search"
              onSearch={this.props.onSearch}
              onChange={this.props.onChange}
              allowClear
              filterOption={false}
              // filterOption={(value, option) => option.props.children.toString().toLowerCase().indexOf(value.toLowerCase()) >= 0}
              showSearch>
              { 
                this.props.addNew !=null ?
                  <Select.Option
                    key={1}
                    value={1}
                    className="add-new-item"
                    onClick={this.props.addNew}>
                    <div className="not-for-selected">
                      <span className="icon-add"></span> {this.props.textAddNew}
                    </div>
                  </Select.Option>
                  : "" 
              }  
              {
                this.props.dataSource && this.props.dataSource.map((value, index) =>
                  <Select.Option key={index} value={value[this.props.valueKey]}>
                    {this.props.customOptionName ? this.props.customOptionName() : this.getName(value)}
                    </Select.Option>
                )
              }
            </Select>
          )
        }
      </Form.Item>
    );
  }  
}

SelectSearch.defaultProps = {
  required: false,
  errorRequired: "Please select",
  notFoundContent: "No item found",
  textAddNew: <Translate id="text_add_new" />,
  valueKey: "value",
  nameKey: "name",
  nestedName: null
};
