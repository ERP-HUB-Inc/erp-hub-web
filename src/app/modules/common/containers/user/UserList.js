import React from "react";
import { connect } from "react-redux";
import Component from "../../components/Component";
import { fetchUsers } from "../../actions/users";
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
		
        <this.BreadcrumbLayout>
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

      </div>
    );
  }
}

function mapStateToProps(state) {
  return state.reducer.user;
}


export default connect(mapStateToProps)(UserList);

