import React from "react";
import Component from "../../Component";
export default class ConfirmRegister extends Component {
  render() {
    return (
      <div style={{ width: "100%", display: "none" }} id="confirm-register-client">
        <table style={{ margin: "0 auto", padding: "0", fontSize: "9.5pt", fontFamily: "Arial", backgroundColor: "white", width: "650px"}}>
          <tbody>
            <tr>
              <td style={{fontSize: 58, backgroundColor: "white"}}>
                <span className="icon-logo" style={{ color: "#093163", marginLeft: "40px" }}></span>
              </td>
            </tr>
            <tr>
              <td style={{ borderBottom: "3px solid rgba(0, 0, 0, 0.65)", textAlign: "center" }}>
                <img src={this.Util.getGeneralImage("storeVein/confirm-register.png").url} style={{width: 400 }} alt="confirm-register" />
              </td>
            </tr>
            <tr style={{ color: "rgb(104, 104, 104)" }}>
              <div style={{ padding: "49px", backgroundColor: "white", paddingTop: "20px" }}>
                <div style={{ fontWeight: "bold", textAlign: "left", color: "#686868" }}>
                  <h3 style={{ lineHeight:"58px", fontSize: "25px", fontWeight: "bold" }}>Hi {this.props.data.data.firstName} {this.props.data.data.lastName},</h3>
                </div> 
                <div style={{ fontSize:"15px",lineHeight: "13px" }}>
                  <div style={{ marginBottom: "28px" }}>
                    <p style={{ paddingBottom: "13px" }}>Welcome to storeVein — we’re glad to have you on board! </p>
                    <p>Here’s your login info so you can explore how storeVein has helped you</p> 
                    <p>retailers just like you save time, boost profitability, and better run their businesses:</p> 
                  </div>
                  <div style={{ lineHeight: "11px" }}>      
                    <p>
                      <strong>Username: <a href="http://storevein.com">sopha088@gmail.com</a></strong> 
                    </p>
                    <p>
                      <strong>Sign-in page: <a href={`http://${this.props.data.data.storeName}storevein.com`}>https://{this.props.data.data.storeName}.storevein.com/signin</a></strong>
                    </p>
                  </div>
                  {
                    this.props.data.data.devices?
                      <div style={{paddingTop: 15}}>
                        <div>Your device access:</div>
                        <ul>
                          {
                            this.props.data.data.devices.map((device, key) => 
                              <li key={key}>{device.code}</li> 
                            )
                          }
                        </ul>
                      </div>
                      :
                      ""
                  }
                </div>
                <div style={{ fontSize: "15px", paddingTop: 15 }}>
                  <p>Here’s to your retail success,</p>
                  <p>The CA Solution Team</p>
                </div>
              </div>
            </tr>
            
          </tbody>
        </table>
      </div>
    );
  }
}