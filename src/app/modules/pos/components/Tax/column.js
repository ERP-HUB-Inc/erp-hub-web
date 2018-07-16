export default [{
  title: "Name",
  dataIndex: "name",
  sorter: true,
  render: name => `${name.first} ${name.last}`
}, {
  title: "Rate",
  dataIndex: "email",
  sorter: true
}];