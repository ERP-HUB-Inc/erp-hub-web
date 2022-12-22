import axios from "axios";
import Util from "../../../../../common/util";

const util = new Util();
const port = process.env.REACT_APP_API_PRE_PROD_PORT;
const host = process.env.REACT_APP_API_HOST;
const storeName = JSON.parse(localStorage.getItem("ACCESS_TOKEN")).setting
  .storeName;

let url = `${host}:${port}`;
const headers = {
  "Content-Type": "application/json",
  store: storeName,
  Authorization: `Bearer ${util.getAccessToken()}`,
};

// General
export function getGeneralSetting() {
  return axios({
    method: "GET",
    headers,
    url: `${url}/web_settings`,
  });
}

export function updateGeneralSetting(data) {
  return axios({
    method: "PUT",
    headers,
    url: `${url}/web_settings`,
    data,
  });
}

// Banner
export function getBannerSetting() {
  return axios({
    method: "GET",
    headers,
    url: `${url}/admin/banners`,
  });
}

export function getBannerSettingById(id) {
  return axios({
    method: "GET",
    headers,
    url: `${url}/banners/${id}`,
  });
}

export function createBannerSetting(data) {
  return axios({
    method: "POST",
    headers,
    url: `${url}/banners`,
    data,
  });
}

export function updateBannerSetting(id, data) {
  return axios({
    method: "PUT",
    headers,
    url: `${url}/banners/${id}`,
    data,
  });
}

export function achiveBannerSetting(id) {
  return axios({
    method: "DELETE",
    headers,
    url: `${url}/banners/${id}`,
  });
}

//  Featured Products
export function getFeaturedProducts() {
  return axios({
    method: "GET",
    headers,
    url: `${url}/featured_products`,
  });
}

export function updateFeaturedProducts(data) {
  return axios({
    method: "PUT",
    headers,
    url: `${url}/featured_products`,
    data,
  });
}

// Menu Items Builder

export function getMenuItems(){
  return axios({
    method: "GET",
    headers,
    url: `${url}/menu_items`,
  });
}

export function getMenuItemsById(id){
  return axios({
    method: "GET",
    headers,
    url: `${url}/menu_items/${id}`,
  });
}

export function createMenuItem(data) {
  return axios({
    method: "POST",
    headers,
    url: `${url}/menu_items`,
    data,
  });
}

export function updateMenuItem(id,data) {
  return axios({
    method: "PUT",
    headers,
    url: `${url}/menu_items/${id}`,
    data,
  });
}

export function achiveMenuItem(id){
  return axios({
    method: "DELETE",
    headers,
    url: `${url}/menu_items/${id}`,
  });
}

export function getChildMenuItems(){
  return axios({
    method: "GET",
    headers,
    url: `${url}/menu_items/sub_menu_items`,
  });
}
