export default [{
  title: "Name",
  dataIndex: "name",
  sorter: (a, b) => a.name.length - b.name.length,
}, {
  title: "Description",
  dataIndex: "description",
  defaultSortOrder: "descend",
  sorter: (a, b) => a.age - b.age,
}
];