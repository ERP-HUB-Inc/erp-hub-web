import React from "react";
import Component from "../../../../common/components/Component";
export default class PrintSummary extends Component {
  render() {
    let currentUser = this.getCurrentUser();
    let userName = "";
    if (currentUser && currentUser.currentUser) {
      userName = currentUser.currentUser.fullName;
    }

    return (
      <div id="print-sale-summary" style={{display: "none"}}>
        <table style={{width: "100%", fontSize: "9.5pt", fontFamily: "Arial"}}>
          <tbody>
            <tr>
              <td colSpan="2" style={{backgroundColor: "white", fontSize: "30px", fontWeight: 600, paddingBottom: 15}}>
                <this.Translate id="text_title_open_sale" />
              </td>
            </tr>
            <tr>
              <td style={{backgroundColor: "white"}}>
                <this.Translate id="text_current_user" />: {userName}
              </td>
              <td style={{backgroundColor: "white"}}>
                <this.Translate id="text_open_time" />: {this.Util.formatDateTime(this.props.dataHeader.createdAt)}
              </td>
            </tr>
            <tr>
              <td style={{backgroundColor: "white"}}>
                <this.Translate id="text_store" />: {this.props.dataHeader.location.name}
              </td>
              <td style={{backgroundColor: "white"}}>
                <this.Translate id="text_close_time" />: {this.Util.formatDateTime(this.props.dataHeader.updatedAt)}
              </td>
            </tr>
            <tr>
              <td colSpan="2" style={{backgroundColor: "white"}}>
                <table style={{width: "100%", backgroundColor: "white", fontSize: "9.5pt"}}>
                  <thead>
                    <tr>
                      <th style={{borderBottom: "1px solid rgb(212, 203, 203)", backgroundColor: "white", textAlign: "left", paddingBottom: 5}}>
                        <this.Translate id="text_payment_method" />
                      </th>
                      <th style={{borderBottom: "1px solid rgb(212, 203, 203)", backgroundColor: "white", width: 150, textAlign: "right", paddingBottom: 5}}>
                        <this.Translate id="text_expected" />
                      </th>
                      <th style={{borderBottom: "1px solid rgb(212, 203, 203)", backgroundColor: "white", width: 150, textAlign: "right", paddingBottom: 5}}>
                        <this.Translate id="text_count" />
                      </th>
                      <th style={{borderBottom: "1px solid rgb(212, 203, 203)", backgroundColor: "white", width: 150, textAlign: "right", paddingBottom: 5}}>
                        <this.Translate id="text_difference" />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.props.summaryList.map((value, index) => 
                        <tr key={index}>
                          <td style={{backgroundColor: "white", paddingTop: 5}}>
                            {value.name}
                          </td>
                          <td style={{textAlign: "right", backgroundColor: "white"}}>
                            {this.formatCurrency(value.expected, "")}
                          </td>
                          <td style={{textAlign: "right", backgroundColor: "white"}}>
                            {this.formatCurrency(value.count, "")}
                          </td>
                          <td style={{textAlign: "right", backgroundColor: "white"}}>
                            {this.formatCurrency(value.count - value.expected, "")}
                          </td>
                        </tr>
                      )
                    }
                  </tbody>
                  <tfoot>
                    <tr>
                      <td style={{borderBottom: "1px solid white", borderTop: "1px solid rgb(212, 203, 203)", fontWeight: 500, backgroundColor: "white", textTransform: "uppercase", paddingTop: 5}}>
                        <this.Translate id="text_total" />
                      </td>
                      <td style={{borderBottom: "1px solid white", borderTop: "1px solid rgb(212, 203, 203)", textAlign: "right", fontWeight: 500, backgroundColor: "white"}}>
                        {this.formatCurrency(this.props.totalSummary.expected, "")}
                      </td>
                      <td style={{borderBottom: "1px solid white", borderTop: "1px solid rgb(212, 203, 203)", textAlign: "right", fontWeight: 500, backgroundColor: "white"}}>
                        {this.formatCurrency(this.props.totalSummary.count, "")}
                      </td>
                      <td style={{borderBottom: "1px solid white", borderTop: "1px solid rgb(212, 203, 203)", textAlign: "right", fontWeight: 500, backgroundColor: "white"}}>
                        {this.formatCurrency(this.props.totalSummary.difference, "")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}