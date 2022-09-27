import React from "react";
import {
  Statistic,
  PageHeader,
  Table,
  Select,
  DatePicker,
  Card,
  Row,
  Col,
  Input,
} from "antd";
import { Translate } from "react-localize-redux";
import moment from "moment";
import ExportForm from "./ExportForm";
import Util from "../../../../common/util";
import LocationService from "../../../services/settings/LocationService";
import AdjustmentService from "../../../services/report/AdjustmentService";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ReportProduct() {
  const [loading, setLoading] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [startDate, setStartDate] = React.useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = React.useState(
    moment().endOf("month").format("YYYY-MM-DD")
  );
  const [data, setData] = React.useState(null);
  const [locations, setLocations] = React.useState([]);
  const [locationId, setLocationId] = React.useState(0);
  const [summary, setSummary] = React.useState(null);
  const { Search } = Input;
  const pathName = "/reports/adjustment-report";
  const util = new Util();

  const onChangeSearch = (event) => {
    const queryparam = new URLSearchParams(document.location.search);
    const similarSearch = event.target.value;
    if (similarSearch) {
      queryparam.set("search", similarSearch);
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue(similarSearch);
      fetchReport(similarSearch, locationId, startDate, endDate);
    } else {
      queryparam.delete("search");
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue("");
      fetchReport("", locationId, startDate, endDate);
    }
  };

  const onChangeLocation = (selectLocationId) => {
    const queryparam = new URLSearchParams(document.location.search);
    setLocationId(parseInt(selectLocationId));
    queryparam.set("locationId", selectLocationId);
    util.pushParamsToURL(pathName, queryparam.toString());
    fetchReport(searchValue, selectLocationId, startDate, endDate);
  };

  const onChangeDate = (values) => {
    const queryparam = new URLSearchParams(document.location.search);
    const fromDate = moment(values[0]).format("YYYY-MM-DD");
    const toDate = moment(values[1]).format("YYYY-MM-DD");
    queryparam.set("startDate", fromDate);
    queryparam.set("endDate", toDate);
    setStartDate(fromDate);
    setEndDate(toDate);
    util.pushParamsToURL(pathName, queryparam.toString());
    fetchReport(searchValue, locationId, fromDate, toDate);
  };

  const fetchReport = (search, locationId, startDate, endDate) => {
    setLoading(true);
    let option = {};
    if (search) {
      option["search"] = search;
    }
    option["locationId"] = locationId;
    option["startDate"] = moment(startDate).format("YYYY-MM-DD");
    option["endDate"] = moment(endDate).format("YYYY-MM-DD");
    AdjustmentService.getAdjustmentReport(option)
      .then((response) => {
        if (response && response.data) {
          const data = response.data;
          setSummary(data.summary);
          setData(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    const queryparam = new URLSearchParams(document.location.search);
    let fromDate = startDate;
    let toDate = endDate;
    let search = searchValue;
    let location = locationId;
    if (queryparam.has("startDate")) {
      fromDate = queryparam.get("startDate");
      setStartDate(moment(fromDate));
    }
    if (queryparam.has("endDate")) {
      toDate = queryparam.get("endDate");
      setEndDate(moment(toDate));
    }
    if (queryparam.has("search")) {
      search = queryparam.get("search");
      setSearchValue(search);
    }
    if (queryparam.has("locationId")) {
      location = queryparam.get("locationId");
      setLocationId(parseInt(location));
    }
    fetchReport(search, location, fromDate, toDate);

    LocationService.lists(50).then((response) => {
      if (response.data && response.data.data) {
        setLocations(response.data.data);
      }
    });
    //eslint-disable-next-line
  }, []);

  let currentStockValueByCost = 0;
  let currentStockValueByPrice = 0;
  let expectedProfit = 0;
  let expectedMargin = 0;

  if (summary) {
    currentStockValueByCost = summary.currentStockValueByCost;
    currentStockValueByPrice = summary.currentStockValueByPrice;
    expectedProfit = summary.expectedProfit;
    expectedMargin = summary.expectedMargin;
  }

  return (
    <div id="report-sale">
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        backIcon={""}
        title={"Adjustment Report"}
        subTitle=""
        extra={[
          <div key={1} style={{ display: "flex" }}>
            <Search
              placeholder="Search product by name,barcode"
              onChange={onChangeSearch}
              style={{ width: "280px" }}
              allowClear={true}
              value={searchValue}
            />
            <Select
              name="locationId"
              style={{ width: 200, marginLeft: 15, marginRight: 15 }}
              value={locationId}
              onChange={onChangeLocation}
            >
              {[{ name: <Translate id="text_all_store" />, id: 0 }]
                .concat(locations)
                .map((value, key) => (
                  <Option key={key} value={value.id}>
                    {value.name}
                  </Option>
                ))}
            </Select>
            <div style={{ width: "280px" }}>
              <RangePicker
                name="dates"
                value={[moment(startDate), moment(endDate)]}
                onChange={onChangeDate}
                allowClear={false}
              />
            </div>
          </div>,
        ]}
      />
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Damaged Goods"
              value={currentStockValueByCost}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Leakage"
              value={currentStockValueByPrice}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Incorrect Stock"
              value={expectedProfit}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={"Stolen Goods"}
              value={expectedMargin}
              precision={2}
            />
          </Card>
        </Col>
        <Col span={24}>
          <ExportForm
            locationId={locationId}
            endDate={endDate}
            startDate={startDate}
            searchValue={searchValue}
          />
        </Col>
        <Col span={24}>
          <Table
            rowKey="id"
            bordered={true}
            dataSource={data ? data : []}
            columns={[
              {
                title: <Translate id="text_product_name" />,
                dataIndex: "productName",
                key: "productName",
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode",
              },
              {
                title: <Translate id="text_quantity" />,
                dataIndex: "adjustedQuantity",
                width: 150,
                key: "adjustedQuantity",
              },
              {
                title: "TOTAL AMOUNT",
                dataIndex: "totalAmount",
                width: 150,
                align: "right",
                key: "totalAmount",
                render: (totalAmount) =>
                  totalAmount && new Util().formatCurrency(totalAmount),
              },
              {
                title: "REASON",
                dataIndex: "reason",
                width: 150,
                align: "right",
                key: "reason",
              },
              {
                title: "ADJUSTED BY",
                dataIndex: "adjustedBy",
                width: 150,
                align: "right",
                key: "adjustedBy",
              },
            ]}
            pagination={false}
            loading={loading}
          />
        </Col>
      </Row>
    </div>
  );
}
