import React from "react";
import CountUp from "react-countup";
import Component from "../Component";
import Diagram from "../home/containers/diagram";
import Guide from "../home/containers/guide";
import Board from "../home/containers/Board";
import CardAction from "../../../common/actions/home";
import "./index.css";

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.isShowDiagram = null;
    // this.toggleDashboard = this.toggleDashboard.bind(this);
    this.hasDidUpdate = false;
  }	

  // toggleDashboard(checked) {
  //   this.isShowDiagram  =  checked === 0;
  //   localStorage.setItem("defaultDashboardSetting", JSON.stringify(checked));
  // }

  // componentWillUpdate() {
  //   if(!this.hasDidUpdate){
  //     let getDefaultSetting = localStorage.getItem("defaultDashboardSetting");
  //     if(parseInt(getDefaultSetting, 10) === 1) {
  //       this.isShowDiagram  = true;
  //     } else {
  //       this.isShowDiagram  = false;
  //     }
  //   }
  // }


  componentDidMount(){
    this.props.dispatch(CardAction.fetchDashboardCard());    
  }

  getValueFromDashboardList(index = 0) {
    return this.props.cardDashboard.list.length > 0 ? this.props.cardDashboard.list[index].value : 0;
  }

  getYesterdayValue(index = 0) {
    return this.props.cardDashboard.list.length > 0 ? this.props.cardDashboard.list[index].yesterdayValue : 0;
  }

  getDiffAsPercentagFromYesterday(todayValue, yesterdayValue) {
    if (!todayValue) todayValue = 0;
    if (!yesterdayValue) yesterdayValue = 0;
    todayValue = this.formatNumber(todayValue)
    yesterdayValue = this.formatNumber(yesterdayValue);

    if (todayValue === 0 && yesterdayValue === 0) {
      return 0;
    }
    if (yesterdayValue === 0 && todayValue) {
      return 100;
    }
    return this.formatNumber(((todayValue * 100) / yesterdayValue) - 100);
  }

  formatNumber(value) {
    return parseFloat((value * 1).toFixed(2));
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

    const revenue = this.getValueFromDashboardList(),
      yesterdayRevenue = this.getYesterdayValue(),
      discount = this.getValueFromDashboardList(1),
      yesterdayDiscount = this.getYesterdayValue(1);
          
    return(
      <this.Row style={{alignContent: "flex-start"}}>
        <this.Col md="12">
          <div className="dashboard ">
            <ul>
              <li>
                <this.BreadcrumbTitle title= {this.CATranslate("home_page_dashboard", this.props.locale)} />
              </li>
              {/* <li style={{marginLeft: "15px"}}>
                {<this.Switchs name="switch" checked={1} onChange={this.toggleDashboard} form={this.props.form} />}
              </li> */}
            </ul>
          </div>
        </this.Col>
        <Board
          contentValue={
            <CountUp
              start={0}
              end={revenue}
              duration={2}
              separator=","
              decimals={2}
              decimal="." />
          }
          percentage={this.getDiffAsPercentagFromYesterday(revenue, yesterdayRevenue)}
          showPercentage={true}
          icon="icon-dollar" title={<this.Translate id="text_today_revenue"/>}
          readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
          to="reports/sale_summaries" />

        <Board
          contentValue={
            <CountUp
              start={0}
              end={discount}
              duration={2}
              separator=","
              decimals={2}
              decimal="." />
          }
          icon="icon-sale-return" title={<this.Translate id="text_today_discount"/>}
          readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
          route="read"
          color="#cf1322"
          to="reports/sale_summaries" />

        <Board contentValue={
          <CountUp
            start={0}
            end={revenue - discount}
            duration={2}
            separator=","
            decimals={2}
            decimal="." />
        }
        icon="icon-dollar" title={<this.Translate id="text_today_sale" />}
        percentage={this.getDiffAsPercentagFromYesterday((revenue - discount), (yesterdayRevenue - yesterdayDiscount))}
        showPercentage={true}
        readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>}
        route="read"
        to="reports/sold_products" />

        <Board
          contentValue={
            <CountUp
              start={0}
              end={this.getValueFromDashboardList(3)}
              duration={2}
              separator=","
              decimals={0}
              decimal="." />
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
            {
              // this.props.saleReport.fetched ?
              //   <this.C3Chart
              //     data={pieDataSource}
              //     legend={{
              //       position: "bottom"
              //     }}
              //     title={this.CATranslate("text_summary_report", this.props.locale)}
              //     size={{
              //       height: 345
              //     }}
              //     tooltip={{
              //       format: {
              //         value: value => {
              //           return this.formatCurrency(value);
              //         }
              //       }
              //     }}/>
              //   :
              //   <this.C3Chart
              //     data={pieDataSource}
              //     legend={{
              //       position: "bottom"
              //     }}
              //     title={this.CATranslate("text_summary_report", this.props.locale)}
              //     size={{
              //       height: 345
              //     }}
              //     tooltip={{
              //       format: {
              //         value: value => {
              //           return this.formatCurrency(value);
              //         }
              //       }
              //     }}/>
            }
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