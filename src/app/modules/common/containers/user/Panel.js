import React from "react";
import Component from "../../components/Component";

class ListCollapse extends Component {
  render(){
    return(
      <div className="main-collapse">
        <this.Collapse accordion>
          <this.Panel 
            key="1"
            header={
              <div>
                <div className="collapse-title">
                    MYDBSH Cotton V-neck t shirt
                </div>
                <this.Row className="collapse-header">
                  <this.Col xs="4" md="6">
                    <div className="specification">
                        SKU: 32572725521 Categories: FOR MEN, T-Shirts For Men, Tops & Shirts
                    </div>
                  </this.Col>
                  <this.Col xs="4" md="3">
                    <div className="collapse-price">
                        4
                    </div>
                  </this.Col>
                  <this.Col xs="4" md="3">
                    <div className="collapse-price">
                        $11.32
                    </div>
                  </this.Col>
                </this.Row>
              </div>
            }
          >
            <div>
              <this.Row>
                <div className="list-collapse-input">
                  <this.Col xs="2" md="2">
                    <this.Field 
                      name="qty" 
                      component={ this.Antinput }
                      label="Quantity"
                    />
                  </this.Col>
                </div>
              </this.Row>
            </div> 
          </this.Panel>
          <this.Panel 
            key="2"
            header={
              <div>
                <div className="collapse-title">
                    MYDBSH Cotton V-neck t shirt
                </div>
                <this.Row className="collapse-header">
                  <this.Col xs="4" md="6">
                    <div className="specification">
                        SKU: 32572725521 Categories: FOR MEN, T-Shirts For Men, Tops & Shirts
                    </div>
                  </this.Col>
                  <this.Col xs="4" md="3">
                    <div className="collapse-price">
                        4
                    </div>
                  </this.Col>
                  <this.Col xs="4" md="3">
                    <div className="collapse-price">
                        $11.32
                    </div>
                  </this.Col>
                </this.Row>
              </div>
            }
          >
            Quantity 
          </this.Panel>
        </this.Collapse> 
      </div>
    );
  }
}

export default ListCollapse;