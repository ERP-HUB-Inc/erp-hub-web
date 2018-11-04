import React from "react";
import Component from "../Component";
import Diagram from "../home/containers/diagram";
import Guide from "../home/containers/guide";
import Board from "../home/containers/Board";
import CountUp from "react-countup";
import CardAction from "../../../common/actions/home";
import "./index.css";

export default class Home extends Component {

  constructor() {
    super();
    this.toggleDashboard = this.toggleDashboard.bind(this);
    this.hasDidUpdate = false;
    this.state = {
      isShowDiagram: null
    };
  }	

  toggleDashboard(checked) {
    this.setState({
      isShowDiagram: checked === 0
    });
  
    localStorage.setItem("defaultDashboardSetting", JSON.stringify(checked));
  }

  componentWillUpdate() {
    if(!this.hasDidUpdate){
      this.hasDidUpdate = true;
      let getDefaultSetting = localStorage.getItem("defaultDashboardSetting");
      if(getDefaultSetting) {
        this.setState({
          isShowDiagram: getDefaultSetting === 0
        });
  
      } else {
        this.setState({
          isShowDiagram: false
        });
      }

      this.setState({
        isShowDiagram: true
      });
    }
    
  }

  componentDidMount(){
    this.props.dispatch(CardAction.fetchDashboardCard());
  }

  render(){
    const { form,cardDashboard } = this.props;

    const readmore = ["transactions/salehistory?salehistory=1","#","products/manage","#"];

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
                    <this.Switchs name="switch" checked={this.state.isShowDiagram ? 1 : 0} onChange={this.toggleDashboard} form={form} />
                  }
                </li>
              </ul>
            </div>

          </this.Col>
        </this.Row>
        <this.Row>
          {
            cardDashboard.list.map((value,index) =>
              <Board key={ index } total={<CountUp start={0} end={value.value} decimal="," />} icon="icon-dollar" title={value.title} readMoreTitle={<this.Translate id="home_page_dashboard_read_more"/>} route="read" to={readmore[index] }/>
            )
          }
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