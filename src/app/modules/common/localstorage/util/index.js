
class Util {
  writeItemToCollection(key, item, uniqueKey = "id") {
    let existData = localStorage.getItem(key);

    if (existData) {
      let isNotExist = true;
      existData = JSON.parse(existData);
      if (Array.isArray(existData)) {
        existData.forEach((value, index) => {
          if (value[uniqueKey] === item[uniqueKey]) {
            existData[index] = item;
            isNotExist = false;
          }
        });
      }

      if (isNotExist && Array.isArray(existData)) {
        existData.push(item);
        localStorage.setItem(key, JSON.stringify(existData));
      }
    } else {
      localStorage.setItem(key, JSON.stringify([item]));
    }
  }

  getItemFromCollection(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

export default new Util();