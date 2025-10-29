export function getLocationId() {
     let currentUser = localStorage.getItem("ACCESS_TOKEN");
     currentUser = JSON.parse(currentUser);
     return currentUser?.locationId;
}