import { connect } from "react-redux";
import ProductList from "../components/ProductList";
import { addProduct } from "../action";

// write as a function
const mapStateToProps = state => ({ 
   products: state.products 
  });

const mapDispatchToProps = dispatch => {
    return {
      todoOnClick: name => {
        dispatch(addProduct(name));
      }
    };
};

// write as a function style 2
// function mapStateToProps(state) {
//   return {products: state.products};
// }

// function mapDispatchToProps(dispatch) {
//   return {
//     todoOnClick: name => {
//       dispatch(addProduct(name));
//     }
//   };
// }

export default connect(mapStateToProps, mapDispatchToProps)(ProductList);

