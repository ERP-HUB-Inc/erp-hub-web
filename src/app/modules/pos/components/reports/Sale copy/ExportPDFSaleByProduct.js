
import React,{useEffect,useState} from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin } from "antd";
import ReportSaleService from "../../../services/report/SaleService";
import Util from "../../../../common/util";
import "../preview-pdf.css";


export default function ExportPDFSaleByProduct() {
  const [datas, setDatas] = useState([]);
  const [loading,setLoading] = useState(true);
  const valueLocalStorage = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
  const params = new URLSearchParams(document.location.search);
  const title = "MONTHLY SALE BY PRODUCT REPORT";
 
  let revenue = 0; 
  let discount = 0; 
  let netSale = 0; 
  let costOfGoods = 0; 
  let grossProfit = 0; 
  useEffect(() => {
    document.title =  title;
    let option = {};
    
    if (params.has("startDate")) {
      option["startDate"] = params.get("startDate");
    }

    if (params.has("endDate")) {
      option["endDate"] = params.get("endDate");
    }
    if (params.has("supplierId")) {
      option["supplierId"] = params.get("supplierId");
    }
    if (params.has("search")) {
      option["search"] = params.get("search");
    }
    ReportSaleService.getReportSummaryByProduct(option).then(response => {
      if (response.data) {
        const { summaryByProducts } = response.data;
        setDatas(summaryByProducts);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line
  },[]);

  const getProfit = (profit, record) => {
    const netSale = record.revenue - record.discount;
    profit = netSale - record.cost;
    grossProfit += profit;
    return new Util().formatCurrency(profit);
  };

  const getMargin = (margin, record) => {
    if (record.revenue > 0) {
      const profit = record.revenue - record.cost;
      margin = (profit / record.revenue) * 100;
    } else {
      margin = -1 * 100;
    }

    return new Util().formatPercentage(margin);
  };

  return <React.Fragment>
      <div id="toolbar" style={{backgroundColor: "rgb(50 54 57)"}}>
          <div style={{width: "320mm", height: 60, display: "flex", justifyContent: "space-between", alignItems: "center", margin: "0 auto"}}>
              <span style={{fontSize: "0.87rem", color: "white", fontWeight: 500, paddingLeft: 15}}>{`${title}.pdf`}</span>
              <Button shape="circle" icon={"printer"} onClick={() => window.print()} />
          </div>
      </div>
      <div style={{height: 25 ,backgroundColor: "rgb(82 86 89)"}} id="space-block" />
      <div id="export-pdf" style={{backgroundColor: "rgb(82 86 89)", width: "100%", height: window.innerWidth + 120}}>
          <div style={{width: "297mm", height: "100%", backgroundColor: "#fff", padding: 25, margin: "auto", position: "relative"}}>
            {
              loading ? <Spin spinning={loading} id="spinner"/>
              : <React.Fragment>
                  <table style={{marginBottom: 15, width: "100%"}}>
                  <tbody>
                      <tr>
                          <td colSpan="2" style={{textAlign: "center", paddingBottom: 67 ,backgroundColor: "rgb(255, 255, 255)"}}>
                          <img src={valueLocalStorage.setting.logo ? `${new Util().getProductImage(valueLocalStorage.setting.logo,"general").url}`: ""} style={{width: 100, position: "absolute", left: 15, top: 20 ,height: 100 ,objectFit:"cover"}} alt="logo" />
                              <span style={{fontSize: 25, fontWeight: "bold"}}>
                                  {title}
                              </span>
                          </td>
                      </tr>
                    
                  </tbody>
              </table>
              <table className="data-table" style={{width: "100%"}}>
                  <thead>
                      <tr>
                          <th style={{textAlign: "center"}}>#</th>
                          <th><Translate id="text_product" /></th>
                          <th><Translate id="text_variant" /></th>
                          <th><Translate id="text_barcode" /></th>
                          <th><Translate id="text_quantity" /></th>
                          <th><Translate id="text_revenue" /></th>
                          <th><Translate id="text_discount" /></th>
                          <th><Translate id="text_net_sale" /></th>
                          <th><Translate id="text_cost_of_good" /></th>
                          <th><Translate id="text_gross_profit" /></th>
                          <th><Translate id="text_margin" /></th>
              
                      </tr>
                  </thead>
                  <tbody>
                      {
                          datas.map((data, index) => 
                              { 
                                  revenue +=  data.revenue;
                                  discount += data.discount;
                                  netSale += data.revenue - data.discount;
                                  costOfGoods += data.cost;
                                  return <tr key={index}>
                                    <td style={{width: 60, textAlign: "center"}}>{index + 1}</td>
                                    <td>{data.name}</td>
                                    <td style={{textAlign: "center"}}>{data.variant}</td>
                                    <td style={{textAlign: "center"}}>{data.barcode}</td>
                                    <td style={{textAlign: "center"}}>{`${data.quantity} ${data.unitName ? data.unitName : ""}`}</td>
                                    <td style={{textAlign: "center"}}>{new Util().formatCurrency(data.revenue)}</td>
                                    <td style={{textAlign: "center"}}>{new Util().formatCurrency(data.discount)}</td>
                                    <td style={{textAlign: "center"}}>{new Util().formatCurrency(data.revenue - data.discount)}</td>
                                    <td style={{textAlign: "center"}}>{new Util().formatCurrency(data.cost)}</td>
                                    <td style={{textAlign: "center"}}>{getProfit(data.profit,data)}</td>
                                    <td style={{textAlign: "center"}}>{getMargin(data.margin,data)}</td> 
                                  </tr>;
                              }  
                          )
                      }
                  </tbody>
                  <tfoot>
                      <tr>
                        <td colSpan={5} className="tfoot-colspan"></td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(revenue)}</td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(discount)}</td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(netSale)}</td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(costOfGoods)}</td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(grossProfit)}</td>
                        <td className="tfoot-colspan"></td>
                      </tr>
                  </tfoot>
              </table>

              </React.Fragment>
            }    
          </div>
          <div style={{height: 25 ,backgroundColor: "rgb(82 86 89)"}} id="space-block" />
      </div>
    </React.Fragment>;
}
