import React from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import List from "../../List";
import Enum from ".././../../enums";

export default class ComponentToPrint extends List {
  componentDidMount() {

  }
  
  componentDidUpdate() {
    if (this.props.dataSource.length > 0) {
      this.props.dataSource.forEach((value, dataIndex) => {
        const numberOfLabel = Array.from(Array(value["numberOfPrint"]).keys());
        const numberOfRows = this.Util.chuckCollection(numberOfLabel, this.props.numberOfColumn);
        numberOfRows.forEach((row, rowIndex) => {
          if (value["barcode"]) {
            row.forEach((rowValue, index) => {
              if (this.props.isGenerateQR === Enum.TYPE_OF_PRINT.QR) {
                QRCode.toDataURL(value["barcode"])
                  .then(url => {
                    const imageElement = document.getElementById(`printbarcode${index}${rowIndex}`);
                    if (imageElement) {
                      imageElement.src = url;
                    }
                  })
                  .catch(err => {
                    console.error(err);
                  });
              } else {
                JsBarcode(`#printbarcode${index}${rowIndex}${dataIndex}`, value["barcode"], {
                  font: "monospace",
                  width: this.props.widthOfLabel,
                  height: this.props.heightOfLabel,
                  fontSize: this.props.fontSizeOfValue
                });
              }
            });
          }
        });
      });
    }
  }

  renderRow(rowValue, dataIndex) {
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
                            {
                              this.props.isGenerateQR === Enum.TYPE_OF_PRINT.QR ?
                                <img style={{width: this.props.widthOfLabel * 10, height: this.props.heightOfLabel * 10}} id={`printbarcode${index}${rowIndex}`} alt={`barcode${index}${rowIndex}`}/>
                                :
                                <img id={`printbarcode${index}${rowIndex}${dataIndex}`} alt={`barcode${index}${rowIndex}${dataIndex}`}/>
                            }
                          </td>
                        </tr>
                        {
                          this.props.isGenerateQR === Enum.TYPE_OF_PRINT.QR ?
                            <tr>
                              <td colSpan="2" style={{textAlign: "center", padding: "0 10px", fontSize: this.props.fontSizeOfPrice}}>{rowValue.price}</td>
                            </tr>
                            :
                            <tr>
                              <td style={{padding: "0 10px", fontSize: this.props.fontSizeOfName}}>{rowValue.name}</td>
                              <td style={{textAlign: "right", padding: "0 10px", fontSize: this.props.fontSizeOfPrice}}>{rowValue.price}</td>
                            </tr>
                        }
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
    return (<table id="print-tag-content">
      <tbody>
        <tr>
          <td style={{background: "white", margin: "0 auto"}}>
            {
              this.props.dataSource.map((value, dataIndex) => this.renderRow(value, dataIndex))
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



