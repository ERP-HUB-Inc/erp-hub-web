import moment from "moment";
import _ from "lodash";

export class Util {
  checkValueSwitch(values){
    return values === true ? 1 : 0;
  }
  
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
    var re = /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email);
  }

  
  getAccessToken(key) {
    if (!localStorage.getItem(key)) return null;
    let result = localStorage.getItem(key);
    result = JSON.parse(result);
    return result.accessToken;
  }

  formatDate(value, format="MMM-Do-YYYY h:mm A") {
    return moment(value).format(format);
  }

  formatDatePicker(value, format="YYYY/MM/DD") {
    return moment(value, format);
  }
}