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

  render() {

    let pieDataSource = {
      columns: [],
      type: "donut",
      colors: {}
    };

    if (Array.isArray(this.props.saleReport.list) && this.props.saleReport.list.length > 0) {
      const saleReport = this.props.saleReport.list[0];
      pieDataSource["columns"].push([this.CATranslate("text_revenue", this.props.locale), saleReport.revenue]);
      pieDataSource["columns"].push([this.CATranslate("text_cost", this.props.locale), saleReport.cost]);
      pieDataSource["columns"].push([this.CATranslate("text_gross_profit", this.props.locale), saleReport.profit]);
      pieDataSource["colors"]["Revenue"] = "#1e88e5";
      pieDataSource["colors"]["Cost"] = "#26c6da";
      pieDataSource["colors"]["Profit"] = "rgb(116, 90, 242)";
    }

    return(
      <this.Row style={{alignContent: "flex-start"}}>
        <this.Col md="12">
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
          icon="icon-dollar" title={<this.Translate id="text_today_is_sale"/>}
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
          icon="icon-list" title={<this.Translate id="text_today_is_transaction"/>}
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
        icon="icon-stock" title={<this.Translate id="text_today_is_product_sold"/>}
        readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
        route="read"
        to="#" />

        <Board
          contentValue={
            <CountUp
              start={0}
              end={this.getValueFromDashboardList(3)}
              duration={2}
              separator="" />
          }
          icon="icon-customer"
          title={<this.Translate id="text_total_customer"/>}
          readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
          route="read"
          to="customer" />
        <this.Col md="8">
          <Diagram/>
        </this.Col>
        <this.Col md="4">
          <div className="dash-wrap-report">
            <div className="dashboard-report-title">
              <this.Translate id="text_today_sale_summary" />
            </div>
            <this.C3Chart
              data={pieDataSource}
              legend={{
                position: "bottom"
              }}
              title={this.CATranslate("text_summary_report", this.props.locale)}
              size={{
                height: 345
              }}
              tooltip={{
                format: {
                  value: value => {
                    return this.formatCurrency(value);
                  }
                }
              }}/>
          </div>
        </this.Col>
        <this.Col md="12">
          <div className="text-center dash-wrap-guide">
            <div className="dashboard-report-title text-left">
              <this.Translate id="text_user_guides" />
            </div>
            <Guide/>
          </div>
        </this.Col>
      </this.Row>
    );
  }
}