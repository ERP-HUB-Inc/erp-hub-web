import React from "react";
import Component from "../../Component";
import "./index.css";

export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.statusList = [
      {name: <this.Translate id="select_text_active"/>, value: this.Enum.ACTIVE},
      {name: <this.Translate id="select_text_deactive"/>, value: this.Enum.DEACTIVE},
      {name: <this.Translate id="select_text_all_status"/>, value: this.Enum.ALL_STATE}
    ];
  }

  render() {    
    const {form} = this.props;
    return(
      <this.Row className="main-search-layout">
        <this.Col md="3">
          <this.InputText
            name="key"
            label="Search"
            placeholder="Search for code, name and address"
            form={form}
          />
        </this.Col>
        <this.Col md="2">
          <this.Select
            name="status"
            label={<this.Translate id="text_status" />}
            placeholder="Please select status"
            dataSource={this.statusList}
            defaultValue={this.Enum.ALL_STATE}
            form={form}
          />
        </this.Col>
        <this.Button type="info" onClick={() => alert()}>
          <span className="icon-search icon-padding-right"></span>FILTER
        </this.Button>
      </this.Row>
    );
  }
}