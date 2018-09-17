import React from "react";
import JsBarcode from "jsbarcode";
import List from "../../List";

export default class ComponentToPrint extends List {
  componentDidUpdate() {
    if (this.props.dataSource.length > 0) {
      this.props.dataSource.forEach(value => {
        const numberOfLabel = Array.from(Array(value["numberOfPrint"]).keys());
        const numberOfRows = this.Util.chuckCollection(numberOfLabel, this.props.numberOfColumn);
        numberOfRows.forEach((row, rowIndex) => {
          row.forEach((rowValue, index) => {
            JsBarcode("#printbarcode" + (index + rowIndex), value["barcode"], {
              font: "monospace",
              width: this.props.widthOfLabel,
              height: this.props.heightOfLabel,
              fontSize: this.props.fontSizeOfValue
            });
          });
        });
      });
    }
  }



  renderRow(rowValue) {
    const numberOfLabel = Array.from(Array(rowValue["numberOfPrint"]).keys());
    const numberOfRows = this.Util.chuckCollection(numberOfLabel, this.props.numberOfColumn);
    return (
      numberOfRows.map((row, rowIndex) =>
        <table key={rowIndex} style={{background: "white", fontFamily: "Consolas", fontWeight: 600}}>
          <tbody>
            <tr>
              { 
                row.map((value, index) => 
                  <td key={index} style={{
                    background: "white",
                    paddingRight: this.props.paddingRight,
                    paddingLeft: this.props.paddingLeft,
                    paddingTop: this.props.paddingTop,
                    paddingBottom: this.props.paddingBottom,
                  }}>
                    <table style={{background: "white"}}>
                      <tbody>
                        <tr>
                          <td colSpan="2" style={{background: "white", textAlign: "center"}}>
                            <img id={`printbarcode${index + rowIndex}`} alt={`barcode${index + rowIndex}`}/>
                          </td>
                        </tr>
                        <tr>
                          <td style={{padding: "0 10px", fontSize: this.props.fontSizeOfName}}>{rowValue.name}</td>
                          <td style={{textAlign: "right", padding: "0 10px", fontSize: this.props.fontSizeOfPrice}}>{rowValue.price}</td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                )
              }
            </tr>
          </tbody>
        </table>
      )
    );
  }
  render() {
    return (<table>
      <tbody>
        <tr>
          <td style={{background: "white", margin: "0 auto"}}>
            {
              this.props.dataSource.map(value => this.renderRow(value))
            }
          </td>
        </tr>
      </tbody>
    </table>
    );
  }
}

ComponentToPrint.defaultProps = {
  dataSource: [],
  widthOfLabel: 2,
  heightOfLabel: 40,
  fontSizeOfValue: 10,
  fontSizeOfName: 12,
  fontSizeOfPrice: 12,
  paddingLeftOfLabel: 0,
  paddingRightOfLabel: 0,
  paddingBottomOfLabel: 0,
  paddingTopOfLabel: 0,
  numberOfColumn: 4
};



