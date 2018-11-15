import React from "react";
import Component from "../../../../common/components/Component";
export default class PrintSummary extends Component {
  render() {
    return (
      <div style={{ width: "100%" }}>
        <table style={{ margin: "0 auto", padding: "0", fontSize: "9.5pt", fontFamily: "Arial", backgroundColor: "white", width: "650px"}}>
          <tbody>
            <tr>
              <td>
                <div style={{ fontSize: "58px", backgroundColor: "white" }}>
                  <span className="icon-logo" style={{ color: "#093163", marginLeft: "40px" }}></span>
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ borderBottom: "3px solid rgba(0, 0, 0, 0.65)", textAlign: "center" }}>
                <img src="https://im-cdn.com/assets/images/online-store/online-store-header.51d264eff63b.png" style={{ height: "222px",width: "632px" }} />
              </td>
            </tr>
            <tr style={{ color: "rgb(104, 104, 104)" }}>
              <div style={{ padding: "49px", backgroundColor: "white", paddingTop: "20px" }}>
                <div style={{ fontWeight: "bold", textAlign: "left", color: "#686868" }}>
                  <h3 style={{ lineHeight:"58px", fontSize: "25px", fontWeight: "bold" }}>Hi mn,</h3>
                </div> 
                <div style={{ fontSize:"15px",lineHeight: "13px" }}>
                  <div style={{ marginBottom: "28px" }}>
                    <p style={{ paddingBottom: "13px" }}>Welcome to your free 30-day Vend trial — we’re glad to have you on board! </p>
                    <p>Here’s your login info so you can explore how Vend has helped over 20,000</p> 
                    <p>retailers just like you save time, boost profitability, and better run their businesses:</p> 
                  </div>
                  <div style={{ lineHeight: "11px" }}>      
                    <p>
                      <strong>Email/username: <a href="#">sopha088@gmail.com</a></strong> 
                    </p>
                    <p>
                      <strong>Sign-in page: <a href="#">https://phanna.vendhq.com/signin</a></strong>
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: "center", marginTop: "29px" }}>
                  <button style={{ backgroundColor: "#093163", color: "white",padding: "10px", width: "130px", border: "none", borderRadius: "4px", textTransform: "uppercase" }}>
                  Test Send
                  </button>
                </div>
                <p style={{ paddingBottom: "16px" }}>&nbsp;</p>
                <div style={{ fontSize: "15px" }}>
                  <p>Here’s to your retail success,</p>
                  <p>The CA Team</p>
                </div>
                <p>&nbsp;</p>
                <div>
                  <em>P.S. Vend works best on Google Chrome if you’re using a Mac or PC. Click here to download Chrome for free. And if you’re using
                     Vend on iPad, you’ll need to log into the web version of Vend when you’re ready to set up your account with your own products.</em>
                </div>
              </div>
            </tr>
            
          </tbody>
        </table>
      </div>
    );
  }
}