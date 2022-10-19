export default [
  {
    name: "Customer",
    nameKH: "គ្រប់គ្រងអតិថិជន",
    code: "customer",
    permissions: [
      {
        name: "Add",
        nameKH: "បន្ថែមថ្មី",
        code: "add"
      },
      {
        name: "Edit",
        nameKH: "កែប្រែ",
        code: "edit"
      },
      {
        name: "Delete",
        nameKH: "លុប",
        code: "delete"
      }
    ]
  },
  {
    name: "Group Customer",
    nameKH: "ក្រុមអតិថិជន",
    code: "group/customer",
    permissions: [
      {
        name: "Add",
        nameKH: "បន្ថែមថ្មី",
        code: "add"
      },
      {
        name: "Edit",
        nameKH: "កែប្រែ",
        code: "edit"
      },
      {
        name: "Delete",
        nameKH: "លុប",
        code: "delete"
      }
    ]
  },
  {
    name: "Front Desk",
    nameKH: "ផ្ទាំងគ្រប់គ្រង",
    code: "front-desk",
    permissions: [
      {
        name: "Add New Rent",
        nameKH: "បន្ថែមព័ត៏មានជួល",
        code: "add"
      },
      {
        name: "Edit Rent Info",
        nameKH: "កែប្រែព័ត៏មានជួល",
        code: "edit"
      },
      {
        name: "Record Utility",
        nameKH: "កត់ទឹកភ្លើង",
        code: "record"
      }
    ]
  },
  {
    name: "Invoice",
    nameKH: "វិក័្កយប័ត្រ",
    code: "payment",
    permissions: [
      {
        name: "Create New Invoice",
        nameKH: "បង្កើតវិក័យបត្រថ្មី",
        code: "add"
      },
      {
        name: "Edit Invoice",
        nameKH: "កែប្រែវិក័យបត្រ",
        code: "edit"
      },
      {
        name: "Receive Payment",
        nameKH: "ទទួលការបង់ប្រាក់",
        code: "receive-payment"
      },
      {
        name: "Delete Invoice",
        nameKH: "លុបវិក័យបត្រ",
        code: "delete"
      },
    ]
  },
  {
    name: "User",
    nameKH: "អ្នកប្រើប្រាស់",
    code: "user",
    permissions: [
      {
        name: "Add",
        nameKH: "បង្កើតថ្មី",
        code: "add"
      },
      {
        name: "Edit",
        nameKH: "កែប្រែ",
        code: "edit"
      },
      {
        name: "Delete",
        nameKH: "លុប",
        code: "delete"
      }
    ]
  },
  {
    name: "Role",
    nameKH: "សិទ្ធអ្នកប្រើប្រាស់",
    code: "role",
    permissions: [
      {
        name: "Add Role",
        nameKH: "បង្កើតសិទ្ធថ្មី",
        code: "add"
      },
      {
        name: "Edit Role",
        nameKH: "កែប្រែសិទ្ធ",
        code: "edit"
      },
      {
        name: "Delete Role",
        nameKH: "លុបសិទ្ធ",
        code: "delete"
      }
    ]
  },
  {
    name: "Location",
    nameKH: "គ្រប់គ្រងទីតាំង",
    code: "location",
    permissions: [
      {
        name: "Add",
        nameKH: "បង្កើតថ្មី",
        code: "add"
      },
      {
        name: "Edit",
        nameKH: "កែប្រែ",
        code: "edit"
      },
      {
        name: "Delete",
        nameKH: "លុប",
        code: "delete"
      }
    ]
  },
  {
    name: "Setting",
    nameKH: "ការកំណត់របស់ប្រព័ន្ធ",
    code: "setting",
    permissions: [
      {
        name: "Edit Owner Account",
        nameKH: "កែប្រែការកំណត់",
        code: "edit"
      },
      {
        name: "Edit Invoice Template",
        nameKH: "កែប្រែគំរូវិក័យបត្រ",
        code: "edit-invoice"
      },
      {
        name: "Edit Currency",
        nameKH: "កែប្រែរូបិយប័ណ្ណ",
        code: "edit-currency"
      }
    ]
  },
  {
    name: "Exchange Rate",
    nameKH: "អត្រាប្តូរប្រាក់",
    code: "currency/exchange",
    permissions: [
      {
        name: "Add Exchnage Rate",
        nameKH: "បង្កើតថ្មី",
        code: "add"
      }
    ]
  },
  {
    name: "Report",
    nameKH: "របាយការណ៏",
    code: "report",
    permissions: [
      {
        name: "Cash Flow Report",
        nameKH: "របាយការណ៏សាច់ប្រាក់",
        code: "view-cash-flow-report"
      },
      {
        name: "Deposit Report",
        nameKH: "របាយការណ៏ប្រាក់កក់",
        code: "view-deposit-report"
      },
      {
        name: "Aging Report",
        nameKH: "របាយការណ៏ជំពាក់",
        code: "view-aging-report"
      },
      {
        name: "Store Report",
        nameKH: "របាយការណ៏តូបសរុប",
        code: "view-store-report"
      },
    ]
  },
  {
    name: "Dashboard",
    nameKH: "ផ្ទាំងមុខ",
    code: "dashboard",
    permissions: [
      {
        name: "View Summary",
        nameKH: "មើលរបាយការណ៏សង្ខែប",
        code: "view-summary"
      }
    ]
  }
];