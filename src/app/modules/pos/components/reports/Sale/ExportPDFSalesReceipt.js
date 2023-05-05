
import React,{useEffect,useState} from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin } from "antd";
import moment from "moment";
import ReportSaleService from "../../../services/report/SaleService";
import Util from "../../../../common/util";
import "../preview-pdf.css";


export default function ExportPDFSalesReceipt() {
  const [datas, setDatas] = useState([]);
  const [loading,setLoading] = useState(true);
  const valueLocalStorage = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
  const params = new URLSearchParams(document.location.search);
  const title = "MONTHLY SALES RECEIPT"; 

  useEffect(() => {
    document.title =  title;
    let option = {};
    
    if (params.has("startDate")) {
      option["startDate"] = params.get("startDate");
    }

    if (params.has("endDate")) {
      option["endDate"] = params.get("endDate");
    }
    
    if (params.has("search")) {
      option["search"] = params.get("search");
    }

    ReportSaleService.getReportSalesReceipt(option)
    .then(response => {
      if (response.data) {
        const { salesReceipts } = response.data;
        setDatas(salesReceipts);
      }
    })
    .finally(() => setLoading(false));

    document.getElementsByTagName("body")[0].setAttribute("class", "landscape");
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        @page {
          size: landscape
        }
      }

      #export-pdf .data-table td {
        border: 0px solid black;
        font-size: 14px
      }

      #export-pdf .data-table th {
        font-size: 14px
      }
    `;
    document.getElementById("export-pdf").appendChild(style);

    return () => {
        document.getElementsByTagName("body")[0].setAttribute("class", "");
    };
    // eslint-disable-next-line
  },[]);

  const startDate = params.get("startDate");
  const endDate = params.get("endDate");

  return <React.Fragment>
      <div id="toolbar" style={{backgroundColor: "rgb(50 54 57)"}}>
          <div style={{width: "320mm", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 auto"}}>
              <span style={{fontSize: "0.87rem", color: "white", fontWeight: 500, paddingLeft: 15}}>{`${title}.pdf`}</span>
              <Button shape="circle" icon={"printer"} onClick={() => window.print()} />
          </div>
      </div>
      <div style={{height: 25 ,backgroundColor: "rgb(82 86 89)"}} id="space-block" />
      <div id="export-pdf" style={{backgroundColor: "rgb(82 86 89)", width: "100%", height: window.innerWidth + 120}}>
          <div style={{width: "340mm", height: "100%", backgroundColor: "#fff", padding: 25, margin: "auto", position: "relative"}}>
            {
              loading ? <Spin spinning={loading} id="spinner"/>
              : <React.Fragment>
                  <table style={{marginBottom: 15, width: "100%"}}>
                  <tbody>
                      <tr>
                          <td colSpan="2" style={{textAlign: "center", paddingBottom: 67 ,backgroundColor: "rgb(255, 255, 255)"}}>
                            <img src={valueLocalStorage.setting.logo ? `${new Util().getProductImage(valueLocalStorage.setting.logo,"general").url}`: ""} style={{width: 100, position: "absolute", left: 15, top: 20 ,height: 100 ,objectFit:"cover"}} alt="logo" />
                            <div style={{fontSize: 25, fontWeight: "bold"}}>
                                {title}
                            </div>
                            <div>
                              {moment(startDate).format("DD/MMM/YYYY")} ~ {moment(endDate).format("DD/MMM/YYYY")}
                            </div>
                          </td>
                      </tr>
                    
                  </tbody>
              </table>
              <table className="data-table" style={{width: "100%"}}>
                  <thead>
                      <tr>
                          <th><Translate id="text_customer" /></th>
                          <th><Translate id="text_invoice_date" /></th>
                          <th><Translate id="text_invoice_no" /></th>
                          <th><Translate id="text_description" /></th>
                          <th style={{textAlign: "right"}}><Translate id="text_quantity" /></th>
                          <th style={{textAlign: "right"}}><Translate id="text_sales_price" /></th>
                          <th style={{textAlign: "right"}}><Translate id="text_amount" /></th>
              
                      </tr>
                  </thead>
                  <tbody>
                      {
                        datas.map((data, index1) => {
                          let quantity = 0;
                          let amount = 0;
                          return <React.Fragment>
                            <tr key={index1}>
                              <td colSpan={7}>{data.firstName} {data.lastName} {data.phoneNumber}</td>
                            </tr>
                            { 
                              data.transactionEntries.map((entry, index2) => {
                                quantity += entry.quantity;
                                amount += (entry.quantity * entry.price);

                                return <tr key={`${index1}-${index2}`}>
                                  <td></td>
                                  <td style={{textAlign: "center"}}>{moment(data.invoiceDate).format("DD/MM/YYYY")}</td>
                                  <td style={{textAlign: "center"}}>{data.invoiceNumber}</td>
                                  <td>{entry.description}</td>
                                  <td style={{textAlign: "right"}}>{entry.quantity}</td>
                                  <td style={{textAlign: "right"}}>{new Util().formatCurrency(entry.price)}</td>
                                  <td style={{textAlign: "right"}}>{new Util().formatCurrency(entry.quantity * entry.price)}</td>
                                </tr>;
                              })
                            }
                            <tr>
                              <td colSpan={4}><Translate id="text_total" /> {data.phoneNumber}</td>
                              <td style={{textAlign: "right", borderTop: "2px solid black"}}>{quantity}</td>
                              <td></td>
                              <td style={{textAlign: "right", borderTop: "2px solid black"}}>{new Util().formatCurrency(amount)}</td>
                            </tr>
                          </React.Fragment>;
                        })
                      }
                  </tbody>
              </table>

              </React.Fragment>
            }    
          </div>
          <div style={{height: 25 ,backgroundColor: "rgb(82 86 89)"}} id="space-block" />
      </div>
    </React.Fragment>;
}
