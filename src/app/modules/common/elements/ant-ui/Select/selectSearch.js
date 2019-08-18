import React from "react";
import {Translate} from "react-localize-redux";
import Element from "../../common/Element";
import "./index.css";

export class SelectSearch extends Element {
  constructor(props) {
    super(props);
    this.rules = {rules: [{ required: this.props.required, message: this.props.errorRequired }]};

    if (this.props.defaultValue) {
      this.rules["initialValue"] = this.props.defaultValue;
    }
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}>
        {
          getFieldDecorator(this.props.name, this.rules)(
            <this.Select
              placeholder={this.props.placeholder}
              disabled={this.props.disabled}
              notFoundContent={this.props.notFoundContent}
              style={{ width: "100%" }}
              optionFilterProp="children"
              dropdownClassName="wrap-select-search"
              onChange={this.props.onChange}
              filterOption={(value, option) => option.props.children.toString().toLowerCase().indexOf(value.toLowerCase()) >= 0}
              showSearch>
              { 
                this.props.addNew !=null ?
                  <this.Option
                    key={1}
                    value={1}
                    className="add-new-item"
                    onClick={this.props.addNew}>
                    <div className="not-for-selected">
                      <span className="icon-add"></span> {this.props.textAddNew}
                    </div>
                  </this.Option>
                  : "" 
              }  
              {
                this.props.dataSource && this.props.dataSource.map((value, index) =>
                  <this.Option key={index} value={value[this.props.valueKey]}>{this.getName(value)}</this.Option>
                )
              }
            </this.Select>
          )
        }
      </this.FormItem>
    );
  }  
}

SelectSearch.defaultProps = {
  required: false,
  errorRequired: "Please select this field.",
  notFoundContent: "No item found",
  textAddNew: <Translate id="text_add_new" />,
  valueKey: "value",
  nameKey: "name",
  nestedName: null
};
