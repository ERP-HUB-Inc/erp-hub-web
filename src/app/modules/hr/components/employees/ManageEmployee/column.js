
import moment from "moment";

export default [{
  title: "Date",
  dataIndex:"createdAt",
  key: "createdAt",
  render: createdAt => (
    moment(" " + createdAt).format("YYYY/MM/DD")
  ),
  sorter: true
}, {
  title: "full Name",
  dataIndex: "firstName",
  dateIndex: "lastName",
  key: "firstName",
  sorter: true
},
{
  title: "Phone No",
  dataIndex: "phoneNumber",
  key: "phoneNumber"
},
{
  title: "Address",
  dataIndex: "address",
  key: "address",
  sorter: true
},
{
  title: "Status",
  dataIndex: "status",
  key: "status",
  sorter: true
}

];