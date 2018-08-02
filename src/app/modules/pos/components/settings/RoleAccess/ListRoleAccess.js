import React from "react";
import Component  from "../../../components/Component";
import "./index.css";

const text = `
  ddd
`;

const plainOptions = ["Apple", "Pear", "Orange"];
const defaultCheckedList = ["Apple", "Orange"];

class ListRoleAccess extends Component {
  constructor(props){
    super(props);
    this.state = {
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
    };
    this.onChange = this.onChange.bind(this);
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
  };

  onChange (checkedList){
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < plainOptions.length),
      checkAll: checkedList.length === plainOptions.length,
    });
  };

  onCheckAllChange(e){
    this.setState({
      checkedList: e.target.checked ? plainOptions : [],
      indeterminate: false,
      checkAll: e.target.checked,
    });
  };
  
  render() {
    const { form } = this.props;
    return (
      <div className="main-role-access">
        <this.Row>
          <this.Col md="10">   
            <this.Form>
              <span className="icon-search"></span>
              <this.InputText 
                name="name" 
                placeholder="Search Access Privillege" 
                form={form} 
              />
            </this.Form>
          </this.Col>
          <this.Col md="2">
            <this.saveButton className="mg-right save-button"/>
          </this.Col> 
        </this.Row>

        <this.Row>
          <this.Col md="12">   
            <this.Collapse accordion>
              <this.Panel 
                header={
                  <this.Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    TRANSACTIONS
                  </this.Checkbox>
                } 
                key="1">
                <this.CheckboxGroup options={plainOptions} value={this.state.checkedList} onChange={this.onChange} />
              </this.Panel>

              <this.Panel 
                header={
                  <this.Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    Check all
                  </this.Checkbox>
                } 
                key="2">
                <p>{text}</p>
              </this.Panel>

              <this.Panel header="This is panel header 3" key="3">
                <p>{text}</p>
              </this.Panel>
            </this.Collapse>
          </this.Col>
        </this.Row>    
      </div>
    );
  }
}

export default ListRoleAccess;

