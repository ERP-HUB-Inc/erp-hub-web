import React from "react";
import Component from "../Component";
import Diagram from "../home/containers/diagram";
import Guide from "../home/containers/guide";
import Board from "../home/containers/Board";
import "./index.css";

export default class Home extends Component {

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
    const {form} = this.props;
    return(
      <div>
        <this.Row>
          <this.Col xs="12" md="12">
            <div className="dashboard ">
              <ul>
                <li>
                  <this.BreadcrumbTitle title="Dashboad" />
                </li>
                <li style={{marginLeft: "15px"}}>
                  {/* <this.Switchs onChange={ this.toggleDashboard } /> */}
                  <this.Switchs name="switch" onChange={this.toggleDashboard} form={form} />
                </li>
              </ul>
            </div>

          </this.Col>
        </this.Row>
        <this.Row>
          <Board total="0.00" icon="icon-dollar" title="Today's Sale" route="read"/>
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