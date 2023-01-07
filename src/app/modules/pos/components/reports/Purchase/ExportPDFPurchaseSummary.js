
import React,{useEffect,useState} from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin } from "antd";
import  PurchaseService from "../../../services/report/PurchaseService";
import Util from "../../../../common/util";
import "../preview-pdf.css";


export default function  ExportPDFPurcaseByProduct() {
  const [datas, setDatas] = useState([]);
  const [loading,setLoading] = useState(true);
  const valueLocalStorage = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
  const params = new URLSearchParams(document.location.search);
  const title = "MONTHLY PURCHASE SUMMARY REPORT";
 
  let option = {};
  useEffect(() => {
    document.title =  title;
    
    if (params.has("startDate")) {
      option["startDate"] = params.get("startDate");
    }

    if (params.has("endDate")) {
      option["endDate"] = params.get("endDate");
    }
  
    PurchaseService.getReportSummary(option).then(response => {
      if (response.data) {
        setDatas(response.data);
      }
    }).finally(() => setLoading(false));
    // eslint-disable-next-line
  },[]);

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
                          <td colSpan="2" style={{textAlign: "center", paddingBottom: 67}}>
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
                          <th><Translate id="text_date" /></th>
                          <th><Translate id="text_description" /></th>
                          <th><Translate id="text_number" /></th>
                          <th><Translate id="text_receiver"/></th>
                          <th><Translate id="text_supplier" /></th>
                          <th><Translate id="text_location" /></th>
                          <th><Translate id="text_items" /></th>
                          <th><Translate id="text_total" /></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          datas.map((data, index) => 
                              {    
                                  return <tr key={index}>
                                    <td style={{width: 60, textAlign: "center"}}>{index + 1}</td>
                                    <td>{(new Util()).formatDate(data.date, "DD/MM/YYYY")}</td>
                                    <td>{data.description}</td>
                                    <td>{data.number}</td>
                                    <td>{data.receiverName}</td>
                                    <td>{data.supplierName}</td>
                                    <td>{data.locationName}</td>
                                    <td>{data.numberOfItem}</td>
                                    <td>{(new Util()).formatCurrency(data.total)}</td>
                                  </tr>;
                              }  
                          )
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
