import React from "react";
import Component from "../../components/Component";
import Diagram from "../../components/home/Diagram";
import Guide from "../../components/home/Guide";
import Board from "../../components/home/Board";

class Home extends Component {

  constructor() {
    super();
    this.toggleDashboard = this.toggleDashboard.bind(this);
    this.state = {
      isShowDiagram: true
    };
  }	

  toggleDashboard() {
    this.setState({
      isShowDiagram: this.state.isShowDiagram ? false : true
    });
  }

  render(){

    return(
      <div>
        <this.Row>
          <this.Col md="6">
            <div class="dashboard ">
              <ul>
                <li>
                  <this.BreadcrumbTitle 
                    title="Dashboad"
                  />
                </li>
                <li>
                  <this.Switchs onChange={ this.toggleDashboard } />
                </li>
              </ul>
            </div>

          </this.Col>
        </this.Row>
        <this.Row>
          <Board total="0.00" icon="icon-userman" title="Today's Sale" route="read"/>
          <Board total="0.00" icon="icon-list" title="Today's Transaction" route="read"/>
          <Board total="0.00" icon="icon-stock" title="Today's Product Sold" route="read"/>
          <Board total="0" icon="icon-customer" title="Total Customers" route="read"/>
        </this.Row>

        <this.Row>
          <this.Col md="12">
            {
              this.state.isShowDiagram ? <Diagram/> : <Guide/>
            }
          </this.Col>
        </this.Row>
      </div> 
    );
  }
}

export default Home;