
import React,{useEffect,useState} from "react";
import { Translate } from "react-localize-redux";
import { Button, Spin } from "antd";
import moment from "moment";
import IncomeExpenseService from "../../../services/report/IncomeExpenseService";
import Util from "../../../../common/util";
import "./preview-pdf.css";


export default function PrintPDF() {
  const [datas, setDatas] = useState([]);
  const [loading,setLoading] = useState(true);
  const valueLocalStorage = JSON.parse(window.localStorage.getItem("ACCESS_TOKEN"));
  const params = new URLSearchParams(document.location.search);
  const title = "Expense Report";
 
  let total = 0; 
  useEffect(() => {
    document.title =  title;
    let option = {};
    
    if (params.has("startDate")) {
      option["startDate"] = params.get("startDate");
    }

    if (params.has("endDate")) {
      option["endDate"] = params.get("endDate");
    }

    IncomeExpenseService.getExpenses(option)
    .then(response => {
      if (response.data) {
        setDatas(response.data);
      }
    })
    .finally(() => setLoading(false));
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
                          <td colSpan="2" style={{textAlign: "center", paddingBottom: 67 ,backgroundColor: "rgb(255, 255, 255)"}}>
                          <img src={valueLocalStorage.setting.logo ? `${new Util().getProductImage(valueLocalStorage.setting.logo,"general").url}`: ""} style={{width: 100, position: "absolute", left: 15, top: 20 ,height: 100 ,objectFit:"cover"}} alt="logo" />
                              <span style={{fontSize: 25, fontWeight: "bold"}}>
                                  {title}
                              </span>
                              {
                                params.get("startDate") &&
                                <div>
                                  {moment(params.get("startDate")).format("DD/MM/YYYY")} ~ {moment(params.get("endDate")).format("DD/MM/YYYY")}
                                </div> 
                              }
                          </td>
                      </tr>
                    
                  </tbody>
              </table>
              <table className="data-table" style={{width: "100%"}}>
                  <thead>
                      <tr>
                          <th style={{textAlign: "center"}}>#</th>
                          <th><Translate id="text_date" /></th>
                          <th><Translate id="text_category" /></th>
                          <th><Translate id="text_recorded_by" /></th>
                          <th><Translate id="text_recorded_date" /></th>
                          <th style={{textAlign: "center"}}><Translate id="text_amount" /></th>
                      </tr>
                  </thead>
                  <tbody>
                      {
                          datas.map((data, index) => 
                              { 
                                  total += data.amount;

                                  return <tr key={index}>
                                    <td style={{width: 60, textAlign: "center"}}>{index + 1}</td>
                                    <td>{moment(data.date).format("DD/MM/YYYY")}</td>
                                    <td>{data.name}</td>
                                    <td style={{textAlign: "center"}}>{data.recordedBy}</td>
                                    <td>{moment(data.recordedAt).format("DD/MM/YYYY")}</td>
                                    <td style={{textAlign: "right"}}>{new Util().formatCurrency(data.amount)}</td>
                                  </tr>;
                              }  
                          )
                      }
                  </tbody>
                  <tfoot>
                      <tr>
                        <td colSpan={5} className="tfoot-colspan"></td>
                        <td style={{textAlign: "center"}}>{new Util().formatCurrency(total)}</td>
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
