

export default [{
  title: "Date",
  dataIndex:"createdAt",
  key: "createdAt",
  sorter: true
}, {
  title: "full Name",
  dataIndex: "firstName",
  sorter: true,
  render: firstName => `${firstName}`
},
{
  title: "Phone No",
  dataIndex: "phoneNumber",
  key: "phoneNumber",
  sorter: true
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