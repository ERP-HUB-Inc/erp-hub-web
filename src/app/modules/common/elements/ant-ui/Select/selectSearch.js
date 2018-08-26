import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class SelectSearch extends Element {
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <this.FormItem
        label={this.props.label}
        help={this.props.help}>
        {
          getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.defaultValue})(
            <this.Select
              placeholder={this.props.placeholder}
              onChange={this.props.onChange}
              onSelect={this.props.onSelect}
              disabled={this.props.disabled}
              notFoundContent={this.props.notFoundContent}
              style={{ width: "100%" }}
              optionFilterProp="children"
              dropdownClassName="wrap-select-search"
              filterOption={(value, option) => option.props.children.toString().toLowerCase().indexOf(value.toLowerCase()) >= 0}
              showSearch>
              { 
                this.props.addNew !=null ?
                  <this.Option
                    key={1}
                    value={1}
                    className="add-new-item"
                    onClick={this.props.addNew}>
                    <span className="icon-add"></span> {this.props.textAddNew}
                  </this.Option>
                  : "" 
              }  
              {
                this.props.dataSource.map((value, index) =>
                  <this.Option key={index} value={value[this.props.valueKey]}>{value[this.props.nameKey]}</this.Option>
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
  notFoundContent: "No item found",
  textAddNew: "Add New",
  valueKey: "value",
  nameKey: "name"
};
