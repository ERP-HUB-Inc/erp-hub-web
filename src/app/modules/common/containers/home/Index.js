import React from "react";
import Component from "../../components/Component";

class Home extends Component {
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
                  <this.Switchs />
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
              totalText="Total's sale"
              to="read"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total's sale"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total's sale"
            />
          </this.Col>
          <this.Col md="3">
            <this.Cards
              price="0.00"
              icon="angellist"
              totalText="Total's sale"
            />
          </this.Col>
        </this.Row>
      </div> 
    );
  }
}

export default Home;