import React from "react";
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

  render(){
    const {form, cardDashboard} = this.props;
    const readmore = ["transactions/salehistory?salehistory=1","#","#","customer"];
    const icon = ["icon-dollar","icon-list","icon-stock","icon-customer"];

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
                  {
                    <this.Switchs name="switch" checked={1} onChange={this.toggleDashboard} form={form} />
                  }
                </li>
              </ul>
            </div>
          </this.Col>
        </this.Row>
        <this.Row>
          {
            cardDashboard.list.map((value,index) =>
              <Board key={ index } total={ index > 0 ? value.value : this.formatCurrency(value.value) } icon={ icon[index] } title={value.title} readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>} route="read" to={readmore[index] }/>
            )
          }
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