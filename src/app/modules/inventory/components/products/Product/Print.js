import React from "react";
import JsBarcode from "jsbarcode";

export default class ComponentToPrint extends React.Component {
  componentDidUpdate() {
    if (this.props.dataSource.length > 0) {
      this.props.dataSource.forEach((value, index) => {
        JsBarcode("#barcode" + index, "101029383" + index, {
          font: "monospace",
          height: 40,
          fontSize: 12
        });
      });
    }
  }
  render() {
    return (
      <table style={{margin: "0 auto", background: "white", fontFamily: "Consolas", fontWeight: 600, fontSize: "12px"}}>
        <tbody>
          {
            this.props.dataSource.map((value, index) => 
              <tr key={index}>
                <td style={{background: "white"}}>
                  <table style={{background: "white", border: "1px solid #fdf5f5"}}>
                    <tbody>
                      <tr>
                        <td colSpan="2" style={{background: "white"}}><img id={`barcode${index}`} /></td>
                      </tr>
                      <tr>
                        <td style={{padding: "0 10px"}}>Name</td>
                        <td style={{textAlign: "right", padding: "0 10px"}}>$100.00</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
    );
  }
}

ComponentToPrint.defaultProps = {
  dataSource: []
};



