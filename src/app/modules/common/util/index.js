import moment from "moment";

//Validation input
export function validation(rules) { 
  const errors = {};
  for(var field in rules){
    var rule = rules[field];
    var value = rule["value"];
    console.log("values",field);
    if(!field){
      errors.field = "This field is required";
    }
  }
  return errors;
}

export function validate(rules) {
  var errors = {};
  var isError = false;
  for (var field in rules) {
    var rule = rules[field];
    var value = rule["value"];
    if (
      (rule["required"] == true && value== null) ||
        (typeof value == "string" && value.trim() == "")
    ) {
      errors[field] = "This field is required";
      isError = true;
    }
  }
  return isError ? errors : null;
}

// Convert moment to time
export function toTime(value) {
  const time = moment(value).format("h:mm a");
  return time;
}
  
export function toRelative(value) {
  const relative = moment(value, "YYYYMMDD").fromNow();
  return relative;
}
  
export function toDate(value) {
  const date = moment(value).format("DD/MMMM/YY h:mm a");
  return date;
}