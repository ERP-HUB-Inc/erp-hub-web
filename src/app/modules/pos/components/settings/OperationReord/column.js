import moment from "moment";


export default [{
  title: "Date",
  dataIndex: "createdAt",
  sorter: true,
  // render: (createdAt) =>  (
  //   moment("2018-08-06 17:28:38.575542","YYYY/MM/DD")
  // )
}, {
  title: "Name",  
  dataIndex: "name",  
  sorter: true
},
{
  title: "Record For",
  dataIndex: "registerDate",
  sorter: true  
},
{ 
  title: "Type",
  dataIndex: "type",
  sorter: true,
  render : (type) => type == 0 ? "Income" : "Expense"
},
{
  title: "Amount",
  dataIndex: "amount",
  sorter: true,
  render : (amount) => "$ " + amount 
}
];