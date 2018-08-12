import React from "react";
import Modal from "../../shares/Modal";

export default class FormSearch extends Modal {
  render() {    
    const { form } = this.props;
    return(
      <div className="main-search-layout">
        <this.Row>
          <this.Col md="2">
            <this.Select
              name="status"
              label={<this.Translate id="input_text_status" />}
              placeholder="Please select status"
              dataSource={this.statusDataSource}
              defaultValue={1}
              form={form}
            />
          </this.Col>
          <this.Col md="3">
            <this.InputText
              name="search"
              label="Search"
              placeholder="Search for code, name and address"
              form={ form }
            />
          </this.Col>
          <this.SearchButton />
        </this.Row>
        
      </div>
    );
  }
}