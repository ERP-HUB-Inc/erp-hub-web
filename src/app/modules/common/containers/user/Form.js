import React from "react";
import Component from "../../components/Component";
import ListCollapse from "./page/Panel";
import { CTable as Table } from "./page/Table/";
import { reduxForm } from "redux-form"; 
import Manuitem from "../../components/layout/SiderBar/MenuItem";

class UserList extends Component {
  render() {
    const { handleSubmit } = this.props;
    return (
      <div className="manitem">
        <this.BreadcrumbLayout
          titleNow="Transactions"
        >
          {
            Manuitem.map((value,key) => {	
              return(
                <this.Breadcrumb
                  to={ value.link }
                  key={ key }
                  nextPage={ value.title }
                />
              );
            })
          }
        </this.BreadcrumbLayout>
        
        <this.Row>
          <this.Col md="12">   
            <div className="main-input">
              <this.Tooltips />
              <form onSubmit={ handleSubmit }>
                <this.Row>
                  <this.Col xs="12" md="3">
                    <this.Field 
                      name="email"
                      type="text"
                      component={ this.Antinput }
                      label="Email"
                      placeholder="Email"
                    />
                  </this.Col>
                  <this.Col xs="12" md="3">
                    <this.Field 
                      label="Apple" 
                      name="apple" 
                      component={ this.FieldComponent(this.Checkbox) } 
                      type="checkbox" 
                      className="main-check"
                    />
                  </this.Col>
                  <this.Col xs="12" md="3">
                    <this.Field 
                      name="favoriteColor" 
                      component={ this.Selects }
                      defaultValue="all"
                      placeholder="Status"
                      label="Select"
                    >
                      <option value="all" selected>All</option>
                      <option value="red">Red</option>
                      <option value="redd">Reddd</option>
                    </this.Field>

                  </this.Col>
                  <this.Col xs="12" md="3">
                    <this.Field
                      label="Filter dates"
                      name="rangepicker"
                      component={ this.DateRank }
                      placeholder={[""]}
                      onFocus={e => e.preventDefault()}
                      onBlur={e => e.preventDefault()}
                    />
                  </this.Col>
                  <this.Col xs="12" md="3">
                    <this.Field 
                      name="searchtwo"
                      type="text"
                      component={ this.Antinput }
                      label="Search2"
                      placeholder="Search Product"
                    />
                  </this.Col>
                  <this.Col xs="12" md="2">
                    <this.Field 
                      name="username"
                      type="number"
                      component={ this.Antinput }
                      label="Search"
                      placeholder="Search Product"
                    />
                  </this.Col>
                  <this.Col xs="12" md="2">
                    <this.ActionButton  icon="search" />
                  </this.Col>
          
                </this.Row>
              </form>
            </div>
          </this.Col>
         
          <this.Col md="12">  
            <ListCollapse/>
          </this.Col>
        </this.Row>
        <Table />
      </div>
    );
  }
}
  
export default reduxForm({
  form: "syncValidation"                     
})(UserList);
