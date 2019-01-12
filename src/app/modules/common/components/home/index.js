import React from "react";
import CountUp from "react-countup";
import Component from "../Component";
import Diagram from "../home/containers/diagram";
import Guide from "../home/containers/guide";
import Board from "../home/containers/Board";
import CardAction from "../../../common/actions/home";
import "./index.css";

export default class Home extends Component {

  constructor() {
    super();
    this.isShowDiagram = null;
    this.toggleDashboard = this.toggleDashboard.bind(this);
    this.hasDidUpdate = false;
  }	

  toggleDashboard(checked) {
    this.isShowDiagram  =  checked === 0;
    localStorage.setItem("defaultDashboardSetting", JSON.stringify(checked));
  }

  componentWillUpdate() {
    if(!this.hasDidUpdate){
      let getDefaultSetting = localStorage.getItem("defaultDashboardSetting");
      if(parseInt(getDefaultSetting, 10) === 1) {
        this.isShowDiagram  = true;
      } else {
        this.isShowDiagram  = false;
      }
    }
  }

  componentDidMount(){
    this.props.dispatch(CardAction.fetchDashboardCard());    
  }

  getValueFromDashboardList(index = 0) {
    return this.props.cardDashboard.list.length > 0 ? this.props.cardDashboard.list[index].value : 0;
  }

  render(){

    return(
      <div style={{width: "100%"}}>
        <this.Row>
          <this.Col xs="12" md="12">
            <div className="dashboard ">
              <ul>
                <li>
                  <this.BreadcrumbTitle title= {this.CATranslate("home_page_dashboard", this.props.locale)} />
                </li>
                <li style={{marginLeft: "15px"}}>
                  {<this.Switchs name="switch" checked={1} onChange={this.toggleDashboard} form={this.props.form} />}
                </li>
              </ul>
            </div>
          </this.Col>
        </this.Row>
        <this.Row>
          {/* {
            cardDashboard.list.map((value,index) =>
              <Board key={ index } total={ index > 0 ? value.value : this.formatCurrency(value.value) } icon={ icon[index] } title={value.title} readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>} route="read" to={readmore[index] }/>
            ) 
          } */}
          <Board
            contentValue={
              <CountUp
                start={0}
                end={this.getValueFromDashboardList()}
                duration={5}
                separator=","
                decimals={2}
                decimal="." />
            }
            icon="icon-dollar" title="Today's Sale"
            readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
            to="transactions/salehistory?salehistory=1" />

          <Board
            contentValue={
              <CountUp
                start={0}
                end={this.getValueFromDashboardList(1)}
                duration={5}
                separator="" />
            }
            icon="icon-list" title="Today's Transaction"
            readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
            route="read"
            to="transactions/salehistory?salehistory=1" />

          <Board contentValue={
            <CountUp
              start={0}
              end={this.getValueFromDashboardList(2)}
              duration={5}
              separator="" />
          }
          icon="icon-stock" title="Today's Product Sold"
          readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
          route="read"
          to="#" />

          <Board
            contentValue={
              <CountUp
                start={0}
                end={this.getValueFromDashboardList(3)}
                duration={5}
                separator="" />
            }
            icon="icon-customer"
            title="Total Customers"
            readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
            route="read"
            to="customer" />
        </this.Row>
        <this.Row>
          <this.Col md="12">
            {
              this.isShowDiagram ? <Diagram/> : <Guide/>
            }
          </this.Col>
        </this.Row>
      </div> 
    );
  }
}