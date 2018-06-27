import React from "react";
import { connect } from "react-redux";
import Component from "../../components/Component";
import { fetchUsers } from "../../actions/users";
import { reduxForm } from "redux-form"; 
import Manuitem from "../../components/layout/SiderBar/MenuItem";

class UserList extends Component {
  
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchUsers());
  }

  render() {
	  console.log("getitem",Manuitem);
    return (
      <div className="manitem">
        {/* <User {...this.props} /> */}
        <this.BreadcrumbLayout
          titleNow="Transactions"
        >
          {
            Manuitem.map((value,key) => {	
			    	return(
                <this.Breadcrumb
                  to={ value.link }
                  key={ value }
                  nextPage={ value.title }
                />
			  );
           
            })
          }
        </this.BreadcrumbLayout>
      
        <this.Row>
          <this.Col md="2">
            <this.Field name="favoriteColor" 
              component={ this.Selects }
              defaultValue="all"
              placeholder="Status"
            >
              <option value="all" selected>All</option>
              <option value="red">Red</option>
              <option value="redd">Reddd</option>
            </this.Field>
          </this.Col>
          <this.Col md="2">
            <this.DateRank/>
          </this.Col>
        </this.Row>

        <this.Table />
      </div>
    );
  }
}

function mapStateToProps(state) {
  // return state.reducer.user;
}

export default reduxForm({
  form: "FormSearchs"
})(UserList);

