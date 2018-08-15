import React from "react";
import Element from "../../common/Element";
import "./index.css";

export class Select extends Element {

  constructor(props) {
    super(props);
    this.rules = [
      { required: this.props.required, message: this.props.errorRequired }
    ];
  }

  render() {
    return (
      <SelectElement {...this.props} rules={this.rules} />
    );
  }   
}


class SelectElement extends Element {   
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <this.FormItem
          label={this.props.label}
          help={this.props.help}>
          {
            getFieldDecorator(this.props.name, {rules: this.props.rules, initialValue: this.props.defaultValue})(
              <this.Select
                showSearch = { this.props.showSearch }
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                disabled={this.props.disabled}
              
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0}
                style={{ width: "100%" }}
              >
                {
                  this.props.dataSource.map((value, index) =>
                    <this.Option key={index} value={value.value}>{value.name}</this.Option>
                  )
                }

                { 
                  this.props.addNew !=null ?
                    <this.Option value={1} key={ 1 }>
                      <div onClick={ this.props.addNew }>
                        <span className="icon-add"> </span> Add New
                      </div>
                    </this.Option>
                    : "" 
                }  

              </this.Select>
            )
          }
        </this.FormItem>
      </div>
    );
  }
}

SelectElement.defaultProps = {
  showSearch: false
};