import React from "react";
import Component from "../../components/Component";

class Home extends Component {

  constructor() {
    super();
    this.Switch = this.Switch.bind(this);
    this.state = {
      shown: true,
    };
  }	

  Switch(){
    this.setState({
      shown: !this.state.shown
    });
  }

  render(){

    var shown = {
      display: this.state.shown ? "block" : "none"
    };
		
    var hidden = {
      display: this.state.shown ? "none" : "block"
    };

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
                  <this.Switchs onChange={ this.Switch } />
                </li>
              </ul>
            </div>

          </this.Col>
        </this.Row>
        <this.Row>          
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total sale"
              to="read"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total sale"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total sale"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total sale"
            />
          </this.Col>
        </this.Row>

        <this.Row>
          <this.Col md="12" style={ shown }>
            Role Map 
          </this.Col>
          <this.Col md="12" style={ hidden }>
            Diagram
          </this.Col>
        </this.Row>

      </div> 
    );
  }
}

export default Home;