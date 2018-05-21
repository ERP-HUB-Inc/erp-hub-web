console.log("======Action Loaded======");
// export const addProduct = name => ({
//   type: "ADD_PRODUCT",
//   name
// });

export function addProduct(name) {
  return {
    type: "ADD_PRODUCT",
    name
  };
}