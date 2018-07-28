import moment from "moment";
import _ from "lodash";

export function Email(value = "") {
  return value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
}

//Validation input
export function validation(rules) { 
  const errors = {};
  const type = {};
  for(var field in rules){
    var rule = rules[field];
    var values = rule["value"];
    var gettype = rule["type"];
    // var type = rule["type"];
    console.log("gettype", gettype);

    if(!values){
      errors[field] = "The Field is required"; 
    }else if(type[gettype] = "email" && !Email(values)){
      errors[field] = "The Field is email";
    }else{
      errors[field] = ""; 
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
      (rule["required"] === true && value === null) ||
        (typeof value === "string" && value.trim() === "")
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

export class Util {
  findArrayIndex(collection, prop, value) {
    return _.findIndex(collection, [prop, value]);
  }

  mapWithKey(datas) {
    datas.map((element, index) => {
      return element.key = index;
    });
  }

  renameObjectKey(template, source) {
    return source.map((value1, key1) => {
      var renameResult = _.mapKeys(value1, function(value, key) {
        return template[key];
      });
      return renameResult;
    });
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  isValidFormSubmit(requiredField, formValues) {
    let valid = false;

    if (requiredField == null) return valid;

    if (formValues != null && "values" in formValues) {
      const reduxFormValues = formValues.values;
      for (const prop in requiredField) {
        if (reduxFormValues[prop] == null || reduxFormValues[prop] == "undefined") {
          valid = true;
        } else {
          valid = false;
        }
      }
    } else {
      valid = false;
    }

    return valid;
    // to disable button we need to return true
  }
}