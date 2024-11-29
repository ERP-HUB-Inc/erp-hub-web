import React, { useRef } from "react";
import {
  PageHeader,
  Table,
  Select,
  DatePicker,
  Row,
  Col,
  Input,
} from "antd";
import { Translate } from "react-localize-redux";
import moment from "moment";
import ExportForm from "./ExportForm";
import Util from "../../../../common/util";
import LocationService from "../../../services/settings/LocationService";
import getMovementLogService from "../../../services/report/MovementLog";

const { Option } = Select;
const { RangePicker } = DatePicker;

export default function ReportMovementLog() {
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
  const { Search } = Input;
  const pathName = "/reports/stock-movement-log-report";
  const util = new Util();
  const timerRef = useRef(null);

  const onChangeSearch = (event) => {
    const queryparam = new URLSearchParams(document.location.search);
    const similarSearch = event.target.value;
    if (similarSearch) {
      queryparam.set("search", similarSearch);
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue(similarSearch);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchReport(similarSearch, locationId, startDate, endDate);
      }, 500);
    } else {
      queryparam.delete("search");
      util.pushParamsToURL(pathName, queryparam.toString());
      setSearchValue("");
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        fetchReport("", locationId, startDate, endDate);
      }, 500);

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
    getMovementLogService.getMovementLogServiceReport(option)
      .then((response) => {

        if (response && response.data) {
          setData(response.data);
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

    return () => clearTimeout(timerRef.current);
    //eslint-disable-next-line
  }, []);

  return (
    <div id="report-sale">
      <PageHeader
        style={{
          backgroundColor: "#f7f7f7",
          paddingLeft: 0,
          paddingRight: 0,
        }}
        backIcon={""}
        title={<Translate id="text_movement_log_report" />}
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
                title: <Translate id="text_number_of" />,
                dataIndex: "id",
                key: "id",
                width: 100,
                render: (id, record, index) => index + 1
              },
              {
                title: <Translate id="text_item_name" />,
                dataIndex: "name",
                key: "name",
              },
              {
                title: <Translate id="text_barcode" />,
                dataIndex: "barcode",
                key: "barcode",
              },
              {
                title: <Translate id="text_opening_stock" />,
                dataIndex: "openingStock",
                key: "openingStock",
                render: (_, record) => {
                  const stockOut = Math.max(record.beforeOutQuantity - record.afterOutQuantity, 0);
                  const stockIn = Math.max(record.afterInQuantity - record.beforeInQuantity, 0);
                  return record.balance + stockOut - stockIn;
                }
              },
              {
                title: <Translate id="text_stock_in" />,
                dataIndex: "stockIn",
                key: "stockIn",
                render: (_, record) => Math.max(record.afterInQuantity - record.beforeInQuantity, 0)
              },
              {
                title: <Translate id="text_stock_out" />,
                dataIndex: "stockOut",
                key: "stockOut",
                render: (_, record) => Math.max(record.beforeOutQuantity - record.afterOutQuantity, 0)
              },
              {
                title: <Translate id="text_stock_balance" />,
                dataIndex: "balance",
                key: "balance",
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
