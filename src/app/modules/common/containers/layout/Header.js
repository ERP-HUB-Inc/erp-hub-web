import { connect } from "react-redux";
import Header from "../../components/layout/Header";

function mapStateToProps(state) {
    return state;
}

export default connect(mapStateToProps)(Header);