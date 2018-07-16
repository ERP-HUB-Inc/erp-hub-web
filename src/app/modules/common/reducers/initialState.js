export default function initialState(key="datas") {
  return {
    fetching: false,
    fetched: false,
    [key]: [],
    error: null
  };
}