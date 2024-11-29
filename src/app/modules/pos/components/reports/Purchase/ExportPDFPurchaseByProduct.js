
import React,{useEffect,useState} from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin } from "antd";
import  PurchaseService from "../../../services/report/PurchaseService";
import Util from "../../../../common/util";
import Enum from "../../../../inventory/enums";
import "../preview-pdf.css";


export default function  ExportPDFPurcaseByProduct() {
  const [datas, setDatas] = useState([]);
  const [loading,setLoading] = useState(true);
  const valueLocalStorage = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
  const params = new URLSearchParams(document.location.search);
  const title = "MONTHLY PURCHASE BY PRODUCT REPORT";

  let total = 0;
  let option = {};
  useEffect(() => {
    document.title =  title;
    
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

    PurchaseService.getReportSummaryByProduct(option).then(response => {
      if (response.data) {
        setDatas(response.data);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line
  },[]);

  const getProductName = (productName, record) => {
    let variantName = "";
    if (record.productOption === Enum.PRODUCT_VARIANT) {
      variantName = ` / ${record.variantName}`;
    }
    return productName + variantName;
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
                          <td colSpan="2" style={{textAlign: "center", paddingBottom: 67,backgroundColor: "rgb(255, 255, 255)"}}>
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
                          <th><Translate id="text_item_name" /></th>
                          <th><Translate id="text_barcode" /></th>
                          <th><Translate id="text_purchase_date" /></th>
                          <th><Translate id="text_supplier" /></th>
                          <th><Translate id="text_quantity_buy_in" /></th>
                          <th><Translate id="text_unit_cost" /></th>
                          <th><Translate id="text_total" /></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          datas.map((data, index) => 
                              {   
                                total +=  data.total;
                                  return <tr key={index}>
                                    <td style={{width: 60, textAlign: "center"}}>{index + 1}</td>
                                    <td>{getProductName(data.productName,data)}</td>
                                    <td>{data.barcode}</td>
                                    <td>{new Util().formatDate(data.date, "DD/MM/YYYY")}</td>
                                    <td>{data.supplierName}</td>
                                    <td>{`${data.quantity} ${data.unitName ? data.unitName : ""}`}</td>
                                    <td>{new Util().formatCurrency(data.cost)}</td>
                                    <td>{new Util().formatCurrency(data.total)}</td>
                                  </tr>;
                              }  
                          )
                      }
                  </tbody>
                  <tfoot>
                      <tr>
                        <td colSpan={7} className="tfoot-colspan"></td>
                        <td>{(new Util()).formatCurrency(total)}</td>
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
